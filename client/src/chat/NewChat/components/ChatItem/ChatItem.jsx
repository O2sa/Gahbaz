import React from 'react'
import {
  Avatar,
  Box,
  Flex,
  Group,
  Paper,
  Text,
  Badge,
  Image,
  Anchor,
  useMantineTheme,
} from '@mantine/core'
import {
  IconFile,
  IconDownload,
  IconCheck,
  IconChecks,
} from '@tabler/icons-react'

const ChatItem = ({
  avatar,
  fullName,
  message,
  attachment,
  sent_time,
  isInstructor = false,
  isMe: isMeProp,
  ...others
}) => {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const isMe = isMeProp !== undefined ? isMeProp : fullName?.trim() === 'أنت'

  const isImageAttachment =
    attachment && /\.(jpg|jpeg|png|webp|gif)$/i.test(attachment)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMe ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 10,
        margin: '6px 0',
      }}
      {...others}
    >
      {/* Sender Avatar */}
      <Avatar
        src={avatar}
        radius="xl"
        size={36}
        color={isInstructor ? 'yellow' : isMe ? 'brand' : 'blue'}
        sx={{
          border: isInstructor
            ? `2px solid ${theme.colors.yellow[5]}`
            : `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        }}
      >
        {fullName ? fullName.charAt(0).toUpperCase() : '?'}
      </Avatar>

      {/* Bubble Container */}
      <Box sx={{ maxWidth: '78%' }}>
        {/* Sender Name & Role Header (only for incoming messages) */}
        {!isMe && (
          <Group spacing={6} mb={3}>
            <Text size="xs" fw={700} c={isDark ? theme.colors.dark[1] : theme.colors.gray[7]}>
              {fullName}
            </Text>
            {isInstructor && (
              <Badge color="yellow" variant="filled" size="xs" radius="sm">
                أستاذ المقرر
              </Badge>
            )}
          </Group>
        )}

        {/* Bubble Body */}
        <Paper
          p="sm"
          px="md"
          sx={{
            backgroundColor: isMe
              ? theme.colors.brand[6]
              : isDark
              ? theme.colors.dark[6]
              : theme.colors.gray[1],
            color: isMe
              ? '#ffffff'
              : isDark
              ? theme.colors.dark[0]
              : theme.black,
            borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
            wordBreak: 'break-word',
          }}
        >
          {/* Text Message Content */}
          {message && (
            <Box
              sx={{
                fontSize: 14,
                lineHeight: 1.5,
                '& a': {
                  color: isMe ? '#ffffff' : theme.colors.brand[6],
                  textDecoration: 'underline',
                },
              }}
            >
              {typeof message === 'string' ? (
                <span dangerouslySetInnerHTML={{ __html: message }} />
              ) : (
                message
              )}
            </Box>
          )}

          {/* Media / Document Attachment */}
          {attachment && (
            <Box mt={message ? 'xs' : 0}>
              {isImageAttachment ? (
                <Anchor href={attachment} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={attachment}
                    radius="md"
                    maw={280}
                    mah={220}
                    fit="cover"
                    alt="Chat Attachment"
                    sx={{
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                  />
                </Anchor>
              ) : (
                <Paper
                  p="xs"
                  radius="md"
                  withBorder
                  component="a"
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    backgroundColor: isMe
                      ? 'rgba(255, 255, 255, 0.15)'
                      : isDark
                      ? theme.colors.dark[5]
                      : theme.white,
                    color: isMe ? '#ffffff' : theme.colors.brand[7],
                    '&:hover': {
                      backgroundColor: isMe
                        ? 'rgba(255, 255, 255, 0.25)'
                        : isDark
                        ? theme.colors.dark[4]
                        : theme.colors.gray[0],
                    },
                  }}
                >
                  <IconFile size={20} />
                  <Text size="xs" fw={500} lineClamp={1} sx={{ flex: 1 }}>
                    تحميل الملف المرفق
                  </Text>
                  <IconDownload size={16} />
                </Paper>
              )}
            </Box>
          )}

          {/* Timestamp Footer inside or right below bubble */}
          <Group position="right" spacing={4} mt={4}>
            <Text
              size="10px"
              sx={{
                color: isMe ? 'rgba(255, 255, 255, 0.8)' : theme.colors.gray[5],
                userSelect: 'none',
              }}
            >
              {sent_time}
            </Text>
            {isMe && <IconChecks size={13} color="rgba(255, 255, 255, 0.85)" />}
          </Group>
        </Paper>
      </Box>
    </Box>
  )
}

export default ChatItem
