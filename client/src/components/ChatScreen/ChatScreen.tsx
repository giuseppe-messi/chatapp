import { ChatInput } from "../ChatInput/ChatInput";
import { DirectMessagesList } from "../DirectMessagesList/DirectMessagesList";
import type { Message } from "../../store/useMessages";

type ChatScreenProps = {
  messages: Message[];
  onSend: (text: string) => void;
};

export const ChatScreen = ({ messages, onSend }: ChatScreenProps) => (
  <>
    <DirectMessagesList messages={messages} />
    <ChatInput onSend={onSend} />
  </>
);
