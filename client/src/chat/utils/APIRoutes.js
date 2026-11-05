export const getBackendHost = () => {
  const runtimeConfig = typeof window !== 'undefined' ? (window.__GAHBAZ_CONFIG__ || window.__ENV__) : null;
  const runtimeUrl =
    runtimeConfig?.VITE_SOCKET_URL ||
    runtimeConfig?.SOCKET_URL ||
    runtimeConfig?.VITE_BACKEND_URL ||
    runtimeConfig?.BACKEND_URL ||
    runtimeConfig?.VITE_API_URL ||
    runtimeConfig?.API_URL;

  const envUrl =
    runtimeUrl ||
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_URL;

  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0';
    if (isLocal && window.location.port !== '5000') {
      return `${window.location.protocol}//${window.location.hostname}:5000`;
    }
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

export const host = getBackendHost();

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