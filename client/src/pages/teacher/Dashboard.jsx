import React from 'react'
import { Box, Paper, Title, Text, SimpleGrid, ThemeIcon, Group } from '@mantine/core'
import { IconBook, IconUsers, IconCalendar } from '@tabler/icons-react'
import { StatCard } from '../../components/common'

export default function TeacherDashboard() {
  return (
    <Box p="md">
      <Paper p="xl" radius="md" withBorder bg="white" mb="lg">
        <Title order={3} mb="xs">
          مرحباً بك في لوحة تحكم المعلم
        </Title>
        <Text color="dimmed" size="sm">
          يمكنك متابعة مقرراتك الدراسية، والدروس، ودرجات الطلاب من خلال القائمة الجانبية.
        </Text>
      </Paper>

      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <StatCard
          title="الدورات النشطة"
          value="مقرراتي"
          description="عرض وإدارة المحاضرات والدروس"
          icon={<IconBook size={24} />}
          color="blue"
        />
        <StatCard
          title="الطلاب"
          value="المتابعة والتقييم"
          description="رصد درجات الطلاب ومتابعة الأداء"
          icon={<IconUsers size={24} />}
          color="teal"
        />
        <StatCard
          title="الفصل الحالي"
          value="نشط"
          description="الجدول الدراسي والخطط التعليمية"
          icon={<IconCalendar size={24} />}
          color="grape"
        />
      </SimpleGrid>
    </Box>
  )
}
