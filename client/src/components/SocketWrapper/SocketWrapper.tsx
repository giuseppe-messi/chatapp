import { useState, useEffect, useRef } from "react";
// import { ConnectionState } from './components/ConnectionState';
// import { ConnectionManager } from './components/ConnectionManager';
// import { Events } from "./components/Events";
// import { MyForm } from './components/MyForm';
import { ChatScreen } from "../ChatScreen/ChatScreen";
import type { User } from "../../domains/users/types";
import { makeSocket } from "../../socket";
import { useToastersStore } from "@react-lab-mono/ui";

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

type SocketWrapperProps = {
  currentUser: User | undefined;
  chatWithUserId: string;
};

export const SocketWrapper = ({
  currentUser,
  chatWithUserId
}: SocketWrapperProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<ReturnType<typeof makeSocket> | null>(null);
  const { enQueueToast } = useToastersStore();

  // Create the socket only when we have a user
  useEffect(() => {
    if (!currentUser?.id) return;

    const sock = makeSocket(currentUser.id);
    socketRef.current = sock;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);

    sock.connect();

    return () => {
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      sock.removeAllListeners(); // defensive, avoids ghost listeners
      sock.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?.id]);

  // Join or leave the DM room when the peer changes
  useEffect(() => {
    const sockRef = socketRef.current;
    if (!sockRef || !currentUser?.id || !chatWithUserId) return;

    sockRef.emit("dm:join", { peerId: chatWithUserId });

    const onMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

    sockRef.on("dm:message", onMessage);

    return () => {
      sockRef.off("dm:message", onMessage);
      sockRef.emit("dm:leave", { peerId: chatWithUserId });
    };
  }, [currentUser?.id, chatWithUserId]);

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
      <ChatScreen messages={messages} onSend={send} />
    </>
  );
};
