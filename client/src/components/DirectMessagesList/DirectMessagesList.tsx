import { useLayoutEffect, useRef } from "react";
import type { Message } from "../../store/useMessages";
import { DirectMessage } from "../DirectMessage/DirectMessage";

type DirectMessagesListProps = {
  messages: Message[];
};

export const DirectMessagesList = ({ messages }: DirectMessagesListProps) => {
  const endChatRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    endChatRef?.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="h-[64vh] overflow-y-auto my-4">
      <div className="min-h-full flex flex-1 flex-col justify-end gap-3 bg-[#00000008] p-[14px] border border-[#00000017] rounded-[4px]">
        {messages.map((message) => (
          <DirectMessage key={message._id} message={message} />
        ))}
        <span ref={endChatRef} aria-hidden />
      </div>
    </div>
  );
};
