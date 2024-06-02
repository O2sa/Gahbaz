import React, { useEffect, useMemo, useState } from 'react'

import { TabsLinks } from '../../stories/Tabs/Tabs'
import { BsStack } from 'react-icons/bs'

import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDeleteElement, useGetElements } from '../crud'

import { TabsBody } from '../../stories/Tabs/TabsBody'
import { Link, NavLink } from 'react-router-dom'
import { TbListDetails } from 'react-icons/tb'
import {
  CTableBody,
  CTableHead,
  CTabContent,
  CTableRow,
  CTable,
  CTableDataCell,
  CTableHeaderCell,
  CSpinner,
} from '@coreui/react'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'
import { ActionIcon, Badge, Box, Button, Flex } from '@mantine/core'
import {
  IconArrowAutofitRight,
  IconArrowBarLeft,
  IconDetails,
  IconEdit,
  IconInfoCircle,
  IconPhoto,
  IconTrash,
} from '@tabler/icons-react'
import { Tooltip } from 'chart.js'
import StartSemester from './StartSemester'
import { SemestersLoader } from '../LoadingComponents'

export default function Semesters({ queryClient }) {
  const {
    data: semesters = [],
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['semesters']))

  if (isFetchingTeachers || isLoadingTeachers) {
    return (
      <Box p={'md'} bg={'white'}>
        <div
          className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
        >
          <h5>{' الفصول الحالية'} </h5>
          <StartSemester queryClient={queryClient}>
            <Button>بدأ فصل جديد</Button>
          </StartSemester>
        </div>
        <SemestersLoader />{' '}
      </Box>
    )
  }

  return (
    <>
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{' الفصول الحالية'} </h5>
        <StartSemester queryClient={queryClient}>
          <Button>بدأ فصل جديد</Button>
        </StartSemester>
      </div>
      <SemestersTable queryClient={queryClient} semesters={semesters} />{' '}
    </>
  )
}

const SemestersTable = ({ semesters, queryClient }) => {
  const { mutateAsync: deleteStudent, isLoading: isDeletingStudent } = useDeleteElement(
    queryClient,
    ['semesters'],
  )

  const openDeleteConfirmModal = (row) => deleteStudent(row.id)

  const columns = useMemo(
    () => [
      {
        id: 'index',
        enableEditing: false,
        accessorFn: (row, rowIndex) => rowIndex + 1,
        header: '#',
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'الأسم',
      },
      {
        accessorKey: 'students',
        header: 'الإيميل',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return ''
          return cell.getValue().length
        },
      },
      {
        accessorKey: 'courses',
        header: 'عدد الدورات ',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return ''
          return cell.getValue().length
        },
      },
      {
        accessorKey: 'endDate',
        header: 'الفترة',
        Cell: ({ cell, row }) => {
          if (!cell.getValue()) return ''
          return (
            <>
              <Badge>{new Date(row.original.startDate).toLocaleDateString()}</Badge>
              <br />
              إلى
              <br />

              <Badge>{new Date(row.original.endDate).toLocaleDateString()}</Badge>
            </>
          )
        },
      },
      {
        accessorKey: 'completed',
        header: 'الحالة',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return ''
          return <Badge>{cell.getValue() ? 'مكتمل' : ' ما زال'}</Badge>
        },
      },
      {
        accessorKey: 'details',
        header: 'الحالة',
        Cell: ({ cell, row }) => {
          return (
            <Link to={row.original._id}>
              <Button
                variant="light"
                leftIcon={<IconInfoCircle size={14} />}
                rightIcon={<IconArrowBarLeft size={14} />}
              >
                عرض التفاصيل
              </Button>
            </Link>
          )
        },
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns: columns,
    data: semesters,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,
    enableRowActions: true,
    getRowId: (row) => row._id,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',

    mantinePaginationProps: {
      radius: 'xl',
      size: 'lg',
    },

    renderRowActionMenuItems: ({ row }) => (
      <Flex>
        <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
          <IconTrash />
        </ActionIcon>
      </Flex>
    ),
    mantineTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
  })

  return <MantineReactTable table={table} />
}
