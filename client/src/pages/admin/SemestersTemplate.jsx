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
import { useTranslation } from 'react-i18next'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import customFetch from '../../utils/customFetch.js'
import { notifications } from '@mantine/notifications'

export default function SemestersTemplate() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
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
    label: `${s.code ? `${s.code} - ` : ''}${s.name} (${s.creditHours || s.credits || 3} ${tCommon('table.creditsShort') || 'س'})`,
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
        title: tCommon('notifications.success'),
        message: t('semestersTemplate.createTitle'),
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
        title: tCommon('notifications.success'),
        message: t('semestersTemplate.editTitle'),
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
        title: tCommon('notifications.success'),
        message: t('semestersTemplate.deleteConfirmTitle'),
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
      name: (val) => (!val?.trim() ? t('semestersTemplate.templateName') : null),
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
      name: (val) => (!val?.trim() ? t('semestersTemplate.templateName') : null),
      index: (val) => {
        if (!val || val < 1) return t('semestersTemplate.levelIndex')
        return null
      },
    },
  })

  const handleEditOpen = (row) => {
    setEditTemplate(row)
    const existingSubjectIds = (row.subjects || []).map((s) => (typeof s === 'object' ? s._id : s))
    editForm.setValues({
      name: row.name || `${t('semestersTemplate.table.level')} ${row.index || 1}`,
      index: row.index || 1,
      subjects: existingSubjectIds,
    })
  }

  const columns = [
    {
      key: 'index',
      title: t('semestersTemplate.table.level'),
      align: 'center',
      render: (row) => (
        <Badge color="brand" variant="filled" size="md">
          {t('semestersTemplate.table.level')} {row.index ?? '—'}
        </Badge>
      ),
    },
    {
      key: 'name',
      title: t('semestersTemplate.table.template'),
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
      title: t('semestersTemplate.table.subjects'),
      render: (row) => {
        const subs = row.subjects || []
        if (subs.length === 0) {
          return (
            <Text size="xs" color="dimmed">
              {t('semestersTemplate.emptyDescription')}
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
      title: t('semestersTemplate.table.totalCredits'),
      align: 'center',
      render: (row) => {
        const total = (row.subjects || []).reduce((acc, s) => {
          const h = typeof s === 'object' ? s.creditHours || s.credits || 3 : 3
          return acc + h
        }, 0)
        return (
          <Badge color="violet" variant="outline" size="sm">
            {t('semestersTemplate.hoursCount', { count: total })}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      title: t('semestersTemplate.table.actions'),
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

  const majorTitle = major.name
    ? `${t('semestersTemplate.title')}: ${major.name}`
    : t('semestersTemplate.title')

  return (
    <Box>
      <PageHeader
        title={majorTitle}
        description={t('semestersTemplate.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home') || 'الرئيسية', href: '/' },
          { title: t('majors.breadcrumb'), href: '/majors' },
          { title: major.name || t('majors.breadcrumb'), href: `/majors/${majorId}` },
          { title: t('semestersTemplate.breadcrumb') },
        ]}
        action={
          <Group spacing="xs">
            <Button
              variant="default"
              leftIcon={<IconArrowRight size={16} />}
              onClick={() => navigate('/majors')}
            >
              {tCommon('actions.back')}
            </Button>
            <Button
              leftIcon={<IconPlus size={16} />}
              color="brand"
              onClick={() => {
                addForm.setFieldValue('index', sortedTemplates.length + 1)
                addForm.setFieldValue('name', `${t('semestersTemplate.table.level')} ${sortedTemplates.length + 1}`)
                openAdd()
              }}
            >
              {t('semestersTemplate.createTitle')}
            </Button>
          </Group>
        }
      />

      <DataTable
        columns={columns}
        data={sortedTemplates}
        meta={{ page: 1, limit: 50, total: sortedTemplates.length, totalPages: 1 }}
        isLoading={isLoading}
        emptyTitle={t('semestersTemplate.emptyTitle')}
        emptyDescription={t('semestersTemplate.emptyDescription')}
      />

      {/* Add Template Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        size="lg"
        title={<Text weight={700}>{t('semestersTemplate.createTitle')}</Text>}
      >
        <form onSubmit={addForm.onSubmit((v) => createMutation.mutateAsync(v))}>
          <Stack spacing="md">
            <TextInput
              label={t('semestersTemplate.templateName')}
              placeholder={t('semestersTemplate.templateNamePlaceholder')}
              required
              {...addForm.getInputProps('name')}
            />
            <NumberInput
              label={t('semestersTemplate.levelIndex')}
              min={1}
              required
              disabled
              {...addForm.getInputProps('index')}
            />
            <MultiSelect
              label={t('semestersTemplate.selectSubjects')}
              placeholder={t('semestersTemplate.selectSubjectsPlaceholder')}
              data={subjectOptions}
              searchable
              clearable
              {...addForm.getInputProps('subjects')}
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

      {/* Edit Template Modal */}
      <Modal
        opened={Boolean(editTemplate)}
        onClose={() => setEditTemplate(null)}
        size="lg"
        title={<Text weight={700}>{t('semestersTemplate.editTitle')}</Text>}
      >
        <form
          onSubmit={editForm.onSubmit((values) =>
            updateMutation.mutateAsync({ id: editTemplate._id || editTemplate.id, values })
          )}
        >
          <Stack spacing="md">
            <TextInput
              label={t('semestersTemplate.templateName')}
              required
              {...editForm.getInputProps('name')}
            />
            <NumberInput
              label={t('semestersTemplate.levelIndex')}
              min={1}
              max={sortedTemplates.length}
              required
              {...editForm.getInputProps('index')}
            />
            <MultiSelect
              label={t('semestersTemplate.selectSubjects')}
              placeholder={t('semestersTemplate.selectSubjectsPlaceholder')}
              data={subjectOptions}
              searchable
              clearable
              {...editForm.getInputProps('subjects')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditTemplate(null)}>
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
        onConfirm={() => deleteMutation.mutateAsync(deleteId)}
        title={t('semestersTemplate.deleteConfirmTitle')}
        message={t('semestersTemplate.deleteConfirmMessage')}
        confirmLabel={tCommon('actions.delete')}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  )
}
