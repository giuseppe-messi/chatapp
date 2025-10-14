import { useChat } from "../../store/useChat";

export const Chat = () => {
  const { chattingWithUserId } = useChat();

  return (
    <main className="flex-1 flex flex-col bg-white p-4 rounded-sm rounded-tl-none rounded-bl-none">
      <h1>{chattingWithUserId}</h1>
    </main>
  );
};
