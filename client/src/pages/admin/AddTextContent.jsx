import React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group, Button, Box } from '@mantine/core'
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

export function AddTextContent({ children, sectionId, queryClient, lesson = {} }) {
  const { courseId } = useParams()
  const [opened, { open, close }] = useDisclosure(false)

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
        color: 'green',
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
      <Modal opened={opened} size="xl" onClose={close} title="إضافة محتوى نصي للدرس" centered>
        <Box sx={{ minHeight: 350 }}>
          <Editor editor={editor} />
        </Box>

        <Group position="apart" mt="lg">
          <Button variant="default" onClick={close}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>
            حفظ وإغلاق
          </Button>
        </Group>
      </Modal>

      <div onClick={open} style={{ display: 'inline-block', cursor: 'pointer' }}>
        {children}
      </div>
    </>
  )
}

export default AddTextContent
