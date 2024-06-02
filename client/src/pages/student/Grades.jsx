import React, { useEffect, useMemo, useState } from 'react'

import {
  MantineReactTable,
  // createRow,
  useMantineReactTable,
} from 'mantine-react-table'
import { ActionIcon, Button, Flex, Text, Tooltip, Box, Center, Title, Divider } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useGetElements, useUpdateElement } from '../crud'
import { useLoaderData, useParams } from 'react-router-dom'
import customFetch from '../../utils/customFetch'
import { useDashboardContext } from '../../layout/DefaultLayout'
import { NoData, SemestersLoader } from '../LoadingComponents'

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
    return <SemestersLoader />
  }

  if (grades.length == 0) {
    return <NoData />
  }

  return grades.map((gr, idx) => (
    <Box mb={'xl'} key={idx}>
      <Title order={3} m={'lg'}>
        {`${gr.semester.name} - ${new Date(
          gr.semester.startDate,
        ).toLocaleDateString()} => ${new Date(gr.semester.endDate).toLocaleDateString()}`}{' '}
      </Title>
      <GradesTable grades={gr.grades} />
      <Divider />
    </Box>
  ))
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
              // console.log('row', row)
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
    <MantineReactTable columns={columns} data={grades} getRowId={(row) => row.id} />
    // {/* </MantineProvider> */}
  )
}
