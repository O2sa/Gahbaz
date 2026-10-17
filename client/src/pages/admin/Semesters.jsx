import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  Stack,
  Text,
  Badge,
  Switch,
  MultiSelect,
  Alert,
  Paper,
  Divider,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCalendarEvent,
  IconBook,
  IconRocket,
  IconInfoCircle,
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useSemesters,
  useUpdateSemester,
  useDeleteSemester,
  useStartSemester,
} from '../../hooks/useSemesters.js'
import { useMajors } from '../../hooks/useMajors.js'
import dayjs from 'dayjs'

export default function Semesters() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [startOpened, { open: openStart, close: closeStart }] = useDisclosure(false)
  const [editSemester, setEditSemester] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const { data: semestersRes, isLoading } = useSemesters({
    page,
    limit,
    search: debouncedSearch,
  })
  const { data: majorsRes } = useMajors({ limit: 100 })

  const majorOptions = (majorsRes?.data || []).map((m) => ({
    value: m._id || m.id,
    label: `${m.name} (${m.college?.name || 'الكلية'})`,
  }))

  const startMutation = useStartSemester()
  const updateMutation = useUpdateSemester()
  const deleteMutation = useDeleteSemester()

  // Start Semester Wizard Form
  const startForm = useForm({
    initialValues: {
      name: `فصل الخريف ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      addDropDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      selectedMajors: [],
      allSemesters: true,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'مسمى الفصل الدراسي مطلوب' : null),
      selectedMajors: (val) => (val.length === 0 ? 'يرجى اختيار تخصص واحد على الأقل' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      completed: false,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الفصل مطلوب' : null),
    },
  })

  const handleStartSubmit = async (values) => {
    try {
      const payload = {
        semesterData: {
          name: values.name,
          startDate: new Date(values.startDate),
          endDate: new Date(values.endDate),
          addDropDeadline: new Date(values.addDropDeadline),
        },
        majors: values.selectedMajors.map((mId) => ({
          majorId: mId,
          allSemesters: Boolean(values.allSemesters),
        })),
      }
      await startMutation.mutateAsync(payload)
      startForm.reset()
      closeStart()
    } catch (err) {
      // Handled in notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditSemester(row)
    editForm.setValues({
      name: row.name || '',
      completed: Boolean(row.completed),
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editSemester) return
    try {
      await updateMutation.mutateAsync({
        id: editSemester._id || editSemester.id,
        data: values,
      })
      setEditSemester(null)
    } catch (err) {
      // Handled in notifications
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    } catch (err) {
      // Handled in notifications
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'الفصل الدراسي',
      render: (row) => (
        <Group spacing="xs">
          <IconCalendarEvent size={18} color="#7c3aed" />
          <Link
            to={`/semesters/${row._id || row.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Text
              weight={600}
              size="sm"
              sx={{ '&:hover': { color: '#7c3aed', textDecoration: 'underline' } }}
            >
              {row.name}
            </Text>
          </Link>
        </Group>
      ),
    },
    {
      key: 'major',
      title: 'التخصص والكلية',
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.major?.name ? `${row.major.name} • ${row.major.college?.name || 'الكلية'}` : 'عام'}
        </Badge>
      ),
    },
    {
      key: 'courses',
      title: 'المقررات المفتوحة',
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="outline" size="sm">
          {row.courses?.length || 0} مقرر
        </Badge>
      ),
    },
    {
      key: 'dates',
      title: 'الفترة الزمنية',
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed">
          {row.startDate ? dayjs(row.startDate).format('YYYY/MM/DD') : '—'}
          {' إلى '}
          {row.endDate ? dayjs(row.endDate).format('YYYY/MM/DD') : '—'}
        </Text>
      ),
    },
    {
      key: 'completed',
      title: 'الحالة التشغيلية',
      align: 'center',
      render: (row) => (
        <Badge
          color={row.completed ? 'gray' : 'teal'}
          variant={row.completed ? 'light' : 'filled'}
          size="sm"
        >
          {row.completed ? 'مكتمل' : 'نشط حالياً'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'left',
      render: (row) => (
        <Group spacing={8} position="left">
          <Button
            component={Link}
            to={`/semesters/${row._id || row.id}`}
            size="xs"
            variant="light"
            color="brand"
            leftIcon={<IconBook size={14} />}
          >
            استعراض المقررات
          </Button>
          <ActionIcon
            color="brand"
            variant="light"
            size="sm"
            onClick={() => handleEditOpen(row)}
            title="تعديل الفصل"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف الفصل"
          >
            <IconTrash size={15} />
          </ActionIcon>
        </Group>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="الفصول الدراسية التشغيلية (Academic Semesters)"
        description="إطلاق الفصول الدراسية، توليد المقررات، وتعيين الجداول وقنوات المحادثة للطلاب تلقائياً"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الفصول الدراسية' },
        ]}
        action={
          <Button
            leftIcon={<IconRocket size={16} />}
            color="brand"
            onClick={() => {
              if (majorOptions.length > 0 && startForm.values.selectedMajors.length === 0) {
                startForm.setFieldValue('selectedMajors', [majorOptions[0].value])
              }
              openStart()
            }}
          >
            بدء فصل دراسي جديد (إطلاق المقررات)
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={semestersRes?.data || []}
        meta={semestersRes?.meta}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        emptyTitle="لا توجد فصول دراسية مطلقة بعد"
        emptyDescription="اضغط على زر (بدء فصل دراسي جديد) لاختيار التخصصات وإطلاق المقررات وتسكين الطلاب فوراً."
      />

      {/* Start Semester Multi-Tier Launch Wizard Modal */}
      <Modal
        opened={startOpened}
        onClose={closeStart}
        size="lg"
        title={
          <Group spacing="xs">
            <IconRocket size={20} color="#7c3aed" />
            <Text weight={700}>معالج إطلاق الفصل الدراسي والمقررات</Text>
          </Group>
        }
      >
        <form onSubmit={startForm.onSubmit(handleStartSubmit)}>
          <Stack spacing="md">
            <Alert
              icon={<IconInfoCircle size={16} />}
              title="التسجيل الآلي التلقائي"
              color="indigo"
              radius="md"
            >
              عند بدء الفصل الدراسي، سيقوم النظام تلقائياً بتوليد المقررات الدراسية بناءً على الخطة المعتمدة وتسكين طلاب التخصص المقيدين وتجهيز قنوات المحادثة وسجلات الدرجات فوراً بدون أي إجراء ورقي.
            </Alert>

            <TextInput
              label="مسمى الفصل الدراسي"
              placeholder="مثال: فصل الخريف 2026/2027"
              required
              {...startForm.getInputProps('name')}
            />

            <MultiSelect
              label="التخصصات الأكاديمية المراد إطلاق فصولها"
              placeholder="اختر تخصصاً أو أكثر"
              data={majorOptions}
              required
              searchable
              clearable
              {...startForm.getInputProps('selectedMajors')}
            />

            <Switch
              label="إطلاق جميع المستويات الأكاديمية للتخصص المختار (All Semesters)"
              description="تفعيل جميع قوالب الخطة الدراسية للتخصص دفعة واحدة (المستوى 1، 2، 3 ...)"
              {...startForm.getInputProps('allSemesters', { type: 'checkbox' })}
            />

            <Divider my="xs" label="الجدول الزمني للترم الدراسي" labelPosition="center" />

            <Group grow>
              <TextInput
                label="تاريخ بداية الفصل"
                type="date"
                required
                {...startForm.getInputProps('startDate')}
              />
              <TextInput
                label="تاريخ نهاية الفصل"
                type="date"
                required
                {...startForm.getInputProps('endDate')}
              />
            </Group>

            <TextInput
              label="الموعد النهائي للحذف والإضافة (Add/Drop Deadline)"
              type="date"
              required
              {...startForm.getInputProps('addDropDeadline')}
            />

            <Group position="right" mt="lg">
              <Button variant="default" onClick={closeStart}>
                إلغاء
              </Button>
              <Button
                type="submit"
                color="brand"
                leftIcon={<IconRocket size={16} />}
                loading={startMutation.isPending}
              >
                تأكيد وإطلاق الفصل الدراسي
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Semester Modal */}
      <Modal
        opened={Boolean(editSemester)}
        onClose={() => setEditSemester(null)}
        title={<Text weight={700}>تعديل الفصل الدراسي</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم الفصل الدراسي"
              required
              {...editForm.getInputProps('name')}
            />
            <Switch
              label="تعيين الفصل كفصل مكتمل / منتهي"
              {...editForm.getInputProps('completed', { type: 'checkbox' })}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditSemester(null)}>
                إلغاء
              </Button>
              <Button
                type="submit"
                color="brand"
                loading={updateMutation.isPending}
              >
                حفظ التعديلات
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        opened={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف الفصل الدراسي"
        message="هل أنت متأكد من حذف هذا الفصل الدراسي؟ سيتم حذف جميع المقررات وقنوات المحادثة وسجلات الدرجات المرتبطة به بالتتابع."
        confirmLabel="حذف الفصل"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
