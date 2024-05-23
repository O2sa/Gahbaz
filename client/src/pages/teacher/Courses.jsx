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
import { useDashboardContext } from '../../layout/DefaultLayout'

export default function Courses({ queryClient }) {
  const { user } = useDashboardContext()
  const {
    data: courses = [],
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['courses']))

  if (isFetchingTeachers) {
    return <CSpinner color="primary" />
  }

  if (courses.length == 0) {
    return (
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{'عن الكلية'} </h5>
      </div>
    )
  }
  return <SemestersTable queryClient={queryClient} courses={courses} />
}

const SemestersTable = ({ courses, queryClient }) => {
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
        header: 'الدورة',
      },
      {
        accessorKey: 'subtitle',
        header: 'الإيميل',
      },
      {
        accessorKey: 'category',
        header: 'category',
      },

      {
        accessorKey: 'details',
        header: 'الحالة',
        Cell: ({ cell, row }) => {
          return (
            <Link to={`{${row.original._id}`}>
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
    data: courses,
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
    // renderRowActions: ({ row, table }) => (
    //   <Flex gap="md">

    //     <Tooltip label="حذف">
    // <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
    //         <IconTrash />
    //       </ActionIcon>
    //     </Tooltip>
    //   </Flex>
    // ),
    renderRowActionMenuItems: ({ row }) => (
      <Flex>
            <Link to={`${row.original._id}/edit`}>
          <ActionIcon color="red">
            <IconTrash />
          </ActionIcon>
        </Link>
      </Flex>
    ),
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
      </div>
      <MantineReactTable table={table} />
    </>
  )
}
