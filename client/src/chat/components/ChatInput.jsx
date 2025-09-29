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
      //console.log('content', editor.getJSON())
      
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