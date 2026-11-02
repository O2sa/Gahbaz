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
      name: (val) => (!val?.trim() ? 'اسم الجامعة مطلوب' : val.trim().length < 3 ? 'يجب أن لا يقل عن 3 أحرف' : null),
      code: (val) => (!val?.trim() ? 'كود الجامعة مطلوب' : val.trim().length < 2 ? 'يجب أن لا يقل عن حرفين' : null),
      adminName: (val) => (!val?.trim() ? 'اسم المشرف مطلوب' : null),
      adminEmail: (val) => (!val?.trim() ? 'البريد الإلكتروني مطلوب' : !/^\S+@\S+$/.test(val) ? 'صيغة البريد غير صحيحة' : null),
    },
  })

  // Edit form
  const editForm = useForm({
    initialValues: {
      name: '',
      code: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الجامعة مطلوب' : null),
      code: (val) => (!val?.trim() ? 'كود الجامعة مطلوب' : null),
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
        title: 'عرض المنصة العامة',
        message: 'تمت العودة إلى العرض الشامل لكافة الجامعات والمؤسسات',
        color: 'blue',
      })
    } else {
      // Switch to this university
      localStorage.setItem('gahbaz_active_university_id', univ._id)
      localStorage.setItem('gahbaz_active_university_name', `${univ.name} (${univ.code})`)
      notifications.show({
        title: 'تم تبديل السياق المؤسسي',
        message: `أنت تتصفح الآن بيئة "${univ.name}" كمدير نظام`,
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
  const totalTeachers = universities.reduce((acc, u) => acc + (u.telemetry?.teachersCount || 0), 0)

  // Columns definition for DataTable
  const columns = [
    {
      key: 'name',
      label: 'الجامعة والمؤسسة',
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
                    السياق النشط حالياً
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
      label: 'المشرف الرئيسي',
      render: (row) => (
        <Box>
          <Text size="sm" weight={600}>
            {row.admin?.name || 'غير محدد'}
          </Text>
          <Text size="xs" color="dimmed">
            {row.admin?.email || '—'}
          </Text>
        </Box>
      ),
    },
    {
      key: 'telemetry',
      label: 'المؤشرات التشغيلية',
      render: (row) => {
        const t = row.telemetry || {}
        return (
          <Group spacing={6}>
            <Tooltip label="عدد الكليات والأقسام">
              <Badge variant="outline" color="blue" size="sm" leftSection={<IconBuildingSkyscraper size={12} />}>
                {t.collegesCount || 0} كليات
              </Badge>
            </Tooltip>
            <Tooltip label="عدد التخصصات الأكاديمية">
              <Badge variant="outline" color="indigo" size="sm" leftSection={<IconCertificate size={12} />}>
                {t.majorsCount || 0} تخصص
              </Badge>
            </Tooltip>
            <Tooltip label="عدد المقررات المفتوحة">
              <Badge variant="outline" color="violet" size="sm" leftSection={<IconBook size={12} />}>
                {t.coursesCount || 0} مقرر
              </Badge>
            </Tooltip>
          </Group>
        )
      },
    },
    {
      key: 'users',
      label: 'المستخدمون المقيدون',
      render: (row) => {
        const t = row.telemetry || {}
        return (
          <Group spacing={6}>
            <Badge variant="light" color="cyan" size="sm" leftSection={<IconSchool size={12} />}>
              {t.studentsCount || 0} طالب
            </Badge>
            <Badge variant="light" color="teal" size="sm" leftSection={<IconUserCheck size={12} />}>
              {t.teachersCount || 0} معلّم
            </Badge>
          </Group>
        )
      },
    },
    {
      key: 'active',
      label: 'الحالة',
      render: (row) => (
        <Badge
          variant="filled"
          color={row.active ? 'teal' : 'red'}
          size="sm"
        >
          {row.active ? 'نشط تشغيلياً' : 'معلّق مؤقتاً'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (row) => {
        const isCurrentActive = activeSwitchedId === row._id
        return (
          <Group spacing={6}>
            <Tooltip label={isCurrentActive ? 'إلغاء التبديل والعودة للمنصة' : 'التبديل إلى بيئة هذه الجامعة'}>
              <ActionIcon
                color={isCurrentActive ? 'teal' : 'brand'}
                variant={isCurrentActive ? 'filled' : 'light'}
                onClick={() => handleSwitchContext(row)}
              >
                <IconArrowsExchange size={17} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="تعديل بيانات الجامعة">
              <ActionIcon
                color="blue"
                variant="light"
                onClick={() => handleOpenEdit(row)}
              >
                <IconPencil size={17} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={row.active ? 'تعليق الجامعة' : 'تفعيل الجامعة'}>
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
        title="إدارة الجامعات والمؤسسات التعليمية"
        description="تهيئة بيئات الجامعات المستقلة والتحكم في حالتها التشغيلية ومتابعة التبني الرقمي"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/dashboard' },
          { title: 'حوكمة المنصة', href: '/universities' },
          { title: 'إدارة الجامعات' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            radius="md"
            onClick={openAdd}
          >
            تهيئة جامعة جديدة
          </Button>
        }
      />

      {/* Active Context Banner */}
      {activeSwitchedId && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="سياق مؤسسي محدد"
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
          أنت تتصفح حالياً المنصة مقيداً بسياق: <b>{activeSwitchedName || 'جامعة محددة'}</b>. جميع العمليات الأكاديمية والاستعراض تجري ضمن هذه المؤسسة فقط. اضغط على زر الإغلاق للعودة للمنصة العامة.
        </Alert>
      )}

      {/* Summary Stat Cards */}
      <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 2 }]} mb="lg">
        <StatCard
          title="إجمالي الجامعات"
          value={totalUniversities}
          icon={IconBuildingBank}
          color="brand"
          description="المؤسسات التعليمية المقيدة بالمنصة"
        />
        <StatCard
          title="الجامعات النشطة"
          value={activeCount}
          icon={IconCircleCheck}
          color="teal"
          description="بيئات تشغيلية متاحة للدخول والتدريس"
        />
        <StatCard
          title="الجامعات المعلقة"
          value={suspendedCount}
          icon={IconShieldLock}
          color="red"
          description="مؤسسات تم حظر دخول مستخدميها مؤقتاً"
        />
        <StatCard
          title="إجمالي الطلاب المسجلين"
          value={totalStudents}
          icon={IconSchool}
          color="cyan"
          description="في الجامعات المستعرضة حالياً"
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
        emptyTitle="لا توجد جامعات مطابقة"
        emptyDescription="لم يتم العثور على جامعات تطابق معايير البحث الحالية."
        extraFilters={
          <Select
            data={[
              { value: 'all', label: 'كافة الحالات' },
              { value: 'true', label: 'النشطة فقط' },
              { value: 'false', label: 'المعلقة فقط' },
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
            تهيئة جامعة جديدة
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
              تهيئة جامعة وحساب إداري جديد
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
              label="اسم الجامعة أو المؤسسة"
              placeholder="مثال: جامعة الملك سعود"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="كود الجامعة التعريفي"
              placeholder="مثال: KSU"
              description="كود أحرف إنجليزية فريد يمثل هوية المؤسسة"
              required
              {...addForm.getInputProps('code')}
            />
            <Divider my="xs" label="بيانات المشرف الإداري الرئيسي الأول" labelPosition="center" />
            <TextInput
              label="اسم المشرف الرئيسي"
              placeholder="مثال: د. فهد العتيبي"
              required
              {...addForm.getInputProps('adminName')}
            />
            <TextInput
              label="البريد الإلكتروني للمشرف"
              placeholder="admin@ksu.edu.sa"
              required
              {...addForm.getInputProps('adminEmail')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={closeAdd}>
                إلغاء
              </Button>
              <Button type="submit" color="brand" loading={createMutation.isLoading}>
                تهيئة وتوليد بيانات الدخول
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
              تعديل بيانات الجامعة
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
              label="اسم الجامعة"
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label="كود الجامعة"
              required
              {...editForm.getInputProps('code')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={closeEdit}>
                إلغاء
              </Button>
              <Button type="submit" color="brand" loading={updateMutation.isLoading}>
                حفظ التغييرات
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
              تمت تهيئة الجامعة بنجاح!
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
              تم إنشاء المؤسسة وحساب المشرف الإداري بنجاح. يُرجى نسخ بيانات الدخول المؤقتة وتسليمها للمسؤول قبل إغلاق هذه النافذة.
            </Alert>
            <Paper p="sm" withBorder radius="md">
              <Text size="xs" color="dimmed">الجامعة والكود:</Text>
              <Text weight={700}>{createdCredentials.universityName} ({createdCredentials.universityCode})</Text>
            </Paper>
            <Paper p="sm" withBorder radius="md">
              <Text size="xs" color="dimmed">المشرف والبريد الإلكتروني:</Text>
              <Text weight={600}>{createdCredentials.adminName}</Text>
              <Text size="sm" color="brand.7">{createdCredentials.adminEmail}</Text>
            </Paper>
            <Paper p="sm" withBorder radius="md" sx={{ backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0] }}>
              <Text size="xs" color="dimmed" mb={4}>كلمة المرور المؤقتة (Temporary Password):</Text>
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
                      {copied ? 'تم النسخ' : 'نسخ كلمة المرور'}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Paper>
            <Button fullWidth color="brand" onClick={() => setCreatedCredentials(null)}>
              تم حفظ البيانات وإغلاق
            </Button>
          </Stack>
        )}
      </Modal>

      {/* Confirmation Modal for Active/Suspend */}
      <ConfirmModal
        opened={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        isLoading={toggleMutation.isLoading}
        title={confirmTarget?.active ? 'تأكيد تعليق الجامعة' : 'تأكيد تفعيل الجامعة'}
        message={
          confirmTarget?.active
            ? `هل أنت متأكد من تعليق حساب "${confirmTarget?.name}"؟ سيتم منع كافة طلابها ومعلميها وإدارييها من الدخول إلى المنصة فوراً.`
            : `هل أنت متأكد من إعادة تفعيل حساب "${confirmTarget?.name}" واستئناف العمليات؟`
        }
        confirmLabel={confirmTarget?.active ? 'تعليق المؤسسة' : 'تفعيل المؤسسة'}
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
