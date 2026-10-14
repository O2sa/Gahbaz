import React, { useEffect, useMemo, useState } from 'react'

import {
  MantineReactTable,
  // createRow,
  useMantineReactTable,
} from 'mantine-react-table'
import { ActionIcon, Button, Flex, Text, Tooltip, Box, Center, Title, Divider, Loader } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useGetElements, useUpdateElement } from '../crud'
import { useLoaderData, useParams } from 'react-router-dom'
import customFetch from '../../utils/customFetch'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'
import { Link } from 'react-router-dom'
import { IconCertificate } from '@tabler/icons-react'
import { PageHeader, EmptyState } from '../../components/common/index.js'

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
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  return (
    <>
      <PageHeader
        title="كشف الدرجات الأكاديمية"
        description="استعراض درجات الفصول الدراسية والسجل الأكاديمي الشامل"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الدرجات' },
        ]}
        action={
          <Button
            component={Link}
            to="/transcript"
            variant="filled"
            color="brand"
            radius="md"
            leftIcon={<IconCertificate size={16} />}
          >
            السجل الأكاديمي والمعدل التراكمي
          </Button>
        }
      />

      {grades.length === 0 ? (
        <EmptyState title="لا توجد درجات" message="لم يتم رصد درجات لك بعد." />
      ) : (
        grades.map((gr, idx) => (
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
      )}
    </>
  )
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
