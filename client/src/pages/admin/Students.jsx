import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  Badge,
  Avatar,
  Paper,
  CopyButton,
  Code,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconTrash, IconSchool, IconCopy, IconCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from '../../hooks/useStudents.js'
import { useMajors } from '../../hooks/useMajors.js'
import dayjs from 'dayjs'

const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/

export default function Students() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')

  const validateName = (val) => {
    if (!val?.trim()) return t('users.validation.nameRequired')
    if (val.trim().length < 3 || val.trim().length > 70) return t('users.validation.nameLength')
    if (!NAME_REGEX.test(val.trim())) {
      return t('users.validation.nameLettersOnly')
    }
    return null
  }

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [createdCredentials, setCreatedCredentials] = useState(null)

  // API hooks
  const { data: studentsRes, isLoading } = useStudents({
    page,
    limit,
    search: debouncedSearch,
  })

  const { data: majorsRes } = useMajors({ limit: 100 })
  const majorOptions = (majorsRes?.data || []).map((m) => ({
    value: m._id,
    label: m.name,
  }))

  const createMutation = useCreateStudent()
  const updateMutation = useUpdateStudent()
  const deleteMutation = useDeleteStudent()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      email: '',
      major: '',
      studentId: '',
      phone: '',
      password: '',
    },
    validate: {
      name: validateName,
      email: (val) => (!val?.includes('@') ? t('users.validation.emailInvalid') : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      email: '',
      major: '',
      studentId: '',
      phone: '',
    },
    validate: {
      name: validateName,
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      const payload = { ...values }
      if (!payload.major) delete payload.major
      if (!payload.password) delete payload.password

      const res = await createMutation.mutateAsync(payload)
      addForm.reset()
      closeAdd()

      if (res?.tempPassword) {
        setCreatedCredentials({
          name: res.data?.name || values.name,
          email: res.data?.email || values.email,
          tempPassword: res.tempPassword,
        })
      }
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditStudent(row)
    editForm.setValues({
      name: row.name || row.userName || '',
      email: row.email || '',
      major: row.major?._id || row.major || '',
      studentId: row.studentId || '',
      phone: row.phone || '',
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editStudent) return
    try {
      const payload = { ...values }
      if (!payload.major) payload.major = null

      await updateMutation.mutateAsync({
        id: editStudent._id || editStudent.id,
        data: payload,
      })
      setEditStudent(null)
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const columns = [
    {
      key: 'name',
      title: t('users.tabs.students'),
      render: (row) => {
        const studentName = row.name || row.userName || t('common:roles.student')
        return (
          <Group spacing="sm">
            <Avatar color="brand" radius="xl" size="sm">
              {studentName.charAt(0)}
            </Avatar>
            <div>
              <Text weight={600} size="sm">
                {studentName}
              </Text>
              <Text size="xs" color="dimmed">
                {row.email}
              </Text>
            </div>
          </Group>
        )
      },
    },
    {
      key: 'studentId',
      title: t('users.fields.academicLevel'),
      align: 'center',
      render: (row) => (
        <Badge color="gray" variant="outline" size="sm">
          {row.studentId || row._id?.slice(-6) || '—'}
        </Badge>
      ),
    },
    {
      key: 'major',
      title: t('users.fields.major'),
      align: 'center',
      render: (row) => {
        const majorName = row.major?.name || t('subjects.unspecified')
        return (
          <Badge color={row.major ? 'indigo' : 'gray'} variant="light" size="sm">
            {majorName}
          </Badge>
        )
      },
    },
    {
      key: 'phone',
      title: t('users.fields.phone'),
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed" dir="ltr">
          {row.phone || '—'}
        </Text>
      ),
    },
    {
      key: 'createdAt',
      title: t('colleges.table.createdAt'),
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed">
          {row.createdAt ? dayjs(row.createdAt).format('YYYY/MM/DD') : '—'}
        </Text>
      ),
    },
    {
      key: 'actions',
      title: t('colleges.table.actions'),
      align: 'left',
      render: (row) => (
        <Group spacing={6} position="left">
          <ActionIcon
            color="brand"
            variant="light"
            size="sm"
            onClick={() => handleEditOpen(row)}
            title={tCommon('actions.edit')}
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title={tCommon('actions.delete')}
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
        title={t('users.tabs.students')}
        description={t('users.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home') || 'الرئيسية', href: '/' },
          { title: t('users.tabs.students') },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            {t('users.addStudent')}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={studentsRes?.data || []}
        meta={studentsRes?.meta}
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
        emptyTitle={t('common:table.noRecords')}
        emptyDescription={t('users.subtitle')}
      />

      {/* Add Student Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>{t('users.addStudent')}</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('users.fields.name')}
              placeholder={t('users.fields.name')}
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label={t('users.fields.email')}
              placeholder="student@example.com"
              required
              {...addForm.getInputProps('email')}
            />
            <Select
              label={t('users.fields.major')}
              placeholder={t('users.fields.major')}
              data={majorOptions}
              searchable
              clearable
              {...addForm.getInputProps('major')}
            />
            <TextInput
              label={t('users.fields.phone')}
              placeholder="05xxxxxxxx"
              {...addForm.getInputProps('phone')}
            />
            <TextInput
              label={t('users.fields.academicLevel')}
              placeholder="20261001"
              {...addForm.getInputProps('studentId')}
            />
            <PasswordInput
              label={t('users.fields.password')}
              placeholder={t('users.fields.password')}
              {...addForm.getInputProps('password')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={closeAdd}>
                {tCommon('actions.cancel')}
              </Button>
              <Button
                type="submit"
                color="brand"
                loading={createMutation.isPending}
              >
                {tCommon('actions.create')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        opened={Boolean(editStudent)}
        onClose={() => setEditStudent(null)}
        title={<Text weight={700}>{t('users.tabs.students')}</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('users.fields.name')}
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label={t('users.fields.email')}
              required
              disabled
              {...editForm.getInputProps('email')}
            />
            <Select
              label={t('users.fields.major')}
              placeholder={t('users.fields.major')}
              data={majorOptions}
              searchable
              clearable
              {...editForm.getInputProps('major')}
            />
            <TextInput
              label={t('users.fields.phone')}
              {...editForm.getInputProps('phone')}
            />
            <TextInput
              label={t('users.fields.academicLevel')}
              {...editForm.getInputProps('studentId')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditStudent(null)}>
                {tCommon('actions.cancel')}
              </Button>
              <Button
                type="submit"
                color="brand"
                loading={updateMutation.isPending}
              >
                {tCommon('actions.save')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Generated Credentials Success Modal */}
      <Modal
        opened={Boolean(createdCredentials)}
        onClose={() => setCreatedCredentials(null)}
        title={<Text weight={700} color="teal">{t('users.tempPasswordModal.title')}</Text>}
      >
        <Stack spacing="md">
          <Text size="sm">
            {t('users.tempPasswordModal.subtitle')}
          </Text>
          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Stack spacing="xs">
              <Text size="sm">
                <strong>{t('users.fields.name')}:</strong> {createdCredentials?.name}
              </Text>
              <Text size="sm">
                <strong>{t('users.fields.email')}:</strong> {createdCredentials?.email}
              </Text>
              <Group position="apart" align="center">
                <Text size="sm">
                  <strong>{t('users.tempPasswordModal.copyPassword')}:</strong>{' '}
                  <Code color="teal">{createdCredentials?.tempPassword}</Code>
                </Text>
                <CopyButton
                  value={`${t('users.fields.email')}: ${createdCredentials?.email}\n${t('users.fields.password')}: ${createdCredentials?.tempPassword}`}
                >
                  {({ copied, copy }) => (
                    <Button
                      color={copied ? 'teal' : 'brand'}
                      size="xs"
                      leftIcon={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      onClick={copy}
                    >
                      {copied ? t('users.tempPasswordModal.copied') : t('users.tempPasswordModal.copyPassword')}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Stack>
          </Paper>
          <Button fullWidth onClick={() => setCreatedCredentials(null)}>
            {tCommon('actions.confirm')}
          </Button>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        opened={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title={t('users.deleteConfirmTitle')}
        message={t('users.deleteConfirmMessage')}
        confirmLabel={tCommon('actions.delete')}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
