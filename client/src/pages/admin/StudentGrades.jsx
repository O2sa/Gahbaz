import React, { useEffect, useMemo, useState } from 'react'

import {
  MantineReactTable,
  // createRow,
  useMantineReactTable,
} from 'mantine-react-table'
import { ActionIcon, Button, Flex, Text, Tooltip, Box, Group, Indicator, Avatar } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useGetElements, useUpdateElement } from '../crud'
import { useLoaderData, useParams } from 'react-router-dom'
import customFetch from '../../utils/customFetch'

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(useGetElements(['grades', params.courseId]))
      return params.courseId
    } catch (error) {
      console.error(error?.response?.data?.msg)
      // return redirect('/dashboard/all-jobs');
    }
  }

export default function StudentGrades({ queryClient }) {
  //nested data is ok, see accessorKeys in ColumnDef below
  const courseId = useLoaderData()

  const {
    data: grades = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['grades', courseId]))

  const { mutateAsync: update, isLoading: isUpdatingStudent } = useUpdateElement(queryClient, [
    'grades',
    courseId,
  ])

  if (isFetching || isLoading) {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        Loading
      </div>
    )
  }
  
  if (grades.length==0 ) {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        no students
      </div>
    )
  }

  return <GradesTable grades={grades} />
}

const GradesTable = ({ grades }) => {
  const columns = useMemo(
    () => [
      {
        id: 'student',
        header: 'الطالب',
        columns: [
          {
            accessorKey: 'student',
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
            header: 'الطالب',
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
            enableEditing: true,
            mantineEditTextInputProps: {
              type: 'number',
            },
            // Cell: ({ cell }) => {
            //   return (
            //     <Box>
            //       <Text>{cell.getValue()?.value ?? ''}</Text>
            //     </Box>
            //   )
            // },
          })),
        ],
      },


      {
   
        accessorKey: 'total',
        header: 'المجموع',
        enableEditing: false,
       
      }
    ],

    [],
  )

  const [tableData, setTableData] = useState( grades)

  const setupDataToUpdata = (values, row) => {
    delete values['student']
    delete values['total']

    for (const d in values) {
      row.grade[d].value = Number(values[d])
    }
    return row
  }

  
  const handleSaveRow = async ({ table, row, values }) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.

    const updatedRow = setupDataToUpdata(values, tableData[row.index])
    console.log('updatedRow', updatedRow)
    console.log('tableData', tableData)
    console.log('row', row)
    console.log('values', values)

    try {
      await customFetch.patch(`grades/${updatedRow._id}`, updatedRow)

      tableData[row.index] = updatedRow
      setTableData([...tableData])
      table.setEditingRow(null) //exit editing mode
    } catch (error) {
      console.error(error?.response?.data?.msg)
      // return redirect('/dashboard/all-jobs');
    }
  }
  console.log('tableData', tableData)

  return (
    // <MantineProvider dir="rtl">
    <MantineReactTable
      columns={columns}
      data={tableData}
      editDisplayMode="row" //default
      enableEditing
      getRowId={(row) => row.id}
      onEditingRowSave={handleSaveRow}
    />
    // {/* </MantineProvider> */}
  )
}

const setupGrades = (grades) => {
  const arr = []
  for (const grade of grades) {
    const obj = {}
    obj['student'] = grade.student
    obj['total'] = grade.total
    obj['id'] = grade._id

    for (const va in grade.grade.grade) {
      obj[`${va}`] = grade.grade.grade[va].value
    }

    arr.push(obj)
  }
  console.log(arr)
  return arr
}
