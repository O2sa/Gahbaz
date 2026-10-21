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
  useMantineTheme,
  rem,
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
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const page = meta?.page || 1
  const limit = meta?.limit || 10
  const total = meta?.total ?? data.length
  const totalPages = meta?.totalPages || Math.ceil(total / limit) || 1

  return (
    <Paper
      withBorder
      radius="lg"
      p="lg"
      sx={{
        backgroundColor: isDark
          ? 'rgba(37, 38, 43, 0.75)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
        boxShadow: isDark
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(30, 64, 175, 0.04)',
      }}
    >
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
              size="sm"
            />
          )}
          {extraFilters}
        </Group>

        <Group spacing="xs">
          <Badge
            color="brand"
            variant="light"
            size="lg"
            radius="md"
            sx={{ fontWeight: 700 }}
          >
            إجمالي: {total}
          </Badge>
          {actions}
        </Group>
      </Group>

      {/* Table Content */}
      <Box sx={{ overflowX: 'auto', minHeight: 220 }}>
        <Table
          verticalSpacing="md"
          horizontalSpacing="lg"
          sx={{
            minWidth: 650,
            '& thead tr th': {
              backgroundColor: isDark
                ? 'rgba(26, 27, 30, 0.6)'
                : 'rgba(248, 250, 252, 0.9)',
              color: isDark ? theme.colors.gray[4] : theme.colors.gray[7],
              fontWeight: 700,
              fontSize: rem(13),
              borderBottom: `2px solid ${
                isDark ? theme.colors.dark[4] : theme.colors.gray[2]
              }`,
              paddingTop: '12px !important',
              paddingBottom: '12px !important',
            },
            '& tbody tr': {
              transition: 'background-color 150ms ease',
              borderBottom: `1px solid ${
                isDark ? theme.colors.dark[5] : theme.colors.gray[1]
              }`,
              '&:hover': {
                backgroundColor: isDark
                  ? 'rgba(59, 130, 246, 0.08)'
                  : 'rgba(30, 64, 175, 0.03)',
              },
            },
          }}
        >
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{
                    width: col.width,
                    textAlign: col.align || 'right',
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
                      <Skeleton height={22} radius="sm" />
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
                      style={{
                        textAlign: col.align || 'right',
                        fontSize: rem(14),
                      }}
                    >
                      {col.render ? col.render(row, rIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px 0' }}>
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
          <Divider my="md" color={isDark ? 'dark.5' : 'gray.2'} />
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
                  radius="md"
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
