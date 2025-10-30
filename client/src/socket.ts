import { io } from "socket.io-client";

const isProd = import.meta.env.PROD;

// "undefined" means the URL will be computed from the `window.location` object
const URL = isProd ? import.meta.env.VITE_API_URL : "http://localhost:3000";

export const makeSocket = (userId: string) =>
  io(URL, {
    autoConnect: false,
    transports: ["websocket"],
    auth: { userId } // TODO: be removed, get userId in server with session token logic
  });
