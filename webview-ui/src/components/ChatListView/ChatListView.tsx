import { Chat } from "../../utilities/ChatModel";
import { ExtensionMessenger } from "../../utilities/ExtensionMessenger";
import { ChatList } from "./ChatList";
import { ChatListHeader } from "./ChatListHeader";

interface ChatListProps {
  chatList: Chat[];
  changeActiveChat: (chat: Chat | null) => void;
}

export const ChatListView = ({ chatList, changeActiveChat }: ChatListProps) => {
  const extensionMessenger = new ExtensionMessenger();

  const createNewChat = () => {
    extensionMessenger.newChat();
  }

  const handleOnClick = (chat: Chat) => {
    changeActiveChat(chat);
  };

  const handleDeleteChat = (chat: Chat) => {
    // This updates the backend, which then posts a message to the front end
    // and then the front end does a setState() for chats
    extensionMessenger.deleteChat(chat.id);
  }

  const handleTitleChange = (chat: Chat, newTitle: string) => {
    // extensionMessenger.editTitleOfChat(chat.id, newTitle)
    console.log("handle tile change function")
    chat.title = newTitle
    extensionMessenger.updateChat(chat)

  }

  if (chatList.length === 0) {
    extensionMessenger.newChat();
    return <div>Loading...</div>;
  }
  


  return (
    <div>
      {/* <div className="delete-all">
        <VSCodeButton onClick={extensionMessenger.deleteAllChats}>
          Delete All Chats
        </VSCodeButton>
      </div> */}

      <ChatListHeader
        onClick={createNewChat}
      ></ChatListHeader>

      <ChatList
        chatList={chatList}
        handleChatClick={handleOnClick}
        handleDeleteClick={handleDeleteChat}
        handleTitleChange={handleTitleChange}
      ></ChatList>

    </div>
  );
};