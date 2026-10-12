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
    return (
      c.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
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
            <Text weight={600} size="sm">
              {row.name}
            </Text>
            {row.subtitle && (
              <Text size="xs" color="dimmed">
                {row.subtitle}
              </Text>
            )}
          </div>
        </Group>
      ),
    },
    {
      key: 'category',
      title: 'التصنيف / القسم',
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {row.category || 'عام'}
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
        title="المقررات الدراسية"
        description="إدارة ومتابعة المقررات والمحتوى الأكاديمي المسند للتدريس"
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
        emptyDescription="لم يتم العثور على أي مقررات مسندة إليك حالياً."
      />
    </>
  )
}
