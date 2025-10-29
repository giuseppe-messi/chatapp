import type { Message } from "../../store/useMessages";
import { DirectMessagesList } from "../DirectMessagesList/DirectMessagesList";
import { ChatInput } from "../ChatInput/ChatInput";

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
