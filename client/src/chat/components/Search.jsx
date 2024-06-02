// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { accessChatRoute } from "../utils/APIRoutes";
import { toastOptions } from "../utils/constants";
import { ChatState } from "../context/ChatProvider";
import UserListItem from "./Aux/UserListItem";
import { Center, Stack } from "@mantine/core";

function Search({ searchResults }) {
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const accessChat = async (userId) => {
    try {
      const config = { headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };
      const postUsers = async () => {
        const { data } = await axios.post(`${accessChatRoute}`, { userId },);
        if (!chats.find((chat) => chat._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
      };
      postUsers();
      //toast.success("The user is added to your contacts");
    } catch (error) {
      //toast.error("Error fetching the chat", toastOptions);
    }
  };

  return (
    <>
      <div className="">
        {searchResults.length !== 0 ? (
          <Stack className="">
            {searchResults?.map((result) => (
              <UserListItem handleFunction={() => accessChat(result._id)}
                result={result}
                key={result._id} />
            ))}
          </Stack>
        ) : (
          <Center className="chat-loading">
            <b>No users found</b>
          </Center>
        )}
      </div>
      {/* <ToastContainer /> */}
    </>
  );
}

export default Search;