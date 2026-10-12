import React from 'react'
import { Box, Paper, Title, Text, SimpleGrid } from '@mantine/core'
import { IconBook, IconSchool, IconCertificate } from '@tabler/icons-react'
import { StatCard } from '../../components/common'

export default function StudentDashboard() {
  return (
    <Box p="md">
      <Paper p="xl" radius="md" withBorder bg="white" mb="lg">
        <Title order={3} mb="xs">
          مرحباً بك في لوحة تحكم الطالب
        </Title>
        <Text color="dimmed" size="sm">
          تابع مقرراتك المسجلة، المحاضرات، ودرجاتك الفصلية بكل سهولة.
        </Text>
      </Paper>

      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <StatCard
          title="مقرراتي الدراسية"
          value="المقررات"
          description="استعراض المواد والدروس المسجلة"
          icon={<IconBook size={24} />}
          color="blue"
        />
        <StatCard
          title="السجل الأكاديمي"
          value="الدرجات"
          description="كشف درجات الفصول والنتائج"
          icon={<IconCertificate size={24} />}
          color="teal"
        />
        <StatCard
          title="الحالة الدراسية"
          value="منتظم"
          description="الفصل الدراسي الحالي نشط"
          icon={<IconSchool size={24} />}
          color="indigo"
        />
      </SimpleGrid>
    </Box>
  )
}
