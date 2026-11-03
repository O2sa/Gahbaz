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
import { useTranslation } from 'react-i18next'
import { useGetElements } from '../crud.js'
import { DataTable, PageHeader } from '../../components/common/index.js'
import { useDebouncedValue } from '@mantine/hooks'

export default function TeacherCourses() {
  const { t } = useTranslation('teacher')
  const { t: tCommon } = useTranslation('common')

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
      title: t('courses.course'),
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
                {t('courses.courseCode', { code: row.code })}
              </Text>
            )}
          </div>
        </Group>
      ),
    },
    {
      key: 'semester',
      title: t('courses.term'),
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.semester?.name || t('courses.general')}
        </Badge>
      ),
    },
    {
      key: 'program',
      title: t('courses.program'),
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
      title: t('courses.instructor'),
      align: 'center',
      render: (row) => {
        const tList = row.teachers || []
        if (tList.length === 0) return <Text size="xs" color="dimmed">{t('courses.unassigned')}</Text>
        return (
          <Text size="xs" weight={500}>
            {tList
              .map((tItem) =>
                typeof tItem === 'object'
                  ? `${tItem.firstName || ''} ${tItem.lastName || ''}`.trim() || tItem.name
                  : tItem
              )
              .join('، ')}
          </Text>
        )
      },
    },
    {
      key: 'creditHours',
      title: t('courses.credits'),
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {t('courses.creditsBadge', { count: row.creditHours || row.credits || 3 })}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: t('courses.status'),
      align: 'center',
      render: (row) => (
        <Badge
          color={row.completed ? 'gray' : 'teal'}
          variant="light"
          size="sm"
        >
          {row.completed ? t('courses.completed') : t('courses.inProgress')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: tCommon('table.actions'),
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
            {t('courses.viewDetails')}
          </Button>
          <ActionIcon
            component={Link}
            to={`/courses/${row._id || row.id}/edit`}
            variant="subtle"
            color="brand"
            size="sm"
            title={t('courses.editCourse')}
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
        title={t('courses.title')}
        description={t('courses.subtitle')}
        breadcrumbs={[
          { title: tCommon('actions.home') || 'الرئيسية', href: '/' },
          { title: t('courses.title') },
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
        emptyTitle={t('courses.emptyTitle')}
        emptyDescription={t('courses.emptyDesc')}
      />
    </>
  )
}
