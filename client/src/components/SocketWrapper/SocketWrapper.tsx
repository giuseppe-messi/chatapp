import { useState, useEffect } from "react";
// import { socket } from "../../socket";
import { ChatScreen } from "../ChatScreen/ChatScreen";

export const SocketWrapper = () => {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);

  // console.log("isConnected: ", isConnected);

  // useEffect(() => {
  //   const onConnect = () => {
  //     socket.emit("join_room", "room1");
  //     socket.emit("send_message", {
  //       room: "room1",
  //       message: "Hello from React!"
  //     });
  //     setIsConnected(true);
  //   };
  //   const onDisconnect = () => setIsConnected(false);
  //   const onFooEvent = (value) =>
  //     setFooEvents((previous) => [...previous, value]);

  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);
  //   socket.on("foo", onFooEvent);

  //   onConnect();

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     socket.off("foo", onFooEvent);
  //   };
  // }, []);

  return (
    <>
      <ChatScreen />
    </>
  );
};
