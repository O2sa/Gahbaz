import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  NumberInput,
  Stack,
  Text,
  Badge,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconTrash, IconBook } from '@tabler/icons-react'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../../hooks/useSubjects.js'
import dayjs from 'dayjs'

export default function Subjects() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editSubject, setEditSubject] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const { data: subjectsRes, isLoading } = useSubjects({
    page,
    limit,
    search: debouncedSearch,
  })

  const createMutation = useCreateSubject()
  const updateMutation = useUpdateSubject()
  const deleteMutation = useDeleteSubject()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      code: '',
      credits: 3,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم المادة مطلوب' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      code: '',
      credits: 3,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم المادة مطلوب' : null),
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
    setEditSubject(row)
    editForm.setValues({
      name: row.name || '',
      code: row.code || '',
      credits: row.credits || 3,
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editSubject) return
    try {
      await updateMutation.mutateAsync({
        id: editSubject._id || editSubject.id,
        data: values,
      })
      setEditSubject(null)
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
      title: 'المادة الدراسية',
      render: (row) => (
        <Group spacing="xs">
          <IconBook size={18} color="#7c3aed" />
          <div>
            <Text weight={600} size="sm">
              {row.name}
            </Text>
            {row.code && (
              <Text size="xs" color="dimmed">
                رمز المادة: {row.code}
              </Text>
            )}
          </div>
        </Group>
      ),
    },
    {
      key: 'credits',
      title: 'الساعات المعتمدة',
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {row.credits || 3} ساعات
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
        <Group spacing={6} position="left">
          <ActionIcon
            color="brand"
            variant="light"
            size="sm"
            onClick={() => handleEditOpen(row)}
            title="تعديل المادة"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف المادة"
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
        title="المواد الدراسية"
        description="إدارة الخطة الأكاديمية والمقررات والساعات المعتمدة"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'المواد الدراسية' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            إضافة مادة جديدة
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={subjectsRes?.data || []}
        meta={subjectsRes?.meta}
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
        emptyTitle="لا توجد مواد دراسية"
        emptyDescription="ابدأ بإضافة مواد دراسية لتضمينها في الخطط والفصول الأكاديمية."
      />

      {/* Add Subject Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>إضافة مادة جديدة</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم المادة الدراسية"
              placeholder="مثال: هندسة البرمجيات المتقدمة"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="رمز / كود المادة"
              placeholder="CS301"
              {...addForm.getInputProps('code')}
            />
            <NumberInput
              label="عدد الساعات المعتمدة"
              min={1}
              max={6}
              {...addForm.getInputProps('credits')}
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

      {/* Edit Subject Modal */}
      <Modal
        opened={Boolean(editSubject)}
        onClose={() => setEditSubject(null)}
        title={<Text weight={700}>تعديل المادة الدراسية</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم المادة"
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label="رمز / كود المادة"
              {...editForm.getInputProps('code')}
            />
            <NumberInput
              label="عدد الساعات المعتمدة"
              min={1}
              max={6}
              {...editForm.getInputProps('credits')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditSubject(null)}>
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
        title="حذف المادة"
        message="هل أنت متأكد من حذف هذه المادة الدراسية؟"
        confirmLabel="حذف"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
