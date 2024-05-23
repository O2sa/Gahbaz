import React, { useEffect, useMemo, useState } from 'react'

import {
  MantineReactTable,
  // createRow,
  useMantineReactTable,
} from 'mantine-react-table'
import { ActionIcon, Button, Flex, Text, Tooltip, Box } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useGetElements, useUpdateElement } from '../crud'
import { useLoaderData, useParams } from 'react-router-dom'
import customFetch from '../../utils/customFetch'
import { useDashboardContext } from '../../layout/DefaultLayout'

export default function Grades({ queryClient }) {
  //nested data is ok, see accessorKeys in ColumnDef below
  const { user } = useDashboardContext()
  const {
    data: grades = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['grades', 'student-grades', user._id]))



  if (isFetching || isLoading) {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        Loading
      </div>
    )
  }

  if (grades.length == 0) {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        
      </div>
    )
  }

  return <GradesTable grades={grades} />
}

const GradesTable = ({ grades }) => {
  const columns = useMemo(
    () => [
      {
        id: 'Course',
        header: 'الطالب',
        columns: [
          {
            id: 'course',
            accessorKey: 'course',
            Cell: ({ cell }) => {
              if (!cell.getValue() || cell.getValue().length == 0) return ''
              return cell.getValue()?.name || ''
            },
            header: 'course',
            enableEditing: false,
          },
        ],
      },
      {
        id: 'grade',
        header: 'الدرجة',
        columns: [
          ...Object.keys(grades[0].grade).map((gr, idx) => ({
            // accessorKey: `grade.${gr}.value`,
            accessorFn: (row) => {
              console.log('row', row)
              return row.grade[gr].value
            },
            id: gr,
            header: grades[0].grade[gr].name,
          })),

          {
            accessorKey: 'total',
            id: 'total',
            header: 'المجموع',
          },
        ],
      },
    ],

    [],
  )

  return (
    // <MantineProvider dir="rtl">
    <MantineReactTable
      columns={columns}
      data={grades}
      getRowId={(row) => row.id}
    />
    // {/* </MantineProvider> */}
  )
}
