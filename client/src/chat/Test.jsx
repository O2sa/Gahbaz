import {
  ActionIcon,
  Anchor,
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  Paper,
  rem,
  ScrollArea,
  Skeleton,
  Stack,
  TextInput,
  Tooltip,
  useMantineTheme,
  Breadcrumbs,
  Button,
  Text,
  Title,
  createPolymorphicComponent,
  UnstyledButton,
  Avatar,
  Menu,
  Indicator,
  Group
} from '@mantine/core'
import styled from 'styled-components'

import { IconPlus, IconRefresh } from '@tabler/icons-react'

import { Link, RichTextEditor } from '@mantine/tiptap'
import { BubbleMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

import { IconDotsVertical, IconSearch, IconSend } from '@tabler/icons-react'
import { useColorScheme, useMediaQuery } from '@mantine/hooks'
import { Carousel } from '@mantine/carousel'

import { forwardRef } from 'react'
import { io } from 'socket.io-client'
import { IconChevronDown } from '@tabler/icons-react'
import { useDashboardContext } from '../layout/DefaultLayout'
import { getSender, getSenderProfilePic } from './config/ChatLogics'

import axios from 'axios'
import { ChatState } from './context/ChatProvider'
import { useGetElements } from '../pages/crud'
import { useQuery } from '@tanstack/react-query'

const ICON_SIZE = 16

const PAPER_PROPS = {
  shadow: 'md',
  radius: 'md',
}

const PageHeader = (props) => {
  const { withActions, breadcrumbItems, title, invoiceAction, ...others } = props
  const theme = useMantineTheme()
  const colorScheme = useColorScheme()

  const BREADCRUMBS_PROPS = {
    style: {
      a: {
        padding: rem(8),
        borderRadius: theme.radius.sm,
        fontWeight: 500,
        color: colorScheme === 'dark' ? theme.white : theme.black,

        '&:hover': {
          transition: 'all ease 150ms',
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
          textDecoration: 'none',
        },
      },
    },
  }

  return (
    <>
      <Surface component={Paper} style={{ backgroundColor: 'transparent' }} {...others}>
        {withActions ? (
          <Flex
            justify="space-between"
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 'sm', sm: 4 }}
          >
            <Stack gap={4}>
              <Title order={3}>{title}</Title>
              <Text>Welcome back, Kelvin!</Text>
            </Stack>
            <Flex align="center" gap="sm">
              <ActionIcon variant="subtle">
                <IconRefresh size={16} />
              </ActionIcon>
              <FilterDateMenu />
            </Flex>
          </Flex>
        ) : invoiceAction ? (
          <Flex
            align="center"
            justify="space-between"
            direction={{ base: 'row', sm: 'row' }}
            gap={{ base: 'sm', sm: 4 }}
          >
            <Stack>
              <Title order={3}>{title}</Title>
              <Breadcrumbs {...BREADCRUMBS_PROPS}>{breadcrumbItems}</Breadcrumbs>
            </Stack>
            <Button leftSection={<IconPlus size={18} />}>New Invoice</Button>
          </Flex>
        ) : (
          <Stack gap="sm">
            <Title order={3}>{title}</Title>
            <Breadcrumbs {...BREADCRUMBS_PROPS}>{breadcrumbItems}</Breadcrumbs>
          </Stack>
        )}
      </Surface>
      <Divider />
    </>
  )
}

const Surface = createPolymorphicComponent(
  forwardRef(({ children, ...others }, ref) => (
    <Box component="div" {...others} ref={ref}>
      {children}
    </Box>
  )),
)

const ErrorAlert = ({ message, ...others }) => {
  const icon = <IconBug size={18} />
  const { title } = others

  return (
    <Alert variant="light" color="red" title={title} icon={icon} {...others}>
      {message || ''}
    </Alert>
  )
}

const UserProfileButtonWrapper = styled.div`
  .user {
    padding: var(--mantine-spacing-md);
    border-radius: var(--mantine-radius-default);

    @mixin hover {
      background-color: var(--mantine-primary-color-light);
    }
  }
`

const UserProfileButton = ({ image, name, email, icon, asAction, ...others }) => {
  return (
    <UserProfileButtonWrapper>
      <UnstyledButton className={'user'} {...others}>
        <Group>
          <Avatar src={image} radius="xl" />

          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {name}
            </Text>

            <Text size="xs">{email}</Text>
          </div>

          {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
        </Group>
      </UnstyledButton>
    </UserProfileButtonWrapper>
  )
}

const ChatItemWrapper = styled.div`
  .chatItem {
    @mixin light {
      background-color: var(--mantine-color-white);
      color: --var(--mantine-color-black);
    }

    @mixin dark {
      background-color: --var(--mantine-color-black);
      color: var(--mantine-color-white);
    }
  }

  .isMeChatItem {
    color: --var(--mantine-color-white);

    @mixin light {
      background-color: var(--mantine-primary-color-filled);
    }

    @mixin dark {
      background-color: var(--mantine-primary-color-light);
    }
  }
`
const ChatItem = (props) => {
  const { id, avatar, message, fullName, sender, sent_time, loading, ...others } = props
  const isMe = fullName.toLowerCase() === 'you'

  return (
    <ChatItemWrapper>
      {loading ? (
        <Flex gap="sm">
          <Skeleton height={48} circle mb="xl" />
          <Skeleton height={60} />
        </Flex>
      ) : (
        <Box {...others}>
          <Flex gap="xs">
            <Avatar src={avatar} radius="50%" />
            <Box>
              <Paper p="sm" className={isMe ? 'isMeChatItem' : 'chatItem'}>
                <Text size="sm" fw={600} tt="capitalize" mb={4} c={isMe ? 'white' : 'initial'}>
                  {fullName}
                </Text>
                <Text size="sm" c={isMe ? 'white' : 'initial'}>
                  {message}
                </Text>
              </Paper>
              <Text ta="end" size="sm" mt={4}>
                {sent_time}
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
    </ChatItemWrapper>
  )
}

const ChatsListWrapper = styled.div`
  .item {
    padding: var(--mantine-spacing-xs) var(--mantine-spacing-sm);

    @mixin hover {
      background-color: var(--mantine-primary-color-light);
      transition: all ease 150ms;
    }

    @mixin light {
      border-bottom: rem(1px) solid var(--mantine-color-gray-3);
    }

    @mixin dark {
      border-bottom: rem(1px) solid var(--mantine-color-gray-7);
    }
  }

  .itemRounded {
    padding: var(--mantine-spacing-xs);
    border-radius: var(--mantine-radius-default);

    @mixin hover {
      background-color: var(--mantine-primary-color-light);
    }
  }
`

const ChatsList = ({ avatar, lastName, lastMessage, firstName }) => {
  const tablet_match = useMediaQuery('(max-width: 768px)')

  return (
    <ChatsListWrapper>
      {tablet_match ? (
        <UnstyledButton className={'itemRounded'}>
          <Flex align="center" gap="xs">
            <Indicator position="bottom-end" color="green" offset={5} size={9}>
              <Avatar size="md" radius="50%" src={avatar} />
            </Indicator>
            <Text size="sm">
              {firstName} {lastName}
            </Text>
          </Flex>
        </UnstyledButton>
      ) : (
        <UnstyledButton className={'item'}>
          <Flex align="center" gap="xs">
            <Indicator position="bottom-end" color="green" offset={5} size={9}>
              <Avatar size="md" radius="50%" src={avatar} />
            </Indicator>
            <Stack gap={1}>
              <Text size="sm" fw={600} lineClamp={1}>
                {firstName} {lastName}
              </Text>
              <Text lineClamp={1} size="xs" c="dimmed">
                {lastMessage}
              </Text>
            </Stack>
          </Flex>
        </UnstyledButton>
      )}
    </ChatsListWrapper>
  )
}

const FilterDateMenu = () => {
  return (
    <Menu shadow="md" width={120}>
      <Menu.Target>
        <Button variant="subtle" rightSection={<IconChevronDown size={14} />}>
          Today: July 25
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Today</Menu.Item>
        <Menu.Item>Yesterday</Menu.Item>
        <Menu.Item>Last 7 days</Menu.Item>
        <Menu.Item>Last 30 days</Menu.Item>
        <Menu.Item>This month</Menu.Item>
        <Menu.Item>Last month</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
const TestWrapper = styled.div`
  .chatItems {
    @mixin light {
      background-color: var(--mantine-color-gray-1);
      border-left: rem(1px) solid var(--mantine-color-gray-3);
    }

    @mixin dark {
      background-color: var(--mantine-color-dark-6);
      border-left: rem(1px) solid var(--mantine-color-gray-7);
    }

    @media (max-width: $mantine-breakpoint-md) {
      @mixin light {
        border-left: rem(1px) solid var(--mantine-color-gray-3);
      }

      @mixin dark {
        border-left: rem(1px) solid var(--mantine-color-gray-7);
      }
    }
  }

  .chatHeader {
    padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
    border-top-right-radius: var(--mantine-radius-default);
    border-bottom: 1px solid light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-0));

    @mixin light {
      background-color: var(--mantine-color-white);
      border-bottom: rem(1px) solid var(--mantine-color-gray-3);
    }

    @mixin dark {
      background-color: var(--mantine-color-black);
      border-bottom: rem(1px) solid var(--mantine-color-gray-7);
    }
  }

  .user {
    border-radius: var(--mantine-radius-default);
  }

  .replyBox {
    padding: var(--mantine-spacing-sm);

    @mixin light {
      background-color: var(--mantine-color-white);
    }

    @mixin dark {
      background-color: var(--mantine-color-black);
    }
  }
`
export default function Test({ queryClient }) {
  const { user: UserProfileData } = useDashboardContext()
  const theme = useMantineTheme()
  const colorScheme = useColorScheme()
  const tablet_match = useMediaQuery('(max-width: 768px)')
  const editor = useEditor({
    extensions: [StarterKit, Link, Placeholder.configure({ placeholder: 'Type your message' })],
    content: '<p>Select some text to see a bubble menu</p>',
  })

  //   const {
  //     data: chatsListData,
  //     loading: chatsListLoading,
  //     error: chatsListError,
  //   } = useFetchData('/mocks/ChatsList.json')
  //   const {
  //     data: chatItemsData,
  //     loading: chatsItemsLoading,
  //     error: chatsItemsError,
  //   } = useFetchData('/mocks/ChatItems.json')

  const {
    data: chatsListData = [],
    isError: chatsListError,
    isFetching: isFetchingAdmins,
    isLoading: chatsListLoading,
  } = useQuery(useGetElements(['/chats/fetchChats']))

  if (chatsListLoading || isFetchingAdmins) return <>loading</>
  //   socket.current = io(host)
  //   socket.current.emit('setup', user._id)
  return (
    <>
      {/* <>
        <title>Chat | DesignSparx</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
      </> */}
      <Container fluid>
    
        <Stack>
          {/* <PageHeader title="Chat" breadcrumbItems={items} /> */}
          <Surface
            component={Paper}
            {...PAPER_PROPS}
            style={{ height: tablet_match ? 'auto' : rem(565) }}
          >
            <TestWrapper>
              <Grid gutter={0}>
              <Grid.Col span={12} sm={3} md={4} lg={3}>
                  <Stack py="md" style={{ height: '100%' }}>
                    <Box px="sm">
                      <TextInput
                        aria-label="search contact"
                        placeholder="search contacts"
                        leftSection={<IconSearch size={14} />}
                      />
                    </Box>
                    {tablet_match ? (
                      <>
                        <Carousel
                          height="100%"
                          align="start"
                          slidesToScroll={1}
                          px={32}
                          slideSize={{
                            base: '27.5%',
                            sm: '37.5%',
                            md: '22.5%',
                            lg: '25%',
                          }}
                          slideGap={{ base: 0, sm: 'md', md: 'md', lg: 'lg' }}
                        >
                          {chatsListLoading ? (
                            Array.from({ length: 6 }).map((o, i) => (
                              <Carousel.Slide key={`chat-carousel-list-${i}`} mr="md">
                                <Skeleton height={48} />
                              </Carousel.Slide>
                            ))
                          ) : chatsListError ? (
                            <ErrorAlert
                              title="Error loading chats"
                              message={chatsListError.toString()}
                            />
                          ) : (
                            chatsListData.length > 0 &&
                            chatsListData.map((c) => (
                              <Carousel.Slide key={`carousel-${c._id}`}>
                                <ChatsList
                                  lastMessage={c?.latestMessage?.content}
                                  firstName={
                                    c?.isGroupChat
                                      ? c.chatName
                                      : getSender(UserProfileData, c.users)
                                  }
                                  lastName={''}
                                  avatar={
                                    c.isGroupChat
                                      ? c.groupPic
                                      : getSenderProfilePic(UserProfileData, c.users)
                                  }
                                />
                              </Carousel.Slide>
                            ))
                          )}
                        </Carousel>
                        <Divider />
                      </>
                    ) : (
                      <Stack gap={0}>
                        {chatsListLoading ? (
                          Array.from({ length: 6 }).map((o, i) => (
                            <Box key={`chat-list-${i}`}>
                              <Skeleton height={48} radius={0} />
                              <Divider />
                            </Box>
                          ))
                        ) : chatsListError ? (
                          <ErrorAlert title="Error loading chats" message={'Error loading chats'} />
                        ) : (
                          chatsListData.length > 0 &&
                          chatsListData.map((c) => {
                            console.log('c', c)

                            return <>{c._id}</>
                            //   return (
                            //     <ChatsList
                            //       key={c._id}
                            //       lastMessage={c?.latestMessage?.content}
                            //       firstName={
                            //         c?.isGroupChat ? c.chatName : getSender(UserProfileData, c.users)
                            //       }
                            //       lastName={''}
                            //       avatar={
                            //         c.isGroupChat
                            //           ? c.groupPic
                            //           : getSenderProfilePic(UserProfileData, c.users)
                            //       }
                            //     />
                            //   )
                          })
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Grid.Col>
                <Grid.Col span={12} sm={9} md={8} lg={9} >
                  <Box className={'chatItems'}>
                    <Box className={'chatHeader'}>
                      <Skeleton
                        visible={
                          chatsListLoading
                          //  || chatsItemsLoading
                        }
                      >
                        <Flex align="center" justify="space-between">
                          <UserProfileButton
                            email={UserProfileData.email}
                            image={UserProfileData.avatar}
                            name={UserProfileData.firstName}
                            asAction={false}
                            className={'user'}
                          />
                          <Flex gap="sm">
                            <ActionIcon variant="subtle">
                              <IconSearch size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Flex>
                        </Flex>
                      </Skeleton>
                    </Box>
                    <ScrollArea h={415}>
                      {/* <Stack px="lg" py="xl">
                      {chatsItemsError ? (
                        <ErrorAlert
                          title="Error loading chat"
                          message={chatsItemsError.toString()}
                        />
                      ) : (
                        chatItemsData.length > 0 &&
                        chatItemsData.map((c) => (
                          <ChatItem
                            key={c.id}
                            avatar={c.avatar}
                            id={c.id}
                            message={c.message}
                            fullName={c.sender ? 'you' : `${c?.first_name} ${c.last_name}`}
                            sender={c.sender}
                            sent_time={c.sent_time}
                            ml={c.sender ? 'auto' : 0}
                            style={{ maxWidth: tablet_match ? '100%' : '70%' }}
                            loading={chatsItemsLoading}
                          />
                        ))
                      )}
                    </Stack> */}
                    </ScrollArea>
                    <Divider />
                    <Box className={'replyBox'}>
                      <Flex gap="sm" align="center">
                        <Skeleton
                          visible={
                            chatsListLoading
                            //   || chatsItemsLoading
                          }
                        >
                          <RichTextEditor editor={editor} style={{ flex: 1 }}>
                            {editor && (
                              <BubbleMenu editor={editor}>
                                <RichTextEditor.ControlsGroup>
                                  <RichTextEditor.Bold />
                                  <RichTextEditor.Italic />
                                  <RichTextEditor.Link />
                                </RichTextEditor.ControlsGroup>
                              </BubbleMenu>
                            )}
                            <RichTextEditor.Content />
                          </RichTextEditor>
                        </Skeleton>
                        <Tooltip label="Send message">
                          <ActionIcon
                            title="send message"
                            variant="filled"
                            size="xl"
                            radius="xl"
                            color={theme.colors[theme.primaryColor][7]}
                            disabled={!Boolean(editor?.getText())}
                            loading={
                              chatsListLoading
                              // || chatsItemsLoading
                            }
                          >
                            <IconSend size={24} />
                          </ActionIcon>
                        </Tooltip>
                      </Flex>
                    </Box>
                  </Box>
                </Grid.Col>
              </Grid>
            </TestWrapper>
          </Surface>
        </Stack>
      </Container>
    </>
  )
}
