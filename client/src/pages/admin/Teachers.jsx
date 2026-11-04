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
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from '../../hooks/useTeachers.js'
import dayjs from 'dayjs'

const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/

export default function Teachers() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')

  const TITLE_OPTIONS = [
    { value: 'دكتور', label: t('titles.dr') },
    { value: 'أستاذ دكتور', label: t('titles.prof') },
    { value: 'أستاذ مشارك', label: t('titles.assocProf') },
    { value: 'أستاذ مساعد', label: t('titles.asstProf') },
    { value: 'محاضر', label: t('titles.lecturer') },
    { value: 'معيد', label: t('titles.ta') },
    { value: 'أستاذ', label: t('titles.teacher') },
  ]

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
  const [editTeacher, setEditTeacher] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [createdCredentials, setCreatedCredentials] = useState(null)

  // API hooks
  const { data: teachersRes, isLoading } = useTeachers({
    page,
    limit,
    search: debouncedSearch,
  })

  const createMutation = useCreateTeacher()
  const updateMutation = useUpdateTeacher()
  const deleteMutation = useDeleteTeacher()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      title: 'دكتور',
      email: '',
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
      title: 'دكتور',
      email: '',
      phone: '',
    },
    validate: {
      name: validateName,
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      const payload = { ...values }
      if (!payload.password) delete payload.password

      const res = await createMutation.mutateAsync(payload)
      addForm.reset()
      closeAdd()

      if (res?.tempPassword) {
        setCreatedCredentials({
          name: `${payload.title ? payload.title + ' ' : ''}${res.data?.name || values.name}`,
          email: res.data?.email || values.email,
          tempPassword: res.tempPassword,
        })
      }
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditTeacher(row)
    editForm.setValues({
      name: row.name || row.userName || '',
      title: row.title || 'دكتور',
      email: row.email || '',
      phone: row.phone || '',
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editTeacher) return
    try {
      await updateMutation.mutateAsync({
        id: editTeacher._id || editTeacher.id,
        data: values,
      })
      setEditTeacher(null)
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
      title: t('users.tabs.teachers'),
      render: (row) => {
        const teacherName = row.name || row.userName || t('common:roles.teacher')
        return (
          <Group spacing="sm">
            <Avatar color="teal" radius="xl" size="sm">
              {teacherName.charAt(0)}
            </Avatar>
            <div>
              <Group spacing={6}>
                {row.title && (
                  <Badge color="teal" size="xs" variant="filled">
                    {row.title}
                  </Badge>
                )}
                <Text weight={600} size="sm">
                  {teacherName}
                </Text>
              </Group>
              <Text size="xs" color="dimmed">
                {row.email}
              </Text>
            </div>
          </Group>
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
      key: 'coursesCount',
      title: t('admin:dashboard.stats.totalCourses'),
      align: 'center',
      render: (row) => (
        <Badge color="indigo" variant="light" size="sm">
          {row.courses?.length || 0}
        </Badge>
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
        title={t('users.tabs.teachers')}
        description={t('users.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home'), href: '/' },
          { title: t('users.tabs.teachers') },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            {t('users.addTeacher')}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={teachersRes?.data || []}
        meta={teachersRes?.meta}
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

      {/* Add Teacher Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>{t('users.addTeacher')}</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <Select
              label={t('users.fields.title')}
              data={TITLE_OPTIONS}
              required
              {...addForm.getInputProps('title')}
            />
            <TextInput
              label={t('users.fields.name')}
              placeholder={t('users.fields.name')}
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label={t('users.fields.email')}
              placeholder="teacher@example.com"
              required
              {...addForm.getInputProps('email')}
            />
            <TextInput
              label={t('users.fields.phone')}
              placeholder="05xxxxxxxx"
              {...addForm.getInputProps('phone')}
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

      {/* Edit Teacher Modal */}
      <Modal
        opened={Boolean(editTeacher)}
        onClose={() => setEditTeacher(null)}
        title={<Text weight={700}>{t('users.tabs.teachers')}</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <Select
              label={t('users.fields.title')}
              data={TITLE_OPTIONS}
              required
              {...editForm.getInputProps('title')}
            />
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
            <TextInput
              label={t('users.fields.phone')}
              {...editForm.getInputProps('phone')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditTeacher(null)}>
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
