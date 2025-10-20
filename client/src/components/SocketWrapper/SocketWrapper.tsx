import { useState, useEffect } from "react";
// import { ConnectionState } from './components/ConnectionState';
// import { ConnectionManager } from './components/ConnectionManager';
// import { Events } from "./components/Events";
// import { MyForm } from './components/MyForm';
import { socket } from "../../socket";
import { ChatScreen } from "../ChatScreen/ChatScreen";

export const SocketWrapper = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onFooEvent = (value) => {
      setFooEvents((previous) => [...previous, value]);
    };

    socket.auth = { userId: "test" };
    socket.connect();

    socket.emit("dm:send", { text: "questo messaggio" });

    // socket.on("dm:new", (msg) => addIncoming(msg));
    // socket.on("dm:sent", (msg) => updateLocal(msg));

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {/* <ConnectionState isConnected={ isConnected } />
      <Events events={ fooEvents } />
      <ConnectionManager />
      <MyForm /> */}
      <ChatScreen />
    </>
  );
};
