import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Accordion, Box, Group, NavLink, Text, Title, Badge } from '@mantine/core'
import { IconNotes, IconVideo, IconClock } from '@tabler/icons-react'

export const CourseContent = ({ sections = [], setNextLesson, close, to = '' }) => {
  const { lessonId } = useParams()

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
      <Title order={4} mb="md">
        محتويات الدورة
      </Title>
      <Accordion variant="separated" radius="md">
        {sections.map((section, idx) => (
          <Accordion.Item key={section._id || idx} value={`section-${idx}`}>
            <Accordion.Control>
              <Group position="apart" pr="xs">
                <Text weight={600}>{`القسم ${idx + 1}: ${section.name}`}</Text>
                <Group spacing="xs">
                  <Badge variant="light" color="blue" leftSection={<IconVideo size={14} />}>
                    {`${section.lessons?.length || 0} دروس`}
                  </Badge>
                  <Badge variant="light" color="yellow" leftSection={<IconClock size={14} />}>
                    {`${calSectionTime(section)} دقيقة`}
                  </Badge>
                </Group>
              </Group>
            </Accordion.Control>
            <Accordion.Panel p={0}>
              {section.lessons?.map((item) => (
                <Link
                  key={item._id}
                  to={`${to}${section._id}/${item._id}`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => close && close()}
                >
                  <NavLink
                    p="sm"
                    active={item._id === lessonId}
                    label={item.name}
                    icon={<IconNotes size={18} />}
                    rightSection={
                      <Group spacing={4}>
                        <IconClock size={14} color="#f59f00" />
                        <Text size="xs" color="dimmed">
                          {Math.floor(item.video?.duration || 0) + (item.topic?.readingTime || 0)} د
                        </Text>
                      </Group>
                    }
                    variant="light"
                  />
                </Link>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  )
}

export default CourseContent
