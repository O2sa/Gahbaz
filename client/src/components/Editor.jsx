import React from 'react'
import { RichTextEditor } from '@mantine/tiptap'
import { useMantineTheme } from '@mantine/core'

export function Editor({ editor }) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  if (!editor) return null

  return (
    <RichTextEditor
      sx={{
        height: '100%',
        backgroundColor: isDark ? 'rgba(26, 27, 30, 0.95)' : '#ffffff',
        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        '& .mantine-RichTextEditor-toolbar': {
          backgroundColor: isDark ? 'rgba(37, 38, 43, 0.95)' : '#f8fafc',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
        },
        '& .mantine-RichTextEditor-content': {
          backgroundColor: isDark ? 'rgba(26, 27, 30, 0.8)' : '#ffffff',
          color: isDark ? theme.colors.dark[0] : '#0f172a',
          minHeight: 220,
        },
        '& .mantine-RichTextEditor-control': {
          backgroundColor: isDark ? 'transparent' : undefined,
          color: isDark ? theme.colors.dark[1] : undefined,
          '&:hover': {
            backgroundColor: isDark ? theme.colors.dark[5] : undefined,
            color: isDark ? '#ffffff' : undefined,
          },
          '&[data-active]': {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.25)' : undefined,
            color: isDark ? '#93c5fd' : undefined,
          },
        },
      }}
      editor={editor}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}

export default Editor
