import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { RxExit, RxPencil2 } from 'react-icons/rx'
import { GoKebabHorizontal } from 'react-icons/go'

import { ChatState } from '../context/ChatProvider'
import { getSender, getSenderProfilePic } from '../config/ChatLogics'

import UpdateGroupChat from './Group/UpdateGroupChat'
import SubmitModal from './Aux/SubmitModal'
import SingleChat from './SingleChat'

// import { ToastContainer, toast } from "react-toastify";
import axios from 'axios'
import { removeGroupChatRoute, deleteChatRoute } from '../utils/APIRoutes'
import { toastOptions } from '../utils/constants'
import { ActionIcon, Avatar, Group, UnstyledButton, Text, Button, Grid, Flex, Box } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'

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
    <Box h={'100%'}>
      <Flex h={'10%'} bg={'white'} wrap={'nowrap'} align={'center'} justify={'space-between'}>
        <Group>
          <ActionIcon
            onClick={() => {
              setSelectedChat(undefined)
            }}
          >
            <IoIosArrowBack />
          </ActionIcon>
          {selectedChat && (
            <>
              <Group gap="sm">
                <Avatar
                  size={40}
                  src={
                    selectedChat.isGroupChat
                      ? selectedChat.groupPic
                      : getSenderProfilePic(user, selectedChat.users)
                  }
                  alt={
                    selectedChat.isGroupChat
                      ? selectedChat.chatName
                      : getSender(user, selectedChat.users)
                  }
                  radius={40}
                />
                <div>
                  <Text fz="sm" fw={500}>
                    {selectedChat.isGroupChat
                      ? selectedChat.chatName
                      : getSender(user, selectedChat.users)}{' '}
                  </Text>
                  <Text fz="xs" c="dimmed">
                    {/* {item.email} */}
                  </Text>
                </div>
              </Group>
            </>
          )}
        </Group>

        <CDropdown className="me-2">
          <CDropdownToggle  color="">
            <ActionIcon variant="subtle" aria-label="Settings" color='black'>
              <GoKebabHorizontal style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>{' '}
          </CDropdownToggle>
          <CDropdownMenu>
            {selectedChat.isGroupChat ? (
              <>
                <CDropdownItem href="#">
                  <Button
                    leftSection={<RxPencil2 size={14} />}
                    onClick={updateChat}
                    variant="default"
                  >
                    Update
                  </Button>
                </CDropdownItem>
                <CDropdownItem href="#">
                  <Button
                    leftSection={<RxPencil2 size={14} />}
                    onClick={leaveChat}
                    variant="default"
                  >
                    Leave Group
                  </Button>
                </CDropdownItem>
              </>
            ) : (
              <>
                <CDropdownItem href="#">
                  <Button
                    leftSection={<RxPencil2 size={14} />}
                    onClick={deleteChat}
                    variant="default"
                  >
                    delete chat
                  </Button>
                </CDropdownItem>
              </>
            )}
          </CDropdownMenu>
        </CDropdown>
      </Flex>
     
     
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
