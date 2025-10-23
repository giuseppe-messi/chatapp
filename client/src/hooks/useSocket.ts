import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToastersStore } from "@react-lab-mono/ui";
import { makeSocket } from "../socket";
import { useUsers } from "../store/useUsers";
import { useMessages, type Message } from "../store/useMessages";

export const useSocket = () => {
  const { user } = useAuth();
  const { messages, setMessages } = useMessages();
  const { peerId, setOnlineUsersIds } = useUsers();
  const [isOnline, setIsOnline] = useState(false);
  const [room, setRoom] = useState<string | null>(null);
  const messageSlice = room && messages[room] ? messages[room] : [];
  const { enQueueToast } = useToastersStore();

  const socketRef = useRef<ReturnType<typeof makeSocket> | null>(null);

  // Create the socket only when we have a user
  useEffect(() => {
    if (!user?.id) return;

    const newSocket = makeSocket(user.id);
    socketRef.current = newSocket;

    const onConnect = () => setIsOnline(true);
    const onDisconnect = () => setIsOnline(false);

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.connect();

    newSocket.on("online-users", (usersIds) => setOnlineUsersIds(usersIds));

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.removeAllListeners(); // defensive, avoids ghost listeners
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]);

  // Join or leave the DM room when the peer changes
  useEffect(() => {
    const sockRef = socketRef.current;
    if (!sockRef || !user?.id || !peerId) return;

    sockRef.emit("dm:join", peerId, (room: string, message: any) => {
      console.log("🚀 ~ message:", message);

      setRoom(room);
      setMessages(message, room);
    });

    const onMessage = (msg: Message) => setMessages(msg, msg.room);
    sockRef.on("dm:message", onMessage);

    return () => {
      sockRef.off("dm:message", onMessage);
      sockRef.emit("dm:leave", peerId);
    };
  }, [user?.id, peerId]);

  const sendMessage = (text: string) => {
    const sockRef = socketRef.current;
    if (!sockRef || !peerId) return;

    sockRef.emit("dm:send", peerId, text, (res: any) => {
      if (res?.ok) {
        // here we can put logic like 'received!
      } else {
        enQueueToast("error", res?.error ?? "Something went wrong!");
      }
    });
  };

  return {
    user,
    peerId,
    isOnline,
    messageSlice,
    sendMessage
  };
};
