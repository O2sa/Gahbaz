// GPAChart.js
import 'chart.js/auto'
import React, { useEffect, useState, useMemo } from 'react'
import { Line, Bar, Pie, Chart, Scatter, Bubble } from 'react-chartjs-2'
import { RecentMaterials } from '../../components'
import FaveriteLinks from '../../components/FaveriteLinks'
import { registerables } from 'chart.js'
import { useQuery } from '@tanstack/react-query'
import 'chartjs-adapter-date-fns'
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconSwimming,
  IconActivity,
  IconLayersIntersect,
} from '@tabler/icons-react'

import {
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
  MantineReactTable,
  useMantineReactTable,
  MRT_EditActionButtons,
} from 'mantine-react-table'
import { MRT_Localization_AR } from 'mantine-react-table/locales/ar'
// import useTable
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Flex,
  Group,
  Indicator,
  RingProgress,
  Text,
  SimpleGrid,
  Paper,
  Center,
  rem,
  Grid,
  Card,
  ThemeIcon,
  Progress,
  Title,
  Box,
} from '@mantine/core'

import { useCreateElement, useDeleteElement, useGetElements, useUpdateElement } from '../crud'
import { CSpinner } from '@coreui/react'
// Chart.register(...registerables);

const GPAChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: 'GPA',
        data: data.map((item) => item.gpa),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        reverse: true,
      },
    },
    layout: {
      padding: {
        left: 50,
      },
    },
    locale: 'ar',
  }

  return <Bar data={chartData} options={options} />
}

// CoursesChart.js

const CoursesChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.course),
    datasets: [
      {
        label: 'Students',
        data: data.map((item) => item.students),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        reverse: true,
      },
    },
    layout: {
      padding: {
        left: 50,
      },
    },
    locale: 'ar',
  }

  return <Bar data={chartData} options={options} />
}

const GradeDistributionChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: '# of Votes',
        data: data.map((item) => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  }

  const options = {
    layout: {
      padding: {
        left: 50,
      },
    },
    locale: 'ar',
  }

  return <Pie data={chartData} options={options} />
}

const SystemHealthChart = ({ data }) => {
  const memoryChartData = {
    labels: data.memory.map((item) => item.name),
    datasets: [
      {
        label: '# of Votes',
        data: data.memory.map((item) => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  }

  const memoryOps = {
    layout: {
      padding: {
        left: 50,
      },
    },
    locale: 'ar',
  }

  const chartData = {
    labels: data.cpu.map((item) => item.name),
    datasets: [
      {
        label: 'Students',
        data: data.cpu.map((item) => item.value),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        reverse: true,
      },
    },

    layout: {
      padding: {
        left: 50,
      },
    },
    locale: 'ar',
  }

  return (
    <>
      <Pie data={memoryChartData} options={memoryOps} />
      <Bar data={chartData} options={options} />
    </>
  )
}

const ActiveUsersChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: 'Active Users',
        data: data.map((item) => item.activeUsers),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  }

  const options = {
    scales: {
      x: {
        reverse: true,
      },
    },
    layout: {
      padding: {
        left: 50,
      },
    },
    locale: 'ar',
  }

  return <Line data={chartData} options={options} />
}

const LoginChart = ({ data }) => {
  const chartData = {
    labels: data.map((point) => new Date(point.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Logins',
        data: data.map((point) => point.loginCount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  }

  return <Line data={chartData} />
}
const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
}

const dataStats = [
  { label: 'Page views', stats: '456,578', progress: 65, color: 'teal', icon: 'up' },
  { label: 'New users', stats: '2,550', progress: 72, color: 'blue', icon: 'up' },
  {
    label: 'Orders',
    stats: '4,735',
    progress: 52,
    color: 'red',
    icon: 'down',
  },
]

const Charts = () => {
  const {
    data: data = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['system/get-admin-dash']))

  if (isFetching || isLoading) {
    return <CSpinner color="primary" />
  }
  console.log(data)

  const cardStyles = {
    position: 'relative',
    overflow: 'visible',
    padding: 'var(--mantine-spacing-xl)',
    paddingTop: `calc(var(--mantine-spacing-xl) * 1.5 + ${rem('20px')})`,
  }

  const iconStyles = {
    position: 'absolute',
    top: rem('-20px'),
    left: `calc(50% - ${rem('30px')})`,
  }

  const titleStyle = {
    lineHeight: '1',
  }
  return (
    <div>
      <Flex
        m={'lg'}
        wrap={'wrap'}
        gap={'md'}
        gutterXs={'lg'}
        justify={'space-between'}
        align="space-evenly"
        cols={{ base: 1, sm: 3 }}
      >
        <Paper withBorder radius="md" p="xs" w={200}>
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[{ value: 47, color: 'blue' }]}
              label={
                <Center>
                  <IconArrowUpRight style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                </Center>
              }
            />

            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {'المستخدمون'}
              </Text>
              <Text fw={700} size="xl">
                {'3434'}
              </Text>
            </div>
          </Group>
        </Paper>{' '}
        <Paper withBorder radius="md" p="xs" w={200} ta={'center'}>
          <Group h={'100%'}>
            <ThemeIcon variant="light" size={60} radius={'xl'}>
              {' '}
              <IconActivity />
            </ThemeIcon>

            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {'مستخدم نشط'}
              </Text>
              <Text fw={700} size="xl">
                {'3434'}
              </Text>
            </div>
          </Group>
        </Paper>{' '}
        <Paper withBorder radius="md" p="xs" w={200}>
          <Group>
            <ThemeIcon variant="light" size={60} radius={'xl'}>
              {' '}
              <IconLayersIntersect />
            </ThemeIcon>

            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {'الفصول الحالية'}
              </Text>
              <Text fw={700} size="xl">
                {'3434'}
              </Text>
            </div>
          </Group>
        </Paper>{' '}
      </Flex>
      <Box bg={'white'} my={'md'} p={'md'}>
        <Title order={3} mb={'lg'}>
          system
        </Title>
        <Grid>
          <Grid.Col xs={12} lg={6} h={rem('400px')}>
            <StorageCpuChart data={data.metrics} />
          </Grid.Col>
          <Grid.Col xs={12} lg={6} h={rem('400px')}>
            <NetworkChart data={data.metrics} />
          </Grid.Col>
        </Grid>
      </Box>
      <Flex justify={'space-between'} wrap={'wrap'} p={'xl'} my={'lg'} bg={'white'}>
        <RecentMaterials />
        <FaveriteLinks />
      </Flex>

      <Box bg={'white'} my={'md'} p={'md'}>
        <Title order={3} mb={'lg'}>
          حركة المستخدمين
        </Title>
        <Grid>
          <Grid.Col xs={12} lg={6} h={rem('400px')}>
            <Box bg={'white'} my={'md'} p={'md'}>
              <Title order={4} mb={'lg'}>
                تسجيلات الدخول
              </Title>
              <LoginChart data={data.loginTimes} />
            </Box>
          </Grid.Col>
          <Grid.Col xs={12} lg={6}>
            <Box bg={'white'} my={'md'} p={'md'}>
              <Title order={4} mb={'lg'}>
                المستخدمون المتصلون
              </Title>
              <ActiveUsers users={data.activeUsers} />
            </Box>{' '}
          </Grid.Col>
        </Grid>
      </Box>
    </div>
  )
}
const jobColors = {
  Admin: {
    color: 'blue',
    name: 'مدير',
  },
  Teacher: {
    name: 'معلم',
    color: 'cyan',
  },
  Student: {
    name: 'طالب',
    color: 'pink',
  },
}

export function ActiveUsers({users }) {
 
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: 'الأسم',

        Cell: ({ cell, row }) => {
          const item = row.original
          return (
            <Group gap="sm" noWrap>
              <Indicator>
                <Avatar in size={40} src={item.avatar} radius={40} />
              </Indicator>
              <div>
                <Text fz="sm" fw={500}>
                  {`${item.firstName} ${item.lastName}`}
                </Text>
                <Text fz="xs" c="dimmed">
                  {item.email}
                </Text>
              </div>
            </Group>
          )
        },
      },

      {
        accessorKey: 'phone',
        id: 'phone',
        header: 'رقم الهاتف',
      },
      {
        accessorKey: 'job',
        header: 'رقم الهاتف',
        Cell: ({ cell, row }) => {
          const job = row.original.__t
          return (
            <Badge color={jobColors[job].color} variant="light">
              {jobColors[job].name}
            </Badge>
          )
        },
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns: columns,
    data: users,
    // enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,

    localization: MRT_Localization_AR,
    getRowId: (row) => row._id,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'xl',
      size: 'lg',
    },
    // mantineToolbarAlertBannerProps: isLoadingAdminsError
    //   ? {
    //       color: 'red',
    //       children: 'خطأ في تحميل البيانات',
    //     }
    //   : undefined,

    // state: {
    //   isLoading: isLoadingAdmins,
    //   showSkeletons: isLoadingAdmins || isFetchingAdmins,
    //   showAlertBanner: isLoadingAdminsError,
    // },
    mantineTableBodyRowProps: {
      sx: {
        '&:hover': {
          backgroundColor: 'none', // Disable hover effect
        },
      },
    },
  })

  return (
    <MantineReactTable
      mantinePaperProps={{
        shadow: 'none',
        sx: {
          borderRadius: '0',
          border: '1px dashed #e0e0e0',
        },
      }}
      mantineTableProps={{
        striped: true,
      }}
      mantineTableBodyRowProps={{
        sx: {
          '&:hover': {
            backgroundColor: 'red', // Disable hover effect
          },
        },
      }}
      table={table}
    />
  )
}

const StorageCpuChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => new Date(entry.timestamp)),
    datasets: [
      {
        label: 'استخدام المعالجة (%)',
        data: data.map((entry) => entry.cpuUsage),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
        // yAxisID: 'y-axis-1',
      },
      {
        label: 'استخدام الذاكرة  (%)',
        data: data.map((entry) => entry.memoryUsage.percent),
        fill: false,
        // yAxisID: 'y-axis-2',
      },
      {
        label: 'استخدام قرص التخزين (%)',
        data: data.map((entry) => entry.diskUsage.percent),
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
        // yAxisID: 'y-axis-2',
      },
    ],
  }

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
      },
      // 'y-axis-1': {
      //   type: 'linear',
      //   position: 'left',
      //   ticks: {
      //     beginAtZero: true,
      //   },
      // },
      // 'y-axis-2': {
      //   type: 'linear',
      //   position: 'right',
      //   ticks: {
      //     beginAtZero: true,
      //   },
      // },
    },
  }

  return <Line data={chartData} options={options} />
}

const NetworkChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => new Date(entry.timestamp)),
    datasets: [
      {
        label: 'Network Incoming (KB/s)',
        data: data.map((entry) => entry.networkUsage.incoming),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
      {
        label: 'Network Outgoing (KB/s)',
        data: data.map((entry) => entry.networkUsage.outgoing),
        borderColor: 'rgba(255,159,64,1)',
        fill: false,
      },
    ],
  }

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
      },
    },
  }

  return <Line data={chartData} options={options} />
}

export default Charts
