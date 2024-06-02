import { useDisclosure, usePagination } from '@mantine/hooks'
import { Modal, Group, Button, Box, RemoveScroll, ScrollArea } from '@mantine/core'
import { Editor } from './Editor'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { useCreateElement } from '../../pages/crud'
import { useParams } from 'react-router-dom'
import Link from '@tiptap/extension-link'
import customFetch from '../../utils/customFetch'

export function AddTextContent({ children, sectionId, queryClient, lesson }) {
  const { id } = useParams()
  const [opened, { open, close }] = useDisclosure(false)

  const content = lesson.topic ?? ''
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
    content: lesson.topic.data,
  })

  const handleSubmit = async () => {
    try {
      const htmlContent = editor.getHTML()
      await customFetch.patch(`sections/${sectionId}/lessons/${lesson._id}`, {
        topic: {
          data: htmlContent,
          readingTime: calculateReadingTimeFromHTML(htmlContent, 200),
        },
      })

      queryClient.invalidateQueries(['sections', id])
      close()
    } catch (error) {}
  }

  //   if (editor) console.log('editor', editor.getHTML())

  return (
    <>
      <Modal
        className={RemoveScroll.classNames.fullWidth}
        style={{ maxHeight: '400px', overflow: 'auto' }}
        opened={opened}
        size={'xl'}
        onClose={close}
        title="Authentication"
        centered
      >
        <Box sx={{ height: '400px' }}>
          <Editor editor={editor} />
        </Box>

        <Box m={'lg'} sx={{ position: 'sticky' }} ta="left">
          <Group sx={{ width: 'fit-content' }}>
            <Button onClick={handleSubmit}>حفظ وإغلاق</Button>
            <Button variant="subtle" onClick={close}>
              إغلاق
            </Button>
          </Group>
        </Box>
      </Modal>

      <Group onClick={open} position="center">
        {children}{' '}
      </Group>
    </>
  )
}

function calculateReadingTimeFromHTML(htmlContent, averageWPM) {
  // Extract text content from HTML
  const textContent = htmlContent.replace(/<[^>]+>/g, '') // Remove HTML tags

  // Count words (assuming words are separated by spaces)
  const wordCount = textContent.split(/\s+/).length

  // Calculate reading time (in minutes)
  const readingTime = Math.ceil(wordCount / averageWPM)

  return readingTime
}
