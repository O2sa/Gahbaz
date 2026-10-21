import React, { useState } from 'react'
import {
  Group,
  Button,
  ActionIcon,
  Badge,
  Text,
} from '@mantine/core'
import { Link } from 'react-router-dom'
import {
  IconInfoCircle,
  IconPencil,
  IconBook,
  IconArrowLeft,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud.js'
import { DataTable, PageHeader } from '../../components/common/index.js'
import { useDebouncedValue } from '@mantine/hooks'

export default function TeacherCourses() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  const {
    data: courses = [],
    isLoading,
  } = useQuery(useGetElements(['courses']))

  const courseList = Array.isArray(courses)
    ? courses
    : Array.isArray(courses?.data)
    ? courses.data
    : []

  const filteredCourses = courseList.filter((c) => {
    if (!debouncedSearch) return true
    const term = debouncedSearch.toLowerCase()
    return (
      c.name?.toLowerCase().includes(term) ||
      c.code?.toLowerCase().includes(term) ||
      c.category?.toLowerCase().includes(term) ||
      c.semester?.name?.toLowerCase().includes(term) ||
      c.semester?.major?.name?.toLowerCase().includes(term)
    )
  })

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * limit,
    page * limit
  )

  const columns = [
    {
      key: 'name',
      title: 'المقرر الدراسي',
      render: (row) => (
        <Group spacing="xs">
          <IconBook size={18} color="#7c3aed" />
          <div>
            <Link
              to={`/courses/${row._id || row.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Text
                weight={600}
                size="sm"
                sx={{ '&:hover': { color: '#7c3aed', textDecoration: 'underline' } }}
              >
                {row.name}
              </Text>
            </Link>
            {row.code && (
              <Text size="xs" color="dimmed">
                رمز المادة: {row.code}
              </Text>
            )}
          </div>
        </Group>
      ),
    },
    {
      key: 'semester',
      title: 'الفصل الدراسي',
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.semester?.name || 'عام'}
        </Badge>
      ),
    },
    {
      key: 'program',
      title: 'التخصص والكلية',
      align: 'center',
      render: (row) => {
        const majorName = row.semester?.major?.name
        const collegeName = row.semester?.major?.college?.name || row.college?.name
        if (!majorName && !collegeName) return <Text size="xs" color="dimmed">—</Text>
        return (
          <Badge color="indigo" variant="outline" size="sm">
            {majorName ? `${majorName} • ${collegeName || ''}` : collegeName}
          </Badge>
        )
      },
    },
    {
      key: 'teachers',
      title: 'مدرس المقرر',
      align: 'center',
      render: (row) => {
        const tList = row.teachers || []
        if (tList.length === 0) return <Text size="xs" color="dimmed">لم يعين مدرس</Text>
        return (
          <Text size="xs" weight={500}>
            {tList
              .map((t) =>
                typeof t === 'object'
                  ? `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.name
                  : t
              )
              .join('، ')}
          </Text>
        )
      },
    },
    {
      key: 'creditHours',
      title: 'الساعات',
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {row.creditHours || row.credits || 3} س
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'الحالة',
      align: 'center',
      render: (row) => (
        <Badge
          color={row.completed ? 'gray' : 'teal'}
          variant="light"
          size="sm"
        >
          {row.completed ? 'مكتمل' : 'قيد التدريس'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'left',
      render: (row) => (
        <Group spacing="xs" position="left">
          <Button
            component={Link}
            to={`/courses/${row._id || row.id}`}
            variant="light"
            size="xs"
            leftIcon={<IconInfoCircle size={14} />}
            rightIcon={<IconArrowLeft size={14} />}
          >
            عرض التفاصيل
          </Button>
          <ActionIcon
            component={Link}
            to={`/courses/${row._id || row.id}/edit`}
            variant="subtle"
            color="brand"
            size="sm"
            title="تعديل المقرر"
          >
            <IconPencil size={15} />
          </ActionIcon>
        </Group>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="المقررات الدراسية المفتوحة"
        description="إدارة ومتابعة المقررات الدراسية، الفصول التابعة لها، وأعضاء هيئة التدريس المسندين"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'المقررات' },
        ]}
      />

      <DataTable
        columns={columns}
        data={paginatedCourses}
        meta={{
          page,
          limit,
          total: filteredCourses.length,
          totalPages: Math.ceil(filteredCourses.length / limit) || 1,
        }}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        emptyTitle="لا توجد مقررات دراسية"
        emptyDescription="لم يتم العثور على أي مقررات نشطة في النظام حالياً."
      />
    </>
  )
}
