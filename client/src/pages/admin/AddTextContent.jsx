import React, { useEffect } from 'react'
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
import { Link } from '@mantine/tiptap'
import { useParams } from 'react-router-dom'
import client from '../../api/client'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['admin', 'common', 'errors'])
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
    editable: true,
    autofocus: false,
  })

  useEffect(() => {
    if (editor && opened) {
      const currentContent = editor.getHTML()
      const newContent = lesson.topic?.data || ''
      if (newContent !== currentContent) {
        editor.commands.setContent(newContent, false)
      }
      const timer = setTimeout(() => {
        editor.commands.focus('end')
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [opened, lesson.topic?.data, editor])

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
        title: t('common:confirmModalTitle'),
        message: t('courseBuilder.saveTextSuccess'),
        color: 'teal',
      })
      close()
    } catch (error) {
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'فشل حفظ المحتوى النصي' }),
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
        trapFocus={false}
        closeOnClickOutside={true}
        zIndex={300}
        title={
          <Text weight={700} size="md" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
            {t('courseBuilder.textContentTitle')}
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
          body: {
            padding: '16px 20px 24px',
          },
        }}
      >
        <Box
          sx={{ minHeight: 350, paddingTop: 10, cursor: 'text' }}
          onClick={() => {
            if (editor && !editor.isFocused) {
              editor.commands.focus()
            }
          }}
        >
          <Editor editor={editor} />
        </Box>

        <Group position="apart" mt="lg">
          <Button variant="default" onClick={close}>
            {t('actions.cancel', { ns: 'common' })}
          </Button>
          <Button color="brand" onClick={handleSubmit}>
            {t('courseBuilder.saveButton')}
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
