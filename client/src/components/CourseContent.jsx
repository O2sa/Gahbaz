import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Accordion, Box, Group, NavLink, Text, Title, Badge, useMantineTheme, rem } from '@mantine/core'
import { IconNotes, IconVideo, IconClock, IconBook2 } from '@tabler/icons-react'

export const CourseContent = ({ sections = [], setNextLesson, close, to = '' }) => {
  const { lessonId } = useParams()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const calSectionTime = (section) => {
    let time = 0
    const lessons = section.lessons || []
    lessons.forEach((item, idx) => {
      time += (item.video?.duration || 0) + (item.topic?.readingTime || 0)
      if (lessonId === item._id && setNextLesson) {
        const next = lessons[idx + 1]
        setNextLesson(next ? `${section._id}/${next._id}` : null)
      }
    })
    return Math.floor(time)
  }

  return (
    <Box>
      <Group spacing="xs" mb="md">
        <IconBook2 size={20} color={isDark ? '#60a5fa' : theme.colors.brand[6]} />
        <Title order={4} sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 800 }}>
          محتويات الدورة
        </Title>
      </Group>

      <Accordion
        variant="separated"
        radius="lg"
        styles={{
          item: {
            backgroundColor: isDark ? 'rgba(26, 27, 30, 0.85)' : '#ffffff',
            borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
            marginBottom: rem(10),
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            '&[data-active]': {
              borderColor: isDark ? theme.colors.brand[7] : theme.colors.brand[3],
            },
          },
          control: {
            padding: `${rem(12)} ${rem(16)}`,
            borderRadius: theme.radius.lg,
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : theme.colors.gray[0],
            },
          },
          content: {
            padding: 0,
            borderTop: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[1]}`,
          },
        }}
      >
        {sections.map((section, idx) => (
          <Accordion.Item key={section._id || idx} value={`section-${idx}`}>
            <Accordion.Control>
              <Group position="apart" pr="xs">
                <Text
                  weight={700}
                  size="sm"
                  sx={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                >
                  {`القسم ${idx + 1}: ${section.name}`}
                </Text>
                <Group spacing={6}>
                  <Badge
                    variant="light"
                    color="blue"
                    size="sm"
                    leftSection={<IconVideo size={13} />}
                  >
                    {`${section.lessons?.length || 0} دروس`}
                  </Badge>
                  <Badge
                    variant="light"
                    color="yellow"
                    size="sm"
                    leftSection={<IconClock size={13} />}
                  >
                    {`${calSectionTime(section)} د`}
                  </Badge>
                </Group>
              </Group>
            </Accordion.Control>

            <Accordion.Panel>
              {section.lessons?.map((item) => {
                const active = item._id === lessonId
                return (
                  <Link
                    key={item._id}
                    to={`${to}${section._id}/${item._id}`}
                    style={{ textDecoration: 'none' }}
                    onClick={() => close && close()}
                  >
                    <NavLink
                      p="sm"
                      active={active}
                      label={
                        <Text
                          size="sm"
                          weight={active ? 700 : 500}
                          sx={{
                            color: active
                              ? isDark
                                ? '#93c5fd'
                                : theme.colors.brand[8]
                              : isDark
                              ? theme.colors.dark[0]
                              : theme.colors.gray[8],
                          }}
                        >
                          {item.name}
                        </Text>
                      }
                      icon={
                        <IconNotes
                          size={18}
                          color={
                            active
                              ? isDark
                                ? '#60a5fa'
                                : theme.colors.brand[6]
                              : isDark
                              ? theme.colors.dark[2]
                              : theme.colors.gray[5]
                          }
                        />
                      }
                      rightSection={
                        <Group spacing={4}>
                          <IconClock size={13} color="#f59f00" />
                          <Text size="xs" color="dimmed">
                            {Math.floor(item.video?.duration || 0) + (item.topic?.readingTime || 0)} د
                          </Text>
                        </Group>
                      }
                      sx={{
                        transition: 'all 140ms ease',
                        borderRight: active
                          ? `3px solid ${isDark ? '#3b82f6' : theme.colors.brand[6]}`
                          : '3px solid transparent',
                        backgroundColor: active
                          ? isDark
                            ? 'rgba(59, 130, 246, 0.18)'
                            : 'rgba(30, 64, 175, 0.08)'
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: active
                            ? undefined
                            : isDark
                            ? theme.colors.dark[5]
                            : theme.colors.gray[1],
                        },
                      }}
                    />
                  </Link>
                )
              })}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  )
}

export default CourseContent
