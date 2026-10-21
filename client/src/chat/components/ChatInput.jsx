import React, { useState } from 'react'
import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Text,
  Textarea,
  Tooltip,
  FileButton,
  Image,
  useMantineTheme,
  Popover,
} from '@mantine/core'
import {
  IconSend,
  IconPaperclip,
  IconX,
  IconFile,
  IconMoodSmile,
} from '@tabler/icons-react'
import Picker from 'emoji-picker-react'

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function ChatInput({ handleSendMsg, setNewAttach, newAttach, loading = false }) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const [msg, setMsg] = useState('')
  const [emojiOpened, setEmojiOpened] = useState(false)

  const handleSend = () => {
    const text = msg.trim()
    if (!text && !newAttach) return
    handleSendMsg(text)
    setMsg('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const onEmojiClick = (emojiData) => {
    setMsg((prev) => prev + (emojiData.emoji || ''))
    setEmojiOpened(false)
  }

  const isImageAttachment =
    newAttach &&
    (newAttach.type?.startsWith('image/') ||
      /\.(jpg|jpeg|png|webp|gif)$/i.test(newAttach.name || ''))

  return (
    <Box
      sx={{
        backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
        borderTop: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        padding: '10px 16px',
      }}
    >
      {/* File Preview Chip if an attachment is queued */}
      {newAttach && (
        <Paper
          mb="xs"
          p="xs"
          px="sm"
          radius="md"
          withBorder
          sx={{
            backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
            borderColor: theme.colors.brand[5],
          }}
        >
          <Group position="apart">
            <Group spacing="xs">
              {isImageAttachment ? (
                <Image
                  src={URL.createObjectURL(newAttach)}
                  width={38}
                  height={38}
                  radius="sm"
                  fit="cover"
                  alt="Attachment preview"
                />
              ) : (
                <IconFile size={22} color={theme.colors.brand[6]} />
              )}
              <Box>
                <Text size="xs" fw={600} lineClamp={1} maw={260}>
                  {newAttach.name}
                </Text>
                <Text size="10px" c="dimmed">
                  {formatFileSize(newAttach.size)}
                </Text>
              </Box>
            </Group>

            <ActionIcon
              size="sm"
              color="red"
              variant="subtle"
              onClick={() => setNewAttach(null)}
              title="إلغاء المرفق"
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Paper>
      )}

      {/* Main Input Dock */}
      <Group spacing="xs" align="flex-end" noWrap>
        {/* Attachment Button */}
        <FileButton
          onChange={setNewAttach}
          accept="image/*,application/pdf,.doc,.docx,.zip,.txt"
        >
          {(props) => (
            <Tooltip label="إرفاق ملف أو صورة" position="top" withArrow>
              <ActionIcon
                {...props}
                size="lg"
                variant="light"
                color="gray"
                radius="xl"
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.colors.brand[6],
                    backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.brand[0],
                  },
                }}
              >
                <IconPaperclip size={20} />
              </ActionIcon>
            </Tooltip>
          )}
        </FileButton>

        {/* Emoji Popover */}
        <Popover
          opened={emojiOpened}
          onChange={setEmojiOpened}
          position="top-start"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Tooltip label="إضافة رمز تعبيري" position="top" withArrow>
              <ActionIcon
                size="lg"
                variant="subtle"
                color="gray"
                radius="xl"
                onClick={() => setEmojiOpened((o) => !o)}
              >
                <IconMoodSmile size={20} />
              </ActionIcon>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown p={0}>
            <Picker
              onEmojiClick={onEmojiClick}
              theme={isDark ? 'dark' : 'light'}
              searchPlaceHolder="ابحث عن رمز تعبيري..."
              width={320}
              height={380}
            />
          </Popover.Dropdown>
        </Popover>

        {/* Text Input Area */}
        <Textarea
          placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال، Shift + Enter لسطر جديد)"
          autosize
          minRows={1}
          maxRows={5}
          value={msg}
          onChange={(e) => setMsg(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          sx={{ flex: 1 }}
          styles={{
            input: {
              borderRadius: 14,
              backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
              fontSize: 14,
              padding: '10px 14px',
              '&:focus': {
                borderColor: theme.colors.brand[5],
              },
            },
          }}
        />

        {/* Send Button */}
        <Tooltip label="إرسال" position="top" withArrow>
          <ActionIcon
            size="lg"
            color="brand"
            variant="filled"
            radius="xl"
            loading={loading}
            disabled={!msg.trim() && !newAttach}
            onClick={handleSend}
            sx={{
              height: 42,
              width: 42,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.15s ease',
              '&:active': { transform: 'scale(0.94)' },
            }}
          >
            <IconSend size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  )
}

export default ChatInput