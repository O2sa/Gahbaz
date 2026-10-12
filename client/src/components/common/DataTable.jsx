import React from 'react'
import {
  Paper,
  Table,
  Group,
  TextInput,
  Select,
  Pagination,
  Text,
  Badge,
  Skeleton,
  Box,
  Divider,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import EmptyState from './EmptyState.jsx'

export default function DataTable({
  columns = [],
  data = [],
  meta = { page: 1, limit: 10, total: 0, totalPages: 1 },
  isLoading = false,
  search = '',
  onSearchChange,
  onPageChange,
  onLimitChange,
  emptyTitle,
  emptyDescription,
  actions,
  extraFilters,
}) {
  const page = meta?.page || 1
  const limit = meta?.limit || 10
  const total = meta?.total ?? data.length
  const totalPages = meta?.totalPages || Math.ceil(total / limit) || 1

  return (
    <Paper withBorder radius="md" p="md" shadow="xs">
      {/* Search & Actions Bar */}
      <Group position="apart" mb="md" spacing="sm">
        <Group spacing="sm" sx={{ flex: 1 }}>
          {onSearchChange && (
            <TextInput
              placeholder="البحث بالاسم أو الكود..."
              icon={<IconSearch size={16} stroke={1.5} />}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ minWidth: 260 }}
              radius="md"
            />
          )}
          {extraFilters}
        </Group>

        <Group spacing="xs">
          <Badge color="gray" variant="light" size="lg">
            إجمالي: {total}
          </Badge>
          {actions}
        </Group>
      </Group>

      {/* Table Content */}
      <Box sx={{ overflowX: 'auto', minHeight: 200 }}>
        <Table
          striped
          highlightOnHover
          verticalSpacing="sm"
          horizontalSpacing="md"
          sx={{ minWidth: 600 }}
        >
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{
                    width: col.width,
                    textAlign: col.align || 'right',
                    fontSize: '13px',
                    color: '#64748b',
                  }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx}>
                      <Skeleton height={20} radius="sm" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data && data.length > 0 ? (
              data.map((row, rIdx) => (
                <tr key={row._id || row.id || rIdx}>
                  {columns.map((col, cIdx) => (
                    <td
                      key={col.key || cIdx}
                      style={{ textAlign: col.align || 'right' }}
                    >
                      {col.render ? col.render(row, rIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Box>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <>
          <Divider my="sm" />
          <Group position="apart" pt="xs">
            <Group spacing="xs">
              <Text size="xs" color="dimmed">
                عرض:
              </Text>
              {onLimitChange && (
                <Select
                  value={String(limit)}
                  onChange={(val) => onLimitChange(Number(val))}
                  data={[
                    { value: '10', label: '10 عناصر' },
                    { value: '25', label: '25 عنصر' },
                    { value: '50', label: '50 عنصر' },
                  ]}
                  size="xs"
                  sx={{ width: 110 }}
                />
              )}
              <Text size="xs" color="dimmed">
                الصفحة {page} من {totalPages}
              </Text>
            </Group>

            {onPageChange && (
              <Pagination
                value={page}
                onChange={onPageChange}
                total={totalPages}
                radius="md"
                size="sm"
                color="brand"
              />
            )}
          </Group>
        </>
      )}
    </Paper>
  )
}
