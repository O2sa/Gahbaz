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
import { IconPlus, IconPencil, IconTrash, IconBuildingSkyscraper, IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useColleges,
  useCreateCollege,
  useUpdateCollege,
  useDeleteCollege,
} from '../../hooks/useColleges.js'
import dayjs from 'dayjs'

export default function Collages() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editCollege, setEditCollege] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const { data: collegesRes, isLoading } = useColleges({
    page,
    limit,
    search: debouncedSearch,
  })

  const createMutation = useCreateCollege()
  const updateMutation = useUpdateCollege()
  const deleteMutation = useDeleteCollege()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      numberOfSemesters: 8,
    },
    validate: {
      name: (val) => (!val?.trim() ? t('colleges.validation.nameRequired') : null),
      numberOfSemesters: (val) => (val < 1 ? t('colleges.validation.semestersMin') : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      numberOfSemesters: 8,
    },
    validate: {
      name: (val) => (!val?.trim() ? t('colleges.validation.nameRequired') : null),
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      await createMutation.mutateAsync(values)
      addForm.reset()
      closeAdd()
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditCollege(row)
    editForm.setValues({
      name: row.name || '',
      numberOfSemesters: row.numberOfSemesters || 8,
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editCollege) return
    try {
      await updateMutation.mutateAsync({
        id: editCollege._id || editCollege.id,
        data: values,
      })
      setEditCollege(null)
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
      title: t('colleges.table.collegeName'),
      render: (row) => (
        <Group spacing="xs">
          <IconBuildingSkyscraper size={18} color="#7c3aed" />
          <Link
            to={`/collages/${row._id || row.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Text weight={600} size="sm" sx={{ '&:hover': { color: '#7c3aed', textDecoration: 'underline' } }}>
              {row.name}
            </Text>
          </Link>
        </Group>
      ),
    },
    {
      key: 'numberOfSemesters',
      title: t('colleges.table.semesters'),
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {t('colleges.semestersBadge', { count: row.numberOfSemesters || 8 })}
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
        <Group spacing={8} position="left">
          <Button
            component={Link}
            to={`/collages/${row._id || row.id}`}
            size="xs"
            variant="light"
            color="brand"
            leftIcon={<IconEye size={14} />}
          >
            {t('colleges.viewMajors')}
          </Button>
          <ActionIcon
            color="brand"
            variant="light"
            size="sm"
            onClick={() => handleEditOpen(row)}
            title={t('colleges.editTooltip')}
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title={t('colleges.deleteTooltip')}
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
        title={t('colleges.title')}
        description={t('colleges.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home'), href: '/' },
          { title: t('colleges.breadcrumb') },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            {t('colleges.createTitle')}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={collegesRes?.data || []}
        meta={collegesRes?.meta}
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
        emptyTitle={t('colleges.emptyTitle')}
        emptyDescription={t('colleges.emptyDescription')}
      />

      {/* Add College Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>{t('colleges.createTitle')}</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('colleges.name')}
              placeholder={t('colleges.namePlaceholder')}
              required
              {...addForm.getInputProps('name')}
            />
            <NumberInput
              label={t('colleges.numberOfSemesters')}
              placeholder="8"
              min={1}
              max={16}
              required
              {...addForm.getInputProps('numberOfSemesters')}
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

      {/* Edit College Modal */}
      <Modal
        opened={Boolean(editCollege)}
        onClose={() => setEditCollege(null)}
        title={<Text weight={700}>{t('colleges.editTitle')}</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('colleges.name')}
              required
              {...editForm.getInputProps('name')}
            />
            <NumberInput
              label={t('colleges.numberOfSemesters')}
              min={1}
              max={16}
              required
              {...editForm.getInputProps('numberOfSemesters')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditCollege(null)}>
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
        title={t('colleges.deleteConfirmTitle')}
        message={t('colleges.deleteConfirmMessage')}
        confirmLabel={tCommon('actions.delete')}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
