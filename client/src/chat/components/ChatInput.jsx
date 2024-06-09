import { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { GrFormClose } from "react-icons/gr";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { ActionIcon, Box, Flex, Skeleton, Tooltip, useMantineTheme } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { BubbleMenu, useEditor } from "@tiptap/react";
import { IconSend } from "@tabler/icons-react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

function ChatInputOld({ handleSendMsg, setNewAttach, newAttach }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputElement = useRef();
  let url;

  useEffect(() => {
    inputElement.current.focus();
  }, []);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  if (newAttach) {
    url = URL.createObjectURL(newAttach);
  }

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0 || newAttach) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="chat-input">

      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <div className="button-container">
          <div className="emoji">
            <BsEmojiSmile onClick={handleEmojiPickerhideShow} />
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
          </div>
        </div>
        <input
          ref={inputElement}
          type="text"
          placeholder="Write a message..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <div className="buttons">
          <div className="hidden-input">
            <label className="icon-button">
              <input
                ref={inputElement}
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(event) => setNewAttach(event.target.files[0])}
              />
              <MdOutlineAddAPhoto />
            </label>
          </div>
          <button type="submit" className="icon-button submit-button">
            <IoSend />
          </button>
        </div>
      </form>

      {newAttach &&
        <div className="attachment">
          <img src={url} className="attach-file" alt={newAttach.name}/>
          <div className="close-button-wrapper">
            <button className="close-button" onClick={() => { setNewAttach() }}>
              <GrFormClose />
            </button>
          </div>
        </div>

      }
    </div>
  );
}


function ChatInput({ handleSendMsg, setNewAttach, newAttach }) {
  const theme = useMantineTheme();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: 'اكتب رسالتك' }),
    ],
    content: '',
  });
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const inputElement = useRef();
  let url;

  // useEffect(() => {
  //   inputElement.current.focus();
  // }, []);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  if (newAttach) {
    url = URL.createObjectURL(newAttach);
  }

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = () => {


    if (editor) {
      const message = editor.getHTML();
      console.log('content', editor.getJSON())
      
      // Your logic to send the message, e.g., API call
      handleSendMsg(message);

      // Clear the editor content
      editor.commands.clearContent();
    }
  };

  return (
    <Box bg={'white'} p={'sm'}>
    <Flex gap="sm" align="center">
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
      <Tooltip label="ارسال رسالة">
        <ActionIcon
          title="ارسال رسالة"
          variant="filled"
          size="xl"
          radius="xl"
          onClick={sendChat}
          color={theme.colors[theme.primaryColor][7]}
          disabled={!Boolean(editor?.getText())}
          // loading={chatsListLoading || chatsItemsLoading}
        >
          <IconSend size={24} />
        </ActionIcon>
      </Tooltip>
    </Flex>
  </Box>
  );
}

export default ChatInput;