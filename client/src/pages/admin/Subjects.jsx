import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  NumberInput,
  Select,
  MultiSelect,
  Stack,
  Text,
  Badge,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconTrash, IconBook } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import { useColleges } from '../../hooks/useColleges.js'
import { useTeachers } from '../../hooks/useTeachers.js'
import dayjs from 'dayjs'

export default function Subjects() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const params = useParams()
  const collegeId = params.id || params.collageId || params.collegeId

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editSubject, setEditSubject] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const queryParams = {
    page,
    limit,
    search: debouncedSearch,
    ...(collegeId ? { college: collegeId } : {}),
  }
  const { data: subjectsRes, isLoading } = useSubjects(queryParams)
  const { data: collegesRes } = useColleges({ limit: 100 })
  const { data: teachersRes } = useTeachers({ limit: 100 })

  const collegeOptions = (collegesRes?.data || []).map((c) => ({
    value: c._id || c.id,
    label: c.name,
  }))

  const teacherOptions = (teachersRes?.data || []).map((t) => ({
    value: t._id || t.id,
    label: `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.name || t.email,
  }))

  const createMutation = useCreateSubject()
  const updateMutation = useUpdateSubject()
  const deleteMutation = useDeleteSubject()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      code: '',
      creditHours: 3,
      college: collegeId || '',
      teachers: [],
    },
    validate: {
      name: (val) => (!val?.trim() ? t('subjects.validation.nameRequired') : null),
      creditHours: (val) => (val < 1 || val > 10 ? t('subjects.validation.creditsRange') : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      code: '',
      creditHours: 3,
      college: '',
      teachers: [],
    },
    validate: {
      name: (val) => (!val?.trim() ? t('subjects.validation.nameRequired') : null),
      creditHours: (val) => (val < 1 || val > 10 ? t('subjects.validation.creditsRange') : null),
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        teachers: values.teachers || [],
      })
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
      creditHours: row.creditHours || row.credits || 3,
      college: row.college?._id || row.college || '',
      teachers: (row.teachers || []).map((t) => (typeof t === 'object' ? t._id || t.id : t)),
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editSubject) return
    try {
      await updateMutation.mutateAsync({
        id: editSubject._id || editSubject.id,
        data: {
          ...values,
          teachers: values.teachers || [],
        },
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
      title: t('subjects.table.subject'),
      render: (row) => (
        <Group spacing="xs">
          <IconBook size={18} color="#7c3aed" />
          <div>
            <Text weight={600} size="sm">
              {row.name}
            </Text>
            {row.code && (
              <Text size="xs" color="dimmed">
                {t('subjects.table.code', { code: row.code })}
              </Text>
            )}
          </div>
        </Group>
      ),
    },
    {
      key: 'college',
      title: t('subjects.table.college'),
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.college?.name || t('subjects.general')}
        </Badge>
      ),
    },
    {
      key: 'teachers',
      title: t('subjects.table.faculty'),
      align: 'center',
      render: (row) => {
        const teachersList = row.teachers || []
        if (teachersList.length === 0) {
          return (
            <Text size="xs" color="dimmed">
              {t('subjects.unspecified')}
            </Text>
          )
        }
        return (
          <Group spacing={4} position="center">
            {teachersList.map((tItem) => {
              const name =
                typeof tItem === 'object'
                  ? `${tItem.firstName || ''} ${tItem.lastName || ''}`.trim() || tItem.name
                  : t('subjects.teacherBadge')
              return (
                <Badge
                  key={typeof tItem === 'object' ? tItem._id || tItem.id : tItem}
                  color="teal"
                  variant="light"
                  size="sm"
                >
                  {name}
                </Badge>
              )
            })}
          </Group>
        )
      },
    },
    {
      key: 'creditHours',
      title: t('subjects.table.credits'),
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {t('subjects.creditHoursBadge', { count: row.creditHours || row.credits || 3 })}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: t('subjects.table.createdAt'),
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed">
          {row.createdAt ? dayjs(row.createdAt).format('YYYY/MM/DD') : '—'}
        </Text>
      ),
    },
    {
      key: 'actions',
      title: t('subjects.table.actions'),
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
        title={t('subjects.title')}
        description={t('subjects.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home') || 'الرئيسية', href: '/' },
          ...(collegeId ? [{ title: t('colleges.breadcrumb'), href: '/collages' }] : []),
          { title: t('subjects.breadcrumb') },
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
            {t('subjects.createTitle')}
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
        emptyTitle={t('subjects.emptyTitle')}
        emptyDescription={t('subjects.emptyDescription')}
      />

      {/* Add Subject Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>{t('subjects.createTitle')}</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('subjects.name')}
              placeholder={t('subjects.namePlaceholder')}
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label={t('subjects.code')}
              placeholder={t('subjects.codePlaceholder')}
              {...addForm.getInputProps('code')}
            />
            <Select
              label={t('subjects.college')}
              placeholder={t('majors.selectCollege')}
              data={collegeOptions}
              searchable
              {...addForm.getInputProps('college')}
            />
            <NumberInput
              label={t('subjects.creditHours')}
              min={1}
              max={10}
              required
              {...addForm.getInputProps('creditHours')}
            />
            <MultiSelect
              label={t('subjects.teachers')}
              placeholder={t('subjects.teachers')}
              data={teacherOptions}
              searchable
              clearable
              nothingFound={t('subjects.unspecified')}
              {...addForm.getInputProps('teachers')}
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

      {/* Edit Subject Modal */}
      <Modal
        opened={Boolean(editSubject)}
        onClose={() => setEditSubject(null)}
        title={<Text weight={700}>{t('subjects.editTitle')}</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('subjects.name')}
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label={t('subjects.code')}
              {...editForm.getInputProps('code')}
            />
            <Select
              label={t('subjects.college')}
              placeholder={t('majors.selectCollege')}
              data={collegeOptions}
              searchable
              {...editForm.getInputProps('college')}
            />
            <NumberInput
              label={t('subjects.creditHours')}
              min={1}
              max={10}
              required
              {...editForm.getInputProps('creditHours')}
            />
            <MultiSelect
              label={t('subjects.teachers')}
              placeholder={t('subjects.teachers')}
              data={teacherOptions}
              searchable
              clearable
              nothingFound={t('subjects.unspecified')}
              {...editForm.getInputProps('teachers')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditSubject(null)}>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        opened={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title={t('subjects.deleteConfirmTitle')}
        message={t('subjects.deleteConfirmMessage')}
        confirmLabel={tCommon('actions.delete')}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
