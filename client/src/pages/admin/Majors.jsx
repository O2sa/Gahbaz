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
import { useTranslation } from 'react-i18next'
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
      name: (val) => (!val?.trim() ? t('majors.validation.nameRequired') : null),
      college: (val) => (!val ? t('majors.validation.collegeRequired') : null),
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
      name: (val) => (!val?.trim() ? t('majors.validation.nameRequired') : null),
      college: (val) => (!val ? t('majors.validation.collegeRequired') : null),
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
      title: t('majors.table.majorName'),
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
      title: t('majors.table.collegeName'),
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.college?.name || row.department || t('majors.defaultCollege')}
        </Badge>
      ),
    },
    {
      key: 'semesterTemplates',
      title: t('majors.table.studyPlan'),
      align: 'center',
      render: (row) => (
        <Badge color="teal" variant="outline" size="sm">
          {t('majors.curriculumBadge', { count: row.semesterTemplates?.length || 0 })}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: t('majors.table.createdAt'),
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed">
          {row.createdAt ? dayjs(row.createdAt).format('YYYY/MM/DD') : '—'}
        </Text>
      ),
    },
    {
      key: 'actions',
      title: t('majors.table.actions'),
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
            {t('majors.curriculumButton')}
          </Button>
          <ActionIcon
            color="brand"
            variant="light"
            size="sm"
            onClick={() => handleEditOpen(row)}
            title={t('majors.editTooltip')}
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title={t('majors.deleteTooltip')}
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
        title={t('majors.title')}
        description={t('majors.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home'), href: '/' },
          ...(collegeId ? [{ title: t('colleges.breadcrumb'), href: '/collages' }] : []),
          { title: t('majors.breadcrumb') },
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
            {t('majors.createTitle')}
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
        emptyTitle={t('majors.emptyTitle')}
        emptyDescription={t('majors.emptyDescription')}
      />

      {/* Add Major Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>{t('majors.createTitle')}</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('majors.name')}
              placeholder={t('majors.namePlaceholder')}
              required
              {...addForm.getInputProps('name')}
            />
            <Select
              label={t('majors.college')}
              placeholder={t('majors.selectCollege')}
              data={collegeOptions}
              required
              searchable
              {...addForm.getInputProps('college')}
            />
            <TextInput
              label={t('majors.department')}
              placeholder={t('majors.departmentPlaceholder')}
              {...addForm.getInputProps('department')}
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

      {/* Edit Major Modal */}
      <Modal
        opened={Boolean(editMajor)}
        onClose={() => setEditMajor(null)}
        title={<Text weight={700}>{t('majors.editTitle')}</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('majors.name')}
              required
              {...editForm.getInputProps('name')}
            />
            <Select
              label={t('majors.college')}
              placeholder={t('majors.selectCollege')}
              data={collegeOptions}
              required
              searchable
              {...editForm.getInputProps('college')}
            />
            <TextInput
              label={t('majors.department')}
              {...editForm.getInputProps('department')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditMajor(null)}>
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
        title={t('majors.deleteConfirmTitle')}
        message={t('majors.deleteConfirmMessage')}
        confirmLabel={tCommon('actions.delete')}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
