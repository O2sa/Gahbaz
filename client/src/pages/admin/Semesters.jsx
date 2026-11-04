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
  Stepper,
  Card,
  SimpleGrid,
  ThemeIcon,
  Select,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCalendarEvent,
  IconBook,
  IconRocket,
  IconInfoCircle,
  IconCheck,
  IconSchool,
  IconUsers,
  IconMessages,
  IconArrowLeft,
  IconArrowRight,
  IconSparkles,
  IconCalendar,
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
  useSemesterTemplatesByMajor,
} from '../../hooks/useSemesters.js'
import { useMajors } from '../../hooks/useMajors.js'
import dayjs from 'dayjs'

export default function Semesters() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const { t: tNav } = useTranslation('nav')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [startOpened, { open: openStart, close: closeStart }] = useDisclosure(false)
  const [activeStep, setActiveStep] = useState(0)
  const [launchResult, setLaunchResult] = useState(null)
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
    value: String(m._id || m.id),
    label: `${m.name} (${m.college?.name || t('majors.defaultCollege')})`,
  }))

  const startMutation = useStartSemester()
  const updateMutation = useUpdateSemester()
  const deleteMutation = useDeleteSemester()

  // Start Semester Wizard Form
  const currentYear = new Date().getFullYear()
  const startForm = useForm({
    initialValues: {
      name: `${t('semesters.seasonFall')} ${currentYear}/${currentYear + 1}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      addDropDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      selectedMajor: '',
      allSemesters: true,
      selectedSemesters: [],
    },
    validate: {
      name: (val) => (!val?.trim() ? t('semesters.termName') : null),
      selectedMajor: (val) => (!val ? t('semesters.selectMajorPlaceholder') : null),
      selectedSemesters: (val, values) =>
        !values.allSemesters && (!val || val.length === 0)
          ? t('semesters.selectSemesters')
          : null,
    },
  })

  // Fetch semester templates for the selected major
  const { data: templatesRes, isLoading: isLoadingTemplates } = useSemesterTemplatesByMajor(
    startForm.values.selectedMajor
  )

  const templatesList = Array.isArray(templatesRes) ? templatesRes : []

  const templateOptions = templatesList.map((tItem) => {
    const sCount = tItem.studentsCount ?? 0
    const subCount = tItem.subjects?.length || 0
    const isEligible = sCount > 0 && subCount > 0

    let statusNote = ''
    if (subCount === 0 && sCount === 0) {
      statusNote = ` [0 ${t('courses.title')} • 0 ${t('users.tabs.students')}]`
    } else if (subCount === 0) {
      statusNote = ` [0 ${t('courses.title')}]`
    } else if (sCount === 0) {
      statusNote = ` [0 ${t('users.tabs.students')}]`
    }

    return {
      value: String(tItem._id || tItem.id),
      label: `${tItem.name || `${t('semestersTemplate.table.level')} ${tItem.index || ''}`} (${sCount} • ${subCount})${statusNote}`,
      studentsCount: sCount,
      subjectsCount: subCount,
      disabled: !isEligible,
    }
  })

  // Total students enrolled across all templates of this major
  const totalMajorStudents = templatesList.reduce(
    (acc, tItem) => acc + (tItem.studentsCount || 0),
    0
  )

  // Templates in this major that have at least 1 student AND at least 1 subject
  const templatesWithStudentsAndSubjects = templatesList.filter(
    (tItem) => (tItem.studentsCount || 0) > 0 && (tItem.subjects?.length || 0) > 0
  )

  // Total eligible students enrolled across eligible templates of this major
  const totalMajorEligibleStudents = templatesWithStudentsAndSubjects.reduce(
    (acc, tItem) => acc + (tItem.studentsCount || 0),
    0
  )

  // Count of students for the currently selected configuration
  const currentEligibleStudentsCount = startForm.values.allSemesters
    ? totalMajorEligibleStudents
    : templatesList
        .filter(
          (tItem) =>
            startForm.values.selectedSemesters.includes(String(tItem._id || tItem.id)) &&
            (tItem.subjects?.length || 0) > 0
        )
        .reduce((acc, tItem) => acc + (tItem.studentsCount || 0), 0)

  const selectedMajorDoc = (majorsRes?.data || []).find(
    (m) => String(m._id || m.id) === String(startForm.values.selectedMajor)
  )

  const setSeasonPreset = (season) => {
    if (season === 'fall') {
      startForm.setFieldValue('name', `${t('semesters.seasonFall')} ${currentYear}/${currentYear + 1}`)
    } else if (season === 'spring') {
      startForm.setFieldValue('name', `${t('semesters.seasonSpring')} ${currentYear + 1}`)
    } else if (season === 'summer') {
      startForm.setFieldValue('name', `${t('semesters.seasonSummer')} ${currentYear + 1}`)
    }
  }

  const handleNextStep = () => {
    if (activeStep === 0) {
      startForm.validateField('name')
      startForm.validateField('startDate')
      startForm.validateField('endDate')
      if (!startForm.values.name?.trim()) return
      if (!startForm.values.startDate) return
      if (!startForm.values.endDate) return
      setActiveStep(1)
    } else if (activeStep === 1) {
      startForm.validateField('selectedMajor')
      if (!startForm.values.selectedMajor) return

      if (startForm.values.allSemesters) {
        if (!isLoadingTemplates) {
          if (templatesList.length === 0) {
            notifications.show({
              title: tCommon('notifications.warning'),
              message: t('semestersTemplate.emptyTitle'),
              color: 'red',
            })
            return
          }
          if (templatesWithStudentsAndSubjects.length === 0) {
            notifications.show({
              title: tCommon('notifications.warning'),
              message: t('semesters.selectMajorPlaceholder'),
              color: 'red',
            })
            return
          }
        }
      } else {
        startForm.validateField('selectedSemesters')
        if (!startForm.values.selectedSemesters || startForm.values.selectedSemesters.length === 0) {
          return
        }
        if (currentEligibleStudentsCount === 0) {
          notifications.show({
            title: tCommon('notifications.warning'),
            message: t('semesters.selectSemesters'),
            color: 'red',
          })
          return
        }
      }
      setActiveStep(2)
    }
  }

  const handlePrevStep = () => {
    setActiveStep((current) => (current > 0 ? current - 1 : current))
  }

  const handleOpenStart = () => {
    setActiveStep(0)
    if (majorOptions.length > 0 && !startForm.values.selectedMajor) {
      startForm.setFieldValue('selectedMajor', majorOptions[0].value)
    }
    openStart()
  }

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      completed: false,
    },
    validate: {
      name: (val) => (!val?.trim() ? t('semesters.termName') : null),
    },
  })

  const handleStartSubmit = async (values) => {
    try {
      const payload = {
        semesterData: {
          name: values.name,
          startDate: values.startDate ? new Date(values.startDate) : undefined,
          endDate: values.endDate ? new Date(values.endDate) : undefined,
          addDropDeadline: values.addDropDeadline ? new Date(values.addDropDeadline) : undefined,
        },
        majors: [
          {
            majorId: values.selectedMajor,
            allSemesters: Boolean(values.allSemesters),
            semesters:
              !values.allSemesters && values.selectedSemesters.length > 0
                ? values.selectedSemesters.map((sId) => ({ templateId: sId }))
                : undefined,
          },
        ],
        semesters:
          !values.allSemesters && values.selectedSemesters.length > 0
            ? values.selectedSemesters
            : undefined,
      }
      const res = await startMutation.mutateAsync(payload)
      startForm.reset()
      closeStart()
      setActiveStep(0)
      setLaunchResult(res?.data || res || { success: true })
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
      title: t('semesters.table.term'),
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
      title: t('majors.breadcrumb'),
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.major?.name ? `${row.major.name} • ${row.major.college?.name || t('majors.defaultCollege')}` : t('subjects.general')}
        </Badge>
      ),
    },
    {
      key: 'courses',
      title: t('courses.title'),
      align: 'center',
      render: (row) => (
        <Badge
          component={Link}
          to={`/semesters/${row._id || row.id}`}
          color="violet"
          variant="outline"
          size="sm"
          sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
        >
          {row.courses?.length || 0}
        </Badge>
      ),
    },
    {
      key: 'dates',
      title: t('semesters.table.period'),
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed">
          {row.startDate ? dayjs(row.startDate).format('YYYY/MM/DD') : '—'}
          {' - '}
          {row.endDate ? dayjs(row.endDate).format('YYYY/MM/DD') : '—'}
        </Text>
      ),
    },
    {
      key: 'completed',
      title: t('semesters.table.status'),
      align: 'center',
      render: (row) => (
        <Badge
          color={row.completed ? 'gray' : 'teal'}
          variant={row.completed ? 'light' : 'filled'}
          size="sm"
        >
          {row.completed ? t('semesters.closedBadge') : t('semesters.activeBadge')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: t('semesters.table.actions'),
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
            {t('courses.title')}
          </Button>
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
        title={t('semesters.title')}
        description={t('semesters.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home'), href: '/' },
          { title: t('semesters.title') },
        ]}
        action={
          <Button
            leftIcon={<IconRocket size={16} />}
            color="brand"
            onClick={handleOpenStart}
          >
            {t('semesters.launchWizard')}
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
        emptyTitle={t('common:table.noRecords')}
        emptyDescription={t('semesters.subtitle')}
      />

      {/* Start Semester Multi-Step Wizard Modal */}
      <Modal
        opened={startOpened}
        onClose={() => {
          setActiveStep(0)
          closeStart()
        }}
        size="lg"
        title={
          <Group spacing="xs">
            <ThemeIcon color="brand" variant="light" size="md" radius="md">
              <IconRocket size={18} />
            </ThemeIcon>
            <Text weight={700}>{t('semesters.launchWizard')}</Text>
          </Group>
        }
      >
        <form onSubmit={startForm.onSubmit(handleStartSubmit)}>
          <Stack spacing="lg">
            <Stepper
              active={activeStep}
              onStepClick={(step) => {
                if (step < activeStep) setActiveStep(step)
              }}
              breakpoint="sm"
            >
              <Stepper.Step
                label={t('semesters.wizard.step1Title')}
                description={t('semesters.wizard.step1Desc')}
                icon={<IconCalendar size={18} />}
              >
                <Stack spacing="md" mt="md">
                  <Alert
                    icon={<IconInfoCircle size={16} />}
                    title={t('semesters.wizard.step1Title')}
                    color="indigo"
                    radius="md"
                  >
                    {t('semesters.subtitle')}
                  </Alert>

                  <div>
                    <Group spacing="xs">
                      <Button
                        variant="light"
                        size="xs"
                        compact
                        leftIcon={<IconSparkles size={14} />}
                        onClick={() => setSeasonPreset('fall')}
                      >
                        {t('semesters.seasonFall')}
                      </Button>
                      <Button
                        variant="light"
                        size="xs"
                        compact
                        color="teal"
                        leftIcon={<IconSparkles size={14} />}
                        onClick={() => setSeasonPreset('spring')}
                      >
                        {t('semesters.seasonSpring')}
                      </Button>
                      <Button
                        variant="light"
                        size="xs"
                        compact
                        color="orange"
                        leftIcon={<IconSparkles size={14} />}
                        onClick={() => setSeasonPreset('summer')}
                      >
                        {t('semesters.seasonSummer')}
                      </Button>
                    </Group>
                  </div>

                  <TextInput
                    label={t('semesters.termName')}
                    placeholder={t('semesters.termNamePlaceholder')}
                    icon={<IconCalendar size={16} />}
                    required
                    {...startForm.getInputProps('name')}
                  />

                  <Group grow>
                    <TextInput
                      label={t('semesters.startDate')}
                      type="date"
                      required
                      {...startForm.getInputProps('startDate')}
                    />
                    <TextInput
                      label={t('semesters.endDate')}
                      type="date"
                      required
                      {...startForm.getInputProps('endDate')}
                    />
                  </Group>

                  <TextInput
                    label={t('semesters.addDropDeadline')}
                    type="date"
                    required
                    {...startForm.getInputProps('addDropDeadline')}
                  />
                </Stack>
              </Stepper.Step>

              <Stepper.Step
                label={t('semesters.wizard.step2Title')}
                description={t('semesters.wizard.step2Desc')}
                icon={<IconSchool size={18} />}
              >
                <Stack spacing="md" mt="md">
                  <Select
                    label={t('semesters.selectMajor')}
                    placeholder={t('semesters.selectMajorPlaceholder')}
                    data={majorOptions}
                    required
                    searchable
                    clearable
                    icon={<IconSchool size={16} />}
                    value={startForm.values.selectedMajor}
                    error={startForm.errors.selectedMajor}
                    onChange={(val) => {
                      startForm.setFieldValue('selectedMajor', val || '')
                      startForm.setFieldValue('selectedSemesters', [])
                    }}
                  />

                  <Paper
                    withBorder
                    p="md"
                    radius="md"
                    sx={(theme) => ({
                      backgroundColor:
                        theme.colorScheme === 'dark'
                          ? theme.colors.dark[6]
                          : theme.colors.gray[0],
                    })}
                  >
                    <Stack spacing="sm">
                      <Switch
                        label={t('semesters.allSemestersSwitch')}
                        {...startForm.getInputProps('allSemesters', { type: 'checkbox' })}
                      />

                      {!startForm.values.allSemesters && (
                        <Stack spacing="xs" mt="xs">
                          <MultiSelect
                            label={t('semesters.selectSemesters')}
                            placeholder={t('semesters.selectSemesters')}
                            data={templateOptions}
                            disabled={isLoadingTemplates || templateOptions.length === 0}
                            required
                            searchable
                            clearable
                            {...startForm.getInputProps('selectedSemesters')}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              </Stepper.Step>

              <Stepper.Step
                label={t('semesters.wizard.step3Title')}
                description={t('semesters.wizard.step3Desc')}
                icon={<IconRocket size={18} />}
              >
                <Stack spacing="md" mt="md">
                  <Paper withBorder p="md" radius="md">
                    <Text weight={700} size="sm" mb="xs" color="brand">
                      {t('semesters.wizard.step3Title')}:
                    </Text>
                    <Stack spacing={6}>
                      <Group spacing="xs">
                        <Text size="xs" color="dimmed">{t('semesters.termName')}:</Text>
                        <Text size="sm" weight={600}>{startForm.values.name || '—'}</Text>
                      </Group>
                      <Group spacing="xs">
                        <Text size="xs" color="dimmed">{t('semesters.table.period')}:</Text>
                        <Text size="xs">
                          {startForm.values.startDate} - {startForm.values.endDate}
                        </Text>
                      </Group>
                      <Group spacing="xs">
                        <Text size="xs" color="dimmed">{t('semesters.addDropDeadline')}:</Text>
                        <Text size="xs">{startForm.values.addDropDeadline}</Text>
                      </Group>
                      <Group spacing="xs">
                        <Text size="xs" color="dimmed">{t('semesters.selectMajor')}:</Text>
                        <Badge color="blue" size="sm">
                          {selectedMajorDoc?.name || '—'}
                        </Badge>
                      </Group>
                      <Group spacing="xs">
                        <Text size="xs" color="dimmed">{t('semesters.studentsEnrolled')}:</Text>
                        <Badge color={currentEligibleStudentsCount > 0 ? 'teal' : 'red'} size="sm">
                          {currentEligibleStudentsCount}
                        </Badge>
                      </Group>
                    </Stack>
                  </Paper>
                </Stack>
              </Stepper.Step>
            </Stepper>

            {/* Stepper Footer Controls */}
            <Group
              position="apart"
              pt="md"
              sx={(theme) => ({
                borderTop: `1px solid ${
                  theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
              })}
            >
              <Group spacing="xs">
                <Button
                  variant="default"
                  onClick={() => {
                    setActiveStep(0)
                    closeStart()
                  }}
                >
                  {tCommon('actions.cancel')}
                </Button>
                {activeStep > 0 && (
                  <Button
                    variant="light"
                    onClick={handlePrevStep}
                    rightIcon={<IconArrowRight size={16} />}
                  >
                    {tCommon('actions.back')}
                  </Button>
                )}
              </Group>

              {activeStep < 2 ? (
                <Button
                  color="brand"
                  onClick={handleNextStep}
                  leftIcon={<IconArrowLeft size={16} />}
                >
                  {tCommon('actions.next')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  color="brand"
                  leftIcon={<IconRocket size={18} />}
                  loading={startMutation.isPending}
                >
                  {t('semesters.launchWizard')}
                </Button>
              )}
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Post-Launch Metrics Summary Modal */}
      <Modal
        opened={Boolean(launchResult)}
        onClose={() => setLaunchResult(null)}
        size="md"
        radius="md"
        title={
          <Group spacing="xs">
            <ThemeIcon color="teal" size="md" radius="xl">
              <IconCheck size={18} />
            </ThemeIcon>
            <Text weight={700} size="md">
              {t('semesters.launchSuccessTitle')}
            </Text>
          </Group>
        }
      >
        <Stack spacing="md">
          <Text size="sm" color="dimmed">
            {t('semesters.launchSuccessMessage')}
          </Text>

          <SimpleGrid cols={2} spacing="sm">
            <Card withBorder p="sm" radius="md">
              <Group spacing="xs">
                <ThemeIcon color="violet" variant="light" size="lg" radius="md">
                  <IconBook size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" color="dimmed">{t('semesters.coursesGenerated')}</Text>
                  <Text weight={700} size="xl">
                    {launchResult?.stats?.coursesCreated ?? 0}
                  </Text>
                </div>
              </Group>
            </Card>

            <Card withBorder p="sm" radius="md">
              <Group spacing="xs">
                <ThemeIcon color="teal" variant="light" size="lg" radius="md">
                  <IconUsers size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xs" color="dimmed">{t('semesters.studentsEnrolled')}</Text>
                  <Text weight={700} size="xl">
                    {launchResult?.stats?.studentsEnrolled ?? 0}
                  </Text>
                </div>
              </Group>
            </Card>
          </SimpleGrid>

          <Button
            fullWidth
            color="brand"
            mt="md"
            onClick={() => setLaunchResult(null)}
          >
            {tCommon('actions.confirm')}
          </Button>
        </Stack>
      </Modal>

      {/* Edit Semester Modal */}
      <Modal
        opened={Boolean(editSemester)}
        onClose={() => setEditSemester(null)}
        title={<Text weight={700}>{t('semesters.title')}</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('semesters.termName')}
              required
              {...editForm.getInputProps('name')}
            />
            <Switch
              label={t('semesters.closedBadge')}
              {...editForm.getInputProps('completed', { type: 'checkbox' })}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditSemester(null)}>
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
        title={tCommon('dialogs.confirmDeleteTitle')}
        message={tCommon('dialogs.confirmDeleteMessage')}
        confirmLabel={tCommon('actions.delete')}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
