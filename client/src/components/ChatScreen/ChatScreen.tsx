import { useLayoutEffect, useRef } from "react";
import { DirectMessage } from "../DirectMessage/DirectMessage";
import type { Message } from "../../store/useMessages";

type ChatScreenProps = {
  messages: Message[];
  onSend: (text: string) => void;
};

export const ChatScreen = ({ messages, onSend }: ChatScreenProps) => {
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const endChatRef = useRef<HTMLSpanElement | null>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (messageRef.current) onSend(messageRef.current.value);
    } catch (err) {
      console.log("🚀 ~ err:", err);
    }
  };

  useLayoutEffect(() => {
    endChatRef?.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <>
      <div className="h-[64vh] overflow-y-auto my-4">
        <div className="min-h-full flex flex-1 flex-col justify-end gap-3 bg-[#00000008] p-[14px] border border-[#00000017] rounded-[4px]">
          {messages.map((message) => (
            <DirectMessage key={message._id} message={message} />
          ))}
          <span ref={endChatRef} aria-hidden />
        </div>
      </div>

      <div>
        <form
          onSubmit={onSubmit}
          className="flex items-center justify-center gap-[14px]"
        >
          <textarea
            className="border border-gray-300 p-2 rounded w-full resize-none"
            placeholder="Type something..."
            ref={messageRef}
          ></textarea>
          <button className="flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600 w-10 h-9 text-white cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="size-5"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};
