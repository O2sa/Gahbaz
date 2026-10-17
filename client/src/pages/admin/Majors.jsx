import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  Stack,
  Text,
  Badge,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCertificate,
  IconFileAnalytics,
} from '@tabler/icons-react'
import { useParams, Link } from 'react-router-dom'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useMajors,
  useCreateMajor,
  useUpdateMajor,
  useDeleteMajor,
} from '../../hooks/useMajors.js'
import { useColleges } from '../../hooks/useColleges.js'
import dayjs from 'dayjs'

export default function Majors() {
  const { id: collegeId } = useParams()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editMajor, setEditMajor] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const queryParams = {
    page,
    limit,
    search: debouncedSearch,
    ...(collegeId ? { college: collegeId } : {}),
  }
  const { data: majorsRes, isLoading } = useMajors(queryParams)
  const { data: collegesRes } = useColleges({ limit: 100 })

  const collegeOptions = (collegesRes?.data || []).map((c) => ({
    value: c._id || c.id,
    label: c.name,
  }))

  const createMutation = useCreateMajor()
  const updateMutation = useUpdateMajor()
  const deleteMutation = useDeleteMajor()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      department: '',
      college: collegeId || '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم التخصص مطلوب' : null),
      college: (val) => (!val ? 'يرجى اختيار الكلية' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      department: '',
      college: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم التخصص مطلوب' : null),
      college: (val) => (!val ? 'يرجى اختيار الكلية' : null),
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      await createMutation.mutateAsync(values)
      addForm.reset()
      closeAdd()
    } catch (err) {
      // Handled in notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditMajor(row)
    editForm.setValues({
      name: row.name || '',
      department: row.department || '',
      college: row.college?._id || row.college || '',
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editMajor) return
    try {
      await updateMutation.mutateAsync({
        id: editMajor._id || editMajor.id,
        data: values,
      })
      setEditMajor(null)
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
      title: 'اسم التخصص',
      render: (row) => (
        <Group spacing="xs">
          <IconCertificate size={18} color="#7c3aed" />
          <Link
            to={`/majors/${row._id || row.id}/semesterTemplates`}
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
      key: 'college',
      title: 'الكلية التابع لها',
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.college?.name || row.department || 'الكلية الرئيسية'}
        </Badge>
      ),
    },
    {
      key: 'semesterTemplates',
      title: 'الخطة الدراسية',
      align: 'center',
      render: (row) => (
        <Badge color="teal" variant="outline" size="sm">
          {row.semesterTemplates?.length || 0} فصول / مستويات
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'تاريخ الإنشاء',
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed">
          {row.createdAt ? dayjs(row.createdAt).format('YYYY/MM/DD') : '—'}
        </Text>
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
            to={`/majors/${row._id || row.id}/semesterTemplates`}
            size="xs"
            variant="light"
            color="brand"
            leftIcon={<IconFileAnalytics size={14} />}
          >
            الخطة الدراسية والقوالب
          </Button>
          <ActionIcon
            color="brand"
            variant="light"
            size="sm"
            onClick={() => handleEditOpen(row)}
            title="تعديل التخصص"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف التخصص"
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
        title="التخصصات والبرامج الأكاديمية"
        description="إدارة التخصصات، ربطها بالكليات، وإعداد الخطط الدراسية وقوالب الفصول"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          ...(collegeId ? [{ title: 'الكليات', href: '/collages' }] : []),
          { title: 'التخصصات' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={() => {
              addForm.setFieldValue('college', collegeId || collegeOptions[0]?.value || '')
              openAdd()
            }}
          >
            إضافة تخصص جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={majorsRes?.data || []}
        meta={majorsRes?.meta}
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
        emptyTitle="لا توجد تخصصات مسجلة"
        emptyDescription="ابدأ بإضافة تخصصات لتوزيع الطلاب والخطط الدراسية عليها."
      />

      {/* Add Major Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>إضافة تخصص أكاديمي جديد</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم التخصص"
              placeholder="مثال: هندسة البرمجيات"
              required
              {...addForm.getInputProps('name')}
            />
            <Select
              label="الكلية التابع لها التخصص"
              placeholder="اختر الكلية"
              data={collegeOptions}
              required
              searchable
              {...addForm.getInputProps('college')}
            />
            <TextInput
              label="القسم الأكاديمي (اختياري)"
              placeholder="مثال: قسم علوم الحاسوب"
              {...addForm.getInputProps('department')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={closeAdd}>
                إلغاء
              </Button>
              <Button
                type="submit"
                color="brand"
                loading={createMutation.isPending}
              >
                إضافة
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Major Modal */}
      <Modal
        opened={Boolean(editMajor)}
        onClose={() => setEditMajor(null)}
        title={<Text weight={700}>تعديل التخصص</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم التخصص"
              required
              {...editForm.getInputProps('name')}
            />
            <Select
              label="الكلية التابع لها التخصص"
              placeholder="اختر الكلية"
              data={collegeOptions}
              required
              searchable
              {...editForm.getInputProps('college')}
            />
            <TextInput
              label="القسم الأكاديمي"
              {...editForm.getInputProps('department')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditMajor(null)}>
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
        title="حذف التخصص"
        message="هل أنت متأكد من حذف هذا التخصص الأكاديمي؟ سيؤدي ذلك لحذف قوالب الفصول المرتبطة به."
        confirmLabel="حذف"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
