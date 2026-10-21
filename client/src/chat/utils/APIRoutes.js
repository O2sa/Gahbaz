export const host =
  typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:5000'
    : typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:5000';

export const loginRoute = `/api/v1/auth/login`;
export const registerRoute = `/api/v1/auth/register`;

export const allUsersRoute = `/api/v1/users`;
export const deleteUserRoute = `/api/v1/users`;

export const renameUserRoute = `/api/v1/users/renameUser`;
export const emailUpdateRoute = `/api/v1/users/emailUpdate`;
export const avatarUpdateRoute = `/api/v1/users/avatarUpdate`;
export const passwordUpdateRoute = `/api/v1/users/passwordUpdate`;

export const sendMessageRoute = `/api/v1/messages/addmsg`;
export const recieveMessageRoute = `/api/v1/messages/getmsg`;

export const accessChatRoute = `/api/v1/chats/accessChat`;
export const fetchChatsRoute = `/api/v1/chats/fetchChats`;
export const courseChatRoute = `/api/v1/chats/course`;
export const deleteChatRoute = `/api/v1/chats/deleteChat`;

export const groupChatRoute = `/api/v1/chats/group`;
export const renameGroupChatRoute = `/api/v1/chats/rename`;
export const removeGroupChatRoute = `/api/v1/chats/groupremove`;
export const addGroupChatRoute = `/api/v1/chats/groupadd`;
export const updateGroupPicChatRoute = `/api/v1/chats/grouppic`;