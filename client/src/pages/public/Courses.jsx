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
import { useDashboardContext } from '../../layout/DefaultLayout'
import { StudentCourses } from '../student'
import { TeacherCourses } from '../teacher'
import { Helmet } from 'react-helmet'
// Chart.register(...registerables);

const Charts = ({queryClient}) => {
  const { user } = useDashboardContext()

  const getComponent = () => {
    if (user.__t === 'Teacher') {
      return <TeacherCourses queryClient={queryClient} />
    } else if (user.__t === 'Student') {
      return <StudentCourses queryClient={queryClient} />
    }
  }
  return <div>
            <Helmet>
            <title>{ 'منصة جهبذ |  الدورات' }</title>
      </Helmet>
{getComponent()}</div>
}

export default Charts
