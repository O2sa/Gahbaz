import React, { useEffect, useMemo, useState } from 'react'

import { TabsLinks } from '../../stories/Tabs/Tabs'
import { BsStack } from 'react-icons/bs'

import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'

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
import { Badge, Button } from '@mantine/core'
import { IconArrowAutofitRight, IconPhoto } from '@tabler/icons-react'

export default function Semesters({}) {
  const {
    data: semesters = [],
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['semesters']))


  if (isFetchingTeachers) {
    return (
      <CSpinner color="primary" />

    )
  }
  //DELETE action

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
              <Badge>{row.original.startDate}</Badge>
              إلى
              <Badge>{row.original.endDate}</Badge>
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
                leftSection={<IconPhoto size={14} />}
                rightSection={<IconArrowAutofitRight size={14} />}
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
    getRowId: (row) => row._id,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'xl',
      size: 'lg',
    },

    mantineTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
  })

  return (
    <>
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{'عن الكلية'} </h5>
      </div>{' '}
      <MantineReactTable table={table} />
    </>
  )
}
