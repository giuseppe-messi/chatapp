import { useState, useEffect, useRef } from "react";
// import { ConnectionState } from './components/ConnectionState';
// import { ConnectionManager } from './components/ConnectionManager';
// import { Events } from "./components/Events";
// import { MyForm } from './components/MyForm';
import { ChatScreen } from "../ChatScreen/ChatScreen";
import type { User } from "../../domains/users/types";
import { makeSocket } from "../../socket";
import { useToastersStore } from "@react-lab-mono/ui";
import { useMessages } from "../../store/useMessages";
import { useChat } from "../../store/useChat";
import { UsersList } from "../UsersList/UsersList";
import { useAuth } from "../../contexts/AuthContext";

type UsereInfoForDm = {
  userId: string;
  firstname: string;
  avatar: string;
  avatarBG: string;
};

export type Message = {
  id: string;
  room: string;
  from: UsereInfoForDm;
  to: UsereInfoForDm;
  text: string;
  createdAt: number;
};

export const SocketWrapper = () => {
  const { user } = useAuth();
  const { chatWithUserId } = useChat();

  const { messages, setMessages } = useMessages();
  const [isOnline, setIsOnline] = useState(false);

  console.log("🚀 ~ isOnline:", isOnline);

  const [room, setRoom] = useState<string | null>(null);

  console.log("🚀 ~ room:", room);

  const messageSlice = room && messages[room] ? messages[room] : [];

  console.log("🚀 ~ messageSlice:", messageSlice);

  const socketRef = useRef<ReturnType<typeof makeSocket> | null>(null);
  const { enQueueToast } = useToastersStore();

  // Create the socket only when we have a user
  useEffect(() => {
    if (!user?.id) return;

    const sock = makeSocket(user.id);
    socketRef.current = sock;

    const onConnect = () => setIsOnline(true);
    const onDisconnect = () => setIsOnline(false);

    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);

    sock.connect();

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      sock.off("joined-room", () => setRoom(null));
      sock.removeAllListeners(); // defensive, avoids ghost listeners
      sock.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  // Join or leave the DM room when the peer changes
  useEffect(() => {
    const sockRef = socketRef.current;
    if (!sockRef || !user?.id || !chatWithUserId) return;

    sockRef.emit(
      "dm:join",
      chatWithUserId,
      (data: string) => {
        console.log("data: ", data);
      },
      "this is a test"
    );

    // sockRef.on("dm:joined", ({ room }: { room: string }) => {
    //   setRoom(room);
    // });

    const onMessage = (msg: Message) => {
      console.log("🚀 ~ msg:", msg);

      setMessages(msg, msg.room);
      // setMessages((prev) => [...prev, msg]);
    };

    sockRef.on("dm:message", onMessage);

    return () => {
      sockRef.off("dm:message", onMessage);
      sockRef.emit("dm:leave", { peerId: chatWithUserId });
    };
  }, [user?.id, chatWithUserId]);

  const send = (text: string) => {
    const sockRef = socketRef.current;
    if (!sockRef || !chatWithUserId) return;

    sockRef.emit("dm:send", { to: chatWithUserId, text }, (res: any) => {
      if (res?.ok) {
        // here we can put logic like 'received!
      } else {
        enQueueToast("error", res?.error ?? "Something went wrong!");
      }
    });
  };

  return (
    <>
      {/* <ConnectionState isConnected={ isConnected } />
      <ConnectionManager />
      <MyForm /> */}

      <div className="flex flex-1 mt-4 p-2">
        <UsersList />
        <main className="flex-1 flex flex-col justify-between bg-white p-4 rounded-sm rounded-tl-none rounded-bl-none">
          {chatWithUserId ? (
            <ChatScreen messages={messageSlice} onSend={send} />
          ) : (
            <p>Select someone to chat with!</p>
          )}
        </main>
      </div>
    </>
  );
};
