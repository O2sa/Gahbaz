import React, { useEffect, useMemo, useState } from 'react'

import { MantineProvider } from '@mantine/core'

import {
  MantineReactTable,
  // createRow,
  useMantineReactTable,
} from 'mantine-react-table'
import { ActionIcon, Button, Flex, Text, Tooltip } from '@mantine/core'

export default function StudentGrades({}) {
  //nested data is ok, see accessorKeys in ColumnDef below

  const data = [
    {
      firstName: 'Dylan',
      lastName: 'Murray',
      address: '261 Erdman Ford',
      city: 'East Daphne',
      state: 'Kentucky',
    },
    {
      firstName: 'Raquel',
      lastName: 'Kohler',
      address: '769 Dominic Grove',
      city: 'Columbus',
      state: 'Ohio',
    },
    {
      firstName: 'Ervin',
      lastName: 'Reinger',
      address: '566 Brakus Inlet',
      city: 'South Linda',
      state: 'West Virginia',
    },
    {
      firstName: 'Brittany',
      lastName: 'McCullough',
      address: '722 Emie Stream',
      city: 'Lincoln',
      state: 'Nebraska',
    },
    {
      firstName: 'Branson',
      lastName: 'Frami',
      address: '32188 Larkin Turnpike',
      city: 'Charleston',
      state: 'South Carolina',
    },
    {
      firstName: 'Branson',
      lastName: 'Frami',
      address: '32188 Larkin Turnpike',
      city: 'Charleston',
      state: 'South Carolina',
    },
  ]

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName', //access nested data with dot notation
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },

      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
      },

      {
        accessorKey: 'city',

        header: 'City',
      },

      {
        accessorKey: 'state',

        header: 'State',
      },
    ],

    [],
  )

  const [tableData, setTableData] = useState(() => data)
  const handleSaveRow = async ({ table, row, values }) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.

    tableData[row.index] = values

    //send/receive api updates here

    console.log('tableData', tableData)
    console.log('row', row)
    console.log('values', values)
    setTableData([...tableData])
    table.setEditingRow(null) //exit editing mode
  }

  return (
    // <MantineProvider dir="rtl">
    <MantineReactTable
      columns={columns}
      data={tableData}
      editDisplayMode="row" //default
      enableEditing
      onEditingRowSave={handleSaveRow}
    />
    // {/* </MantineProvider> */}
  )
}
