import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiPowerOff } from 'react-icons/bi'
import { RxPencil2 } from 'react-icons/rx'
// import { toast } from 'react-toastify'
import axios from 'axios'

import { ChatState } from '../context/ChatProvider'
import { deleteUserRoute } from '../utils/APIRoutes'
import { toastOptions } from '../utils/constants'
import UpdateProfile from './UpdateProfile'
import SubmitModal from './Aux/SubmitModal'
import { ActionIcon, Avatar, Flex, Group } from '@mantine/core'

function UserInfo({ fetchAgain, setFetchAgain }) {
  const { user } = ChatState()
  const navigate = useNavigate()
  const [modalUpdateActive, setModalUpdateActive] = useState('not')
  //submit hooks
  const [deleteActive, setDeleteActive] = useState('not')
  const [warnText, setWarnText] = useState('')
  const [submText, setSubmText] = useState('')

  const handleLogout = async () => {
    localStorage.clear()
    navigate('/auth')
  }

  const deleteAccount = async () => {
    setModalUpdateActive('not')
    setDeleteActive('yes')
    setWarnText(
      'You cannot restore your account. All your chats and messages will be permanently deleted.',
    )
    setSubmText('Are you sure you want to leave your contacts and delete an account in ChatApp?')
  }

  const handleDelete = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      const { data } = await axios.put(`${deleteUserRoute}`, { userId: user._id })
      setFetchAgain(!fetchAgain)
      //toast.success('Your account is succefuly deleted', toastOptions)
      if (data.status === true) {
        localStorage.clear()
        navigate('/login')
      }
    } catch (error) {
      //toast.error(error.response.data.message, toastOptions)
    }
  }

  return (
    <Flex p={'xs'} align={'center'} justify='space-between' h={'10%'}  bg={'brand'}  >
      <Avatar size={40} src={user.avatar} alt={`${user.firstName} ${user.lastName}`} radius={40} />
      <Group >
        <ActionIcon
          onClick={() => {
            setModalUpdateActive('active')
          }}
        >
          <RxPencil2 />
        </ActionIcon>
        <ActionIcon onClick={handleLogout}>
          <BiPowerOff />
        </ActionIcon>
      </Group>

      {modalUpdateActive === 'active' && (
        <UpdateProfile
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          setModalActive={setModalUpdateActive}
          handleDelete={deleteAccount}
        />
      )}


      {deleteActive === 'yes' && (
        <SubmitModal
          setModalActive={setDeleteActive}
          warnText={warnText}
          submText={submText}
          handleFunction={handleDelete}
        />
      )}
    </Flex>
  )
}

export default UserInfo
