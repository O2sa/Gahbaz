import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  NumberInput,
  MultiSelect,
  Stack,
  Text,
  Badge,
  Paper,
  Box,
  Divider,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCalendarEvent,
  IconBook,
  IconArrowRight,
} from '@tabler/icons-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import customFetch from '../../utils/customFetch.js'
import { notifications } from '@mantine/notifications'

export default function SemestersTemplate() {
  const params = useParams()
  const majorId = params.majorId || params.id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editTemplate, setEditTemplate] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // 1. Fetch Major info
  const { data: majorRes } = useQuery({
    queryKey: ['majors', majorId],
    queryFn: async () => {
      const res = await customFetch.get(`/majors/${majorId}`)
      return res.data?.data || res.data || {}
    },
    enabled: Boolean(majorId),
  })
  const major = majorRes?.data || majorRes || {}

  // 2. Fetch Semester Templates for this major
  const {
    data: templatesRes,
    isLoading,
  } = useQuery({
    queryKey: ['semester-templates', majorId],
    queryFn: async () => {
      try {
        const res = await customFetch.get(`/semester-templates/major/${majorId}`)
        const raw = res.data?.data || res.data || []
        return Array.isArray(raw) ? raw : []
      } catch (e) {
        const res = await customFetch.get(`/semester-templates/${majorId}`)
        const raw = res.data?.data || res.data || []
        return Array.isArray(raw) ? raw : []
      }
    },
    enabled: Boolean(majorId),
  })
  const templates = Array.isArray(templatesRes) ? templatesRes : []
  // Sort by index
  const sortedTemplates = [...templates].sort((a, b) => (a.index || 0) - (b.index || 0))

  // 3. Fetch all catalog subjects for multi-select
  const { data: subjectsRes } = useQuery({
    queryKey: ['subjects', 'all-catalog'],
    queryFn: async () => {
      const res = await customFetch.get('/subjects?limit=100')
      const raw = res.data?.data || res.data || []
      return Array.isArray(raw) ? raw : []
    },
  })
  const subjectsList = Array.isArray(subjectsRes) ? subjectsRes : []
  const subjectOptions = subjectsList.map((s) => ({
    value: s._id || s.id,
    label: `${s.code ? `${s.code} - ` : ''}${s.name} (${s.creditHours || s.credits || 3} س)`,
  }))

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (values) => {
      const res = await customFetch.post('/semester-templates', {
        ...values,
        major: majorId,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semester-templates', majorId] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم إضافة الفصل الدراسي إلى الخطة بنجاح',
        color: 'teal',
      })
      addForm.reset()
      closeAdd()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }) => {
      const res = await customFetch.patch(`/semester-templates/${id}`, values)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semester-templates', majorId] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم تحديث قالب الفصل الدراسي بنجاح',
        color: 'teal',
      })
      setEditTemplate(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await customFetch.delete(`/semester-templates/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semester-templates', majorId] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم حذف قالب الفصل بنجاح',
        color: 'teal',
      })
      setDeleteId(null)
    },
  })

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      index: templates.length + 1,
      subjects: [],
    },
    validate: {
      name: (val) => (!val?.trim() ? 'عنوان الفصل أو المستوى مطلوب' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      index: 1,
      subjects: [],
    },
    validate: {
      name: (val) => (!val?.trim() ? 'عنوان الفصل أو المستوى مطلوب' : null),
    },
  })

  const handleEditOpen = (row) => {
    setEditTemplate(row)
    const existingSubjectIds = (row.subjects || []).map((s) => (typeof s === 'object' ? s._id : s))
    editForm.setValues({
      name: row.name || `المستوى ${row.index || 1}`,
      index: row.index || 1,
      subjects: existingSubjectIds,
    })
  }

  const columns = [
    {
      key: 'index',
      title: 'المستوى الأكاديمي',
      align: 'center',
      render: (row) => (
        <Badge color="brand" variant="filled" size="md">
          المستوى {row.index ?? '—'}
        </Badge>
      ),
    },
    {
      key: 'name',
      title: 'مسمى الفصل بالخطة',
      render: (row) => (
        <Group spacing="xs">
          <IconCalendarEvent size={18} color="#7c3aed" />
          <Text weight={600} size="sm">
            {row.name}
          </Text>
        </Group>
      ),
    },
    {
      key: 'subjects',
      title: 'المواد الإلزامية المقررة',
      render: (row) => {
        const subs = row.subjects || []
        if (subs.length === 0) {
          return (
            <Text size="xs" color="dimmed">
              لم يتم تعيين مواد لهذا الفصل بعد
            </Text>
          )
        }
        return (
          <Group spacing={6} sx={{ flexWrap: 'wrap' }}>
            {subs.map((s, idx) => {
              const name = typeof s === 'object' ? s.name : s
              const hours = typeof s === 'object' ? s.creditHours || s.credits : null
              return (
                <Badge key={idx} color="indigo" variant="light" size="sm">
                  {name} {hours ? `(${hours} س)` : ''}
                </Badge>
              )
            })}
          </Group>
        )
      },
    },
    {
      key: 'totalCredits',
      title: 'إجمالي الساعات',
      align: 'center',
      render: (row) => {
        const total = (row.subjects || []).reduce((acc, s) => {
          const h = typeof s === 'object' ? s.creditHours || s.credits || 3 : 3
          return acc + h
        }, 0)
        return (
          <Badge color="violet" variant="outline" size="sm">
            {total} ساعة معتمدة
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'left',
      render: (row) => (
        <Group spacing={6} position="left">
          <ActionIcon
            color="brand"
            variant="light"
            size="sm"
            onClick={() => handleEditOpen(row)}
            title="تعديل قالب الفصل"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف الفصل من الخطة"
          >
            <IconTrash size={15} />
          </ActionIcon>
        </Group>
      ),
    },
  ]

  const majorTitle = major.name ? `الخطة الدراسية: ${major.name}` : 'الخطة الدراسية للتخصص'

  return (
    <Box>
      <PageHeader
        title={majorTitle}
        description="تحديد المستويات الدراسية والمواد الإلزامية لكل فصل دراسي (مخرجات الخطة المعتمدة)"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'التخصصات', href: '/majors' },
          { title: major.name || 'التخصص', href: `/majors/${majorId}` },
          { title: 'الخطة الدراسية' },
        ]}
        action={
          <Group spacing="xs">
            <Button
              variant="default"
              leftIcon={<IconArrowRight size={16} />}
              onClick={() => navigate('/majors')}
            >
              رجوع للتخصصات
            </Button>
            <Button
              leftIcon={<IconPlus size={16} />}
              color="brand"
              onClick={() => {
                addForm.setFieldValue('index', sortedTemplates.length + 1)
                addForm.setFieldValue('name', `المستوى ${sortedTemplates.length + 1}`)
                openAdd()
              }}
            >
              إضافة فصل / مستوى للخطة
            </Button>
          </Group>
        }
      />

      <DataTable
        columns={columns}
        data={sortedTemplates}
        meta={{ page: 1, limit: 50, total: sortedTemplates.length, totalPages: 1 }}
        isLoading={isLoading}
        emptyTitle="لا توجد فصول دراسية محددة في الخطة بعد"
        emptyDescription="أضف المستويات الدراسية وحدد المواد الإلزامية لكل مستوى لبدء الفصول الدراسية تلقائياً."
      />

      {/* Add Template Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        size="lg"
        title={<Text weight={700}>إضافة فصل دراسي للخطة</Text>}
      >
        <form onSubmit={addForm.onSubmit((v) => createMutation.mutateAsync(v))}>
          <Stack spacing="md">
            <TextInput
              label="مسمى الفصل / المستوى"
              placeholder="مثال: المستوى 1 (الفصل الدراسي الأول)"
              required
              {...addForm.getInputProps('name')}
            />
            <NumberInput
              label="رقم المستوى التسلسلي (Index)"
              min={1}
              max={16}
              required
              {...addForm.getInputProps('index')}
            />
            <MultiSelect
              label="المواد الإلزامية المقررة لهذا المستوى"
              placeholder="اختر المواد المقررة من دليل المواد"
              data={subjectOptions}
              searchable
              clearable
              nothingFound="لا توجد مواد مطابقة"
              {...addForm.getInputProps('subjects')}
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
                إضافة للخطة
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        opened={Boolean(editTemplate)}
        onClose={() => setEditTemplate(null)}
        size="lg"
        title={<Text weight={700}>تعديل مواد الفصل الدراسي</Text>}
      >
        <form
          onSubmit={editForm.onSubmit((values) =>
            updateMutation.mutateAsync({ id: editTemplate._id || editTemplate.id, values })
          )}
        >
          <Stack spacing="md">
            <TextInput
              label="مسمى الفصل / المستوى"
              required
              {...editForm.getInputProps('name')}
            />
            <NumberInput
              label="رقم المستوى التسلسلي"
              min={1}
              max={16}
              required
              {...editForm.getInputProps('index')}
            />
            <MultiSelect
              label="المواد الإلزامية المقررة لهذا المستوى"
              placeholder="اختر المواد المقررة"
              data={subjectOptions}
              searchable
              clearable
              nothingFound="لا توجد مواد مطابقة"
              {...editForm.getInputProps('subjects')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditTemplate(null)}>
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
        onConfirm={() => deleteMutation.mutateAsync(deleteId)}
        title="حذف الفصل من الخطة"
        message="هل أنت متأكد من حذف هذا الفصل من الخطة الدراسية؟"
        confirmLabel="حذف"
        isLoading={deleteMutation.isPending}
      />
    </Box>
  )
}
