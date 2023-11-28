import ChatContent from "./chat-content";
import ChatList from "./chat-list";

export default function Page({ params }: { params: { chatId?: string[] } }) {
  const chatId = params.chatId?.[0];
  return (
    <div className="w-full h-full flex">
      <div className="w-80 h-full max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
        <ChatList />
      </div>
      <div className="h-full flex-1 flex flex-col">
        <ChatContent />
      </div>
    </div>
  );
}
