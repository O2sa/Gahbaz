import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { RxExit, RxPencil2 } from 'react-icons/rx'
import { GoKebabHorizontal } from 'react-icons/go'

import { ChatState } from '../context/ChatProvider'
import { getSender, getSenderFull, getSenderProfilePic } from '../config/ChatLogics'

import UpdateGroupChat from './Group/UpdateGroupChat'
import SubmitModal from './Aux/SubmitModal'
import SingleChat from './SingleChat'

// import { ToastContainer, toast } from "react-toastify";
import axios from 'axios'
import { removeGroupChatRoute, deleteChatRoute } from '../utils/APIRoutes'
import { toastOptions } from '../utils/constants'
import {
  ActionIcon,
  Avatar,
  Group,
  UnstyledButton,
  Text,
  Button,
  Grid,
  Flex,
  Box,
  Menu,
  Skeleton,
  rem,
  Divider,
} from '@mantine/core'
import { IconChevronRight, IconDotsVertical, IconSearch } from '@tabler/icons-react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import classes from './chat.module.css'
import UserButton from '../NewChat/components/UserButton/UserButton'

function ChatContainer({ socket, fetchAgain, setFetchAgain }) {
  const { setSelectedChat, selectedChat, user } = ChatState()
  const [showToggle, setShowToggle] = useState(false)
  const [modalUpdateActive, setModalUpdateActive] = useState('not')
  //submit modal
  const [modalSubmitActive, setModalSubmitActive] = useState('not')
  const [warnText, setWarnText] = useState('')
  const [submText, setSubmText] = useState('')

  const updateChat = () => {
    setModalUpdateActive('active')
    setShowToggle(!showToggle)
  }

  const leaveChat = () => {
    setModalSubmitActive('leave')
    setShowToggle(!showToggle)
    setWarnText('You cannot return this chat by yourself.')
    setSubmText(`Are you sure you want to leave ${selectedChat.chatName}?`)
  }

  const handleLeave = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.put(`${removeGroupChatRoute}`, {
        chatId: selectedChat._id,
        userId: user._id,
      })
      setFetchAgain(!fetchAgain)
      //toast.success(`You succefuly leaved ${selectedChat.chatName}`, toastOptions);
      setSelectedChat()
      setModalSubmitActive('not')
    } catch (error) {
      //toast.error("Something went wrong! Please, try again", toastOptions);
    }
  }

  const deleteChat = () => {
    setModalSubmitActive('delete')
    setShowToggle(!showToggle)
    setWarnText('You cannot restore this chat. All messages will be permanently deleted.')
    setSubmText(`Are you sure you want to delete chat with ${selectedChat.chatName}?`)
  }

  const handleDelete = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      await axios.put(`${deleteChatRoute}`, {
        chatId: selectedChat._id,
      })
      setFetchAgain(!fetchAgain)
      //toast.success(`You succefuly deleted the chat`, toastOptions);
      setSelectedChat()
      setModalSubmitActive('not')
    } catch (error) {
      //toast.error("Something went wrong! Please, try again", toastOptions);
    }
  }

  return (
    <Box
      bg={'gray.1'}
      sx={(theme) => ({
        borderLeft: `1px solid ${theme.colors.gray[3]}`,
      })}
    >
      <Box
        bg={'white'}
        sx={(theme) => ({
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          borderBottom: `1px solid ${theme.colors.gray[3]}`,
          borderTopRightRadius: `${theme.radius.md}`,
        })}
      >
        <Skeleton visible={false || false}>
          <Flex align="center" justify="space-between">
            <UserButton
              email={
                selectedChat.isGroupChat
                  ? `${selectedChat?.users?.length} عضو`
                  : getSenderFull(user, selectedChat.users)?.email
              }
              image={
                selectedChat.isGroupChat
                  ? selectedChat.groupPic
                  : getSenderProfilePic(user, selectedChat.users)
              }
              name={
                selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : getSender(user, selectedChat.users)
              }
              asAction={false}
            />
            <Flex gap="sm">
              <ActionIcon variant="subtle">
                <IconSearch size={16} />
              </ActionIcon>
              {/* <Menu>
                <Menu.Target>
                  Toggle
         
                </Menu.Target>
                <Menu.Dropdown>
                  {selectedChat.isGroupChat ? (
                    <>
                      <Menu.Item onClick={updateChat} icon={<RxPencil2 size={14} />}>
                        Update
                      </Menu.Item>
                      <Menu.Item onClick={leaveChat} icon={<RxPencil2 size={14} />}>
                        Leave Group
                      </Menu.Item>
                    </>
                  ) : (
                    <Menu.Item onClick={deleteChat} icon={<RxPencil2 size={14} />}>
                      Leave Group
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>  */}
            </Flex>
          </Flex>
        </Skeleton>
      </Box>

      <SingleChat
        fetchAgain={fetchAgain}
        socket={socket}
        setFetchAgain={setFetchAgain}
        selectedChat={selectedChat}
      />

      {modalUpdateActive === 'active' ? (
        <UpdateGroupChat
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          setModalActive={setModalUpdateActive}
        />
      ) : (
        <></>
      )}
      {modalSubmitActive === 'leave' ? (
        <SubmitModal
          setModalActive={setModalSubmitActive}
          warnText={warnText}
          submText={submText}
          handleFunction={handleLeave}
        />
      ) : (
        <></>
      )}
      {modalSubmitActive === 'delete' ? (
        <SubmitModal
          setModalActive={setModalSubmitActive}
          warnText={warnText}
          submText={submText}
          handleFunction={handleDelete}
        />
      ) : (
        <></>
      )}
    </Box>
  )
}

export default ChatContainer
