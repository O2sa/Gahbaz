import React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group, Button, Box, Text, useMantineTheme } from '@mantine/core'
import { Editor } from '../../components/Editor'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import Link from '@tiptap/extension-link'
import { useParams } from 'react-router-dom'
import client from '../../api/client'
import { notifications } from '@mantine/notifications'

function calculateReadingTimeFromHTML(htmlContent, averageWPM = 200) {
  if (!htmlContent) return 1
  const textContent = htmlContent.replace(/<[^>]+>/g, '')
  const wordCount = textContent.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / averageWPM))
}

export function AddTextContent({
  children,
  sectionId,
  queryClient,
  lesson = {},
  opened: controlledOpened,
  onClose: controlledOnClose,
}) {
  const { courseId } = useParams()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const [internalOpened, { open, close: internalClose }] = useDisclosure(false)
  const isControlled = controlledOpened !== undefined
  const opened = isControlled ? controlledOpened : internalOpened
  const close = isControlled ? controlledOnClose : internalClose

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: lesson.topic?.data || '',
  })

  const handleSubmit = async () => {
    try {
      const htmlContent = editor?.getHTML() || ''
      await client.patch(`sections/${sectionId}/lessons/${lesson._id}`, {
        topic: {
          data: htmlContent,
          readingTime: calculateReadingTimeFromHTML(htmlContent, 200),
        },
      })

      if (queryClient) {
        queryClient.invalidateQueries(['sections', courseId])
      }
      notifications.show({
        title: 'تم الحفظ',
        message: 'تم حفظ المحتوى النصي بنجاح',
        color: 'teal',
      })
      close()
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'فشل حفظ المحتوى النصي',
        color: 'red',
      })
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        size="xl"
        onClose={close}
        title={
          <Text weight={700} size="md" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
            تحرير المحتوى النصي للدرس
          </Text>
        }
        centered
        styles={{
          content: {
            backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
          },
          header: {
            backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
            borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
          },
        }}
      >
        <Box sx={{ minHeight: 350, paddingTop: 10 }}>
          <Editor editor={editor} />
        </Box>

        <Group position="apart" mt="lg">
          <Button variant="default" onClick={close}>
            إلغاء
          </Button>
          <Button color="brand" onClick={handleSubmit}>
            حفظ التغييرات
          </Button>
        </Group>
      </Modal>

      {children && (
        <div onClick={open} style={{ display: 'inline-block', cursor: 'pointer' }}>
          {children}
        </div>
      )}
    </>
  )
}

export default AddTextContent
