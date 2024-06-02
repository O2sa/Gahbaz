import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardContext } from '../../layout/DefaultLayout'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState()
  // const [user, setUser] = useState();
  const [notification, setNotification] = useState([])
  const [chats, setChats] = useState()
  const [chts, setChts] = useState()

  const navigate = useNavigate()

  const { user } = useDashboardContext()

  if (!user) navigate('/login')

  // useEffect(() => {
  //   const {user} = useDashboardContext();
  //   setUser(user);

  //   if (!user) navigate("/login");
  // }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        // setUser,
        notification,
        setNotification,
        chats,
        setChats,
        chts,
        setChts,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => {
  return useContext(ChatContext)
}

export default ChatProvider
