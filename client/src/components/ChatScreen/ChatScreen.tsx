import { useRef, useState } from "react";
import { useChat } from "../../store/useChat";
// import { socket } from "../../socket";

export const ChatScreen = () => {
  const { chattingWithUserId } = useChat();

  // if not user show something else

  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // socket.timeout(5000).emit("chat message", messageRef.current?.value);
  };

  return (
    <main className="flex-1 flex flex-col justify-between bg-white p-4 rounded-sm rounded-tl-none rounded-bl-none">
      <div>
        Name: <h2>{chattingWithUserId}</h2>
      </div>

      <div className="h-[64vh] overflow-y-auto my-4">
        <div className="min-h-full flex flex-1 flex-col justify-end gap-3 bg-[#00000008] p-[14px] border border-[#00000017] rounded-[4px]">
          <div className="border border-[#00000036] p-[10px] rounded-[3px] bg-[#dcdcdca3]">
            <p>
              Text Text Text Text Text Text Text Text Text Text Text Text Text
              Text Text Text Text
            </p>
          </div>
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
    </main>
  );
};
