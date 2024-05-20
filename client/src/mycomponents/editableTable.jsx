import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'

// eslint-disable-next-line react/prop-types
function EditableTable({ columns, rows }) {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              // pageSize: 200,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default EditableTable
