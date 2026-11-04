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
  Paper,
  CopyButton,
  Code,
  SimpleGrid,
  Select,
  Tooltip,
  Alert,
  Box,
  Divider,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import {
  IconPlus,
  IconPencil,
  IconArrowsExchange,
  IconCopy,
  IconCheck,
  IconBuildingBank,
  IconBuildingSkyscraper,
  IconCertificate,
  IconBook,
  IconSchool,
  IconUserCheck,
  IconShieldLock,
  IconCircleCheck,
  IconAlertCircle,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  DataTable,
  PageHeader,
  StatCard,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useUniversities,
  useCreateUniversity,
  useUpdateUniversity,
  useToggleUniversityStatus,
} from '../../hooks/useUniversities.js'
import { notifications } from '@mantine/notifications'

export default function Universities() {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const navigate = useNavigate()
  const { t } = useTranslation(['admin', 'common', 'nav', 'auth'])

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [debouncedSearch] = useDebouncedValue(search, 300)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [editingUniversity, setEditingUniversity] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [createdCredentials, setCreatedCredentials] = useState(null)

  // Active switched context from storage
  const activeSwitchedId = typeof window !== 'undefined' ? localStorage.getItem('gahbaz_active_university_id') : null
  const activeSwitchedName = typeof window !== 'undefined' ? localStorage.getItem('gahbaz_active_university_name') : null

  // Fetch universities
  const queryParams = {
    page,
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(activeFilter !== 'all' ? { active: activeFilter } : {}),
  }
  const { data, isLoading } = useUniversities(queryParams)
  const universities = data?.universities || []
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 }

  // Mutations
  const createMutation = useCreateUniversity()
  const updateMutation = useUpdateUniversity()
  const toggleMutation = useToggleUniversityStatus()

  // Add form
  const addForm = useForm({
    initialValues: {
      name: '',
      code: '',
      adminName: '',
      adminEmail: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? t('universities.validation.nameRequired') : val.trim().length < 3 ? t('universities.validation.nameLength') : null),
      code: (val) => (!val?.trim() ? t('universities.validation.codeRequired') : val.trim().length < 2 ? t('universities.validation.codeLength') : null),
      adminName: (val) => (!val?.trim() ? t('universities.validation.adminNameRequired') : null),
      adminEmail: (val) => (!val?.trim() ? t('universities.validation.adminEmailRequired') : !/^\S+@\S+$/.test(val) ? t('universities.validation.adminEmailInvalid') : null),
    },
  })

  // Edit form
  const editForm = useForm({
    initialValues: {
      name: '',
      code: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? t('universities.validation.nameRequired') : null),
      code: (val) => (!val?.trim() ? t('universities.validation.codeRequired') : null),
    },
  })

  // Handle Add Submit
  const handleAddSubmit = async (values) => {
    try {
      const res = await createMutation.mutateAsync({
        name: values.name.trim(),
        code: values.code.trim().toUpperCase(),
        adminName: values.adminName.trim(),
        adminEmail: values.adminEmail.trim().toLowerCase(),
      })
      addForm.reset()
      closeAdd()
      if (res?.tempPassword) {
        setCreatedCredentials({
          universityName: res?.university?.name || values.name,
          universityCode: res?.university?.code || values.code,
          adminEmail: res?.admin?.email || values.adminEmail,
          adminName: res?.admin?.name || values.adminName,
          tempPassword: res.tempPassword,
        })
      }
    } catch {
      // Handled by mutation onError
    }
  }

  // Open Edit Modal
  const handleOpenEdit = (univ) => {
    setEditingUniversity(univ)
    editForm.setValues({
      name: univ.name,
      code: univ.code,
    })
    openEdit()
  }

  // Handle Edit Submit
  const handleEditSubmit = async (values) => {
    if (!editingUniversity) return
    try {
      await updateMutation.mutateAsync({
        id: editingUniversity._id,
        data: {
          name: values.name.trim(),
          code: values.code.trim().toUpperCase(),
        },
      })
      closeEdit()
      setEditingUniversity(null)
    } catch {
      // Handled by mutation onError
    }
  }

  // Handle Context Switch
  const handleSwitchContext = (univ) => {
    if (activeSwitchedId === univ._id) {
      // Clear context back to platform
      localStorage.removeItem('gahbaz_active_university_id')
      localStorage.removeItem('gahbaz_active_university_name')
      notifications.show({
        title: t('universities.title'),
        message: t('universities.table.cancelSwitch'),
        color: 'blue',
      })
    } else {
      // Switch to this university
      localStorage.setItem('gahbaz_active_university_id', univ._id)
      localStorage.setItem('gahbaz_active_university_name', `${univ.name} (${univ.code})`)
      notifications.show({
        title: t('universities.table.switchToUniversity'),
        message: t('universities.activeContextBanner', { name: `${univ.name} (${univ.code})` }),
        color: 'teal',
      })
    }
    // Refresh to apply context across cached queries
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  // Telemetry Aggregations
  const totalUniversities = meta.total || universities.length
  const activeCount = universities.filter((u) => u.active).length
  const suspendedCount = universities.filter((u) => !u.active).length
  const totalStudents = universities.reduce((acc, u) => acc + (u.telemetry?.studentsCount || 0), 0)

  // Columns definition for DataTable
  const columns = [
    {
      key: 'name',
      label: t('universities.table.institution'),
      render: (row) => {
        const isCurrentActive = activeSwitchedId === row._id
        return (
          <Group spacing="sm">
            <ThemeIcon
              size={36}
              radius="md"
              variant="light"
              color={isCurrentActive ? 'teal' : row.active ? 'brand' : 'gray'}
            >
              <IconBuildingBank size={20} />
            </ThemeIcon>
            <Box>
              <Group spacing={6}>
                <Text weight={700} size="sm">
                  {row.name}
                </Text>
                <Badge variant="filled" color="brand" size="xs">
                  {row.code}
                </Badge>
                {isCurrentActive && (
                  <Badge variant="dot" color="teal" size="xs">
                    {t('universities.table.currentActive')}
                  </Badge>
                )}
              </Group>
              <Text size="xs" color="dimmed">
                ID: {row._id}
              </Text>
            </Box>
          </Group>
        )
      },
    },
    {
      key: 'admin',
      label: t('universities.table.mainAdmin'),
      render: (row) => (
        <Box>
          <Text size="sm" weight={600}>
            {row.admin?.name || t('universities.table.notSpecified')}
          </Text>
          <Text size="xs" color="dimmed">
            {row.admin?.email || '—'}
          </Text>
        </Box>
      ),
    },
    {
      key: 'telemetry',
      label: t('universities.table.telemetry'),
      render: (row) => {
        const tel = row.telemetry || {}
        return (
          <Group spacing={6}>
            <Tooltip label={t('universities.table.collegesCountTooltip')}>
              <Badge variant="outline" color="blue" size="sm" leftSection={<IconBuildingSkyscraper size={12} />}>
                {t('universities.table.collegesCount', { count: tel.collegesCount || 0 })}
              </Badge>
            </Tooltip>
            <Tooltip label={t('universities.table.majorsCountTooltip')}>
              <Badge variant="outline" color="indigo" size="sm" leftSection={<IconCertificate size={12} />}>
                {t('universities.table.majorsCount', { count: tel.majorsCount || 0 })}
              </Badge>
            </Tooltip>
            <Tooltip label={t('universities.table.coursesCountTooltip')}>
              <Badge variant="outline" color="violet" size="sm" leftSection={<IconBook size={12} />}>
                {t('universities.table.coursesCount', { count: tel.coursesCount || 0 })}
              </Badge>
            </Tooltip>
          </Group>
        )
      },
    },
    {
      key: 'users',
      label: t('universities.table.registeredUsers'),
      render: (row) => {
        const tel = row.telemetry || {}
        return (
          <Group spacing={6}>
            <Badge variant="light" color="cyan" size="sm" leftSection={<IconSchool size={12} />}>
              {t('universities.table.studentsCount', { count: tel.studentsCount || 0 })}
            </Badge>
            <Badge variant="light" color="teal" size="sm" leftSection={<IconUserCheck size={12} />}>
              {t('universities.table.teachersCount', { count: tel.teachersCount || 0 })}
            </Badge>
          </Group>
        )
      },
    },
    {
      key: 'active',
      label: t('universities.table.status'),
      render: (row) => (
        <Badge
          variant="filled"
          color={row.active ? 'teal' : 'red'}
          size="sm"
        >
          {row.active ? t('universities.table.activeStatus') : t('universities.table.suspendedStatus')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: t('universities.table.actions'),
      render: (row) => {
        const isCurrentActive = activeSwitchedId === row._id
        return (
          <Group spacing={6}>
            <Tooltip label={isCurrentActive ? t('universities.table.cancelSwitch') : t('universities.table.switchToUniversity')}>
              <ActionIcon
                color={isCurrentActive ? 'teal' : 'brand'}
                variant={isCurrentActive ? 'filled' : 'light'}
                onClick={() => handleSwitchContext(row)}
              >
                <IconArrowsExchange size={17} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t('universities.table.editUniversity')}>
              <ActionIcon
                color="blue"
                variant="light"
                onClick={() => handleOpenEdit(row)}
              >
                <IconPencil size={17} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={row.active ? t('universities.table.suspendUniversity') : t('universities.table.activateUniversity')}>
              <ActionIcon
                color={row.active ? 'orange' : 'teal'}
                variant="light"
                onClick={() => setConfirmTarget(row)}
              >
                <IconShieldLock size={17} />
              </ActionIcon>
            </Tooltip>
          </Group>
        )
      },
    },
  ]

  return (
    <Box p="md">
      <PageHeader
        title={t('universities.title')}
        description={t('universities.description')}
        breadcrumbs={[
          { title: t('actions.home', { ns: 'common' }), href: '/dashboard' },
          { title: t('universities.breadcrumbGovernance'), href: '/universities' },
          { title: t('universities.breadcrumbManage') },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            radius="md"
            onClick={openAdd}
          >
            {t('universities.provisionNew')}
          </Button>
        }
      />

      {/* Active Context Banner */}
      {activeSwitchedId && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title={t('universities.activeContextTitle')}
          color="teal"
          radius="md"
          mb="lg"
          withCloseButton
          onClose={() => {
            localStorage.removeItem('gahbaz_active_university_id')
            localStorage.removeItem('gahbaz_active_university_name')
            window.location.reload()
          }}
        >
          {t('universities.activeContextBanner', { name: activeSwitchedName || t('universities.table.institution') })}
        </Alert>
      )}

      {/* Summary Stat Cards */}
      <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 2 }]} mb="lg">
        <StatCard
          title={t('universities.totalUniversities')}
          value={totalUniversities}
          icon={IconBuildingBank}
          color="brand"
          description={t('universities.totalUniversitiesDesc')}
        />
        <StatCard
          title={t('universities.activeUniversities')}
          value={activeCount}
          icon={IconCircleCheck}
          color="teal"
          description={t('universities.activeUniversitiesDesc')}
        />
        <StatCard
          title={t('universities.suspendedUniversities')}
          value={suspendedCount}
          icon={IconShieldLock}
          color="red"
          description={t('universities.suspendedUniversitiesDesc')}
        />
        <StatCard
          title={t('universities.enrolledStudents')}
          value={totalStudents}
          icon={IconSchool}
          color="cyan"
          description={t('universities.enrolledStudentsDesc')}
        />
      </SimpleGrid>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={universities}
        meta={meta}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={setLimit}
        emptyTitle={t('universities.noUniversities')}
        emptyDescription={t('universities.noUniversitiesDesc')}
        extraFilters={
          <Select
            data={[
              { value: 'all', label: t('universities.allStatuses') },
              { value: 'true', label: t('universities.onlyActive') },
              { value: 'false', label: t('universities.onlySuspended') },
            ]}
            value={activeFilter}
            onChange={(val) => {
              setActiveFilter(val || 'all')
              setPage(1)
            }}
            size="sm"
            radius="md"
            sx={{ width: 140 }}
          />
        }
        actions={
          <Button
            size="sm"
            leftIcon={<IconPlus size={15} />}
            color="brand"
            radius="md"
            onClick={openAdd}
          >
            {t('universities.provisionNew')}
          </Button>
        }
      />

      {/* Provisioning Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={
          <Group spacing="xs">
            <ThemeIcon color="brand" variant="light" size="md" radius="md">
              <IconBuildingBank size={18} />
            </ThemeIcon>
            <Text weight={700} size="md">
              {t('universities.modals.provisionTitle')}
            </Text>
          </Group>
        }
        centered
        radius="lg"
        size="md"
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('universities.modals.univNameLabel')}
              placeholder={t('universities.modals.univNamePlaceholder')}
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label={t('universities.modals.univCodeLabel')}
              placeholder={t('universities.modals.univCodePlaceholder')}
              description={t('universities.modals.univCodeDesc')}
              required
              {...addForm.getInputProps('code')}
            />
            <Divider my="xs" label={t('universities.modals.adminDivider')} labelPosition="center" />
            <TextInput
              label={t('universities.modals.adminNameLabel')}
              placeholder={t('universities.modals.adminNamePlaceholder')}
              required
              {...addForm.getInputProps('adminName')}
            />
            <TextInput
              label={t('universities.modals.adminEmailLabel')}
              placeholder="admin@univ.edu.sa"
              required
              {...addForm.getInputProps('adminEmail')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={closeAdd}>
                {t('actions.cancel', { ns: 'common' })}
              </Button>
              <Button type="submit" color="brand" loading={createMutation.isLoading}>
                {t('universities.modals.submitProvision')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit University Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title={
          <Group spacing="xs">
            <ThemeIcon color="blue" variant="light" size="md" radius="md">
              <IconPencil size={18} />
            </ThemeIcon>
            <Text weight={700} size="md">
              {t('universities.modals.editTitle')}
            </Text>
          </Group>
        }
        centered
        radius="lg"
        size="md"
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label={t('universities.modals.univNameLabel')}
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label={t('universities.modals.univCodeLabel')}
              required
              {...editForm.getInputProps('code')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={closeEdit}>
                {t('actions.cancel', { ns: 'common' })}
              </Button>
              <Button type="submit" color="brand" loading={updateMutation.isLoading}>
                {t('universities.modals.submitEdit')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Credentials Reveal Modal */}
      <Modal
        opened={Boolean(createdCredentials)}
        onClose={() => setCreatedCredentials(null)}
        title={
          <Group spacing="xs">
            <ThemeIcon color="teal" variant="light" size="md" radius="md">
              <IconCheck size={18} />
            </ThemeIcon>
            <Text weight={700} size="md">
              {t('universities.modals.successTitle')}
            </Text>
          </Group>
        }
        centered
        radius="lg"
        size="md"
      >
        {createdCredentials && (
          <Stack spacing="md">
            <Alert color="teal" radius="md">
              {t('universities.modals.successDesc')}
            </Alert>
            <Paper p="sm" withBorder radius="md">
              <Text size="xs" color="dimmed">{t('universities.modals.univAndCode')}</Text>
              <Text weight={700}>{createdCredentials.universityName} ({createdCredentials.universityCode})</Text>
            </Paper>
            <Paper p="sm" withBorder radius="md">
              <Text size="xs" color="dimmed">{t('universities.modals.adminCreds')}</Text>
              <Text weight={600}>{createdCredentials.adminName}</Text>
              <Text size="sm" color="brand.7">{createdCredentials.adminEmail}</Text>
            </Paper>
            <Paper p="sm" withBorder radius="md" sx={{ backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0] }}>
              <Text size="xs" color="dimmed" mb={4}>{t('auth:login.password')}:</Text>
              <Group position="apart">
                <Code sx={{ fontSize: 16, fontWeight: 700, letterSpacing: '1px' }}>
                  {createdCredentials.tempPassword}
                </Code>
                <CopyButton value={createdCredentials.tempPassword} timeout={2000}>
                  {({ copied, copy }) => (
                    <Button
                      size="xs"
                      color={copied ? 'teal' : 'brand'}
                      leftIcon={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      onClick={copy}
                    >
                      {copied ? t('universities.modals.copied') : t('universities.modals.copyPassword')}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Paper>
            <Button fullWidth color="brand" onClick={() => setCreatedCredentials(null)}>
              {t('universities.modals.close')}
            </Button>
          </Stack>
        )}
      </Modal>

      {/* Confirmation Modal for Active/Suspend */}
      <ConfirmModal
        opened={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        isLoading={toggleMutation.isLoading}
        title={confirmTarget?.active ? t('universities.modals.confirmSuspendTitle') : t('universities.modals.confirmActivateTitle')}
        message={
          confirmTarget?.active
            ? t('universities.modals.confirmSuspendMessage')
            : t('universities.modals.confirmActivateMessage')
        }
        confirmLabel={confirmTarget?.active ? t('universities.table.suspendUniversity') : t('universities.table.activateUniversity')}
        confirmColor={confirmTarget?.active ? 'orange' : 'teal'}
        onConfirm={async () => {
          if (!confirmTarget) return
          await toggleMutation.mutateAsync({
            id: confirmTarget._id,
            active: !confirmTarget.active,
          })
          setConfirmTarget(null)
        }}
      />
    </Box>
  )
}
