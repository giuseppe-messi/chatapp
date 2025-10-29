import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

// export const socket = io(URL, {
//   autoConnect: false
// });

export const makeSocket = (userId: string) =>
  io(URL, {
    autoConnect: false,
    auth: { userId } // to be removed, get userId in server with session token logic
  });
