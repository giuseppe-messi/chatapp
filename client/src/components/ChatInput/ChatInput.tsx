import { useToastersStore } from "@react-lab-mono/ui";
import { useRef } from "react";

type ChatInputProps = {
  onSend: (text: string) => void;
};

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const { enQueueToast } = useToastersStore();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (messageRef.current) {
        onSend(messageRef.current.value);
        messageRef.current.value = "";
      }
    } catch (err) {
      enQueueToast("error", "Error sending the message!");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit(e);
      }}
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
  );
};
