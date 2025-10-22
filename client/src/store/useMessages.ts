import { create } from "zustand";

type UserDm = {
  userId: string;
  firstname: string;
  avatar: string;
  avatarBG: string;
};

export type Message = {
  id: string;
  room: string;
  from: UserDm;
  to: UserDm;
  text: string;
  createdAt: number;
};

type useMessagesProps = {
  messages: Record<string, Message[]>;
  setMessages: (msg: Message, room: string) => void;
};

export const useMessages = create<useMessagesProps>((set, get) => ({
  messages: {},
  setMessages: (msg, room) => {
    const messageSlice = room in get().messages ? get().messages[room] : [];

    set({
      messages: { ...get().messages, [room]: [...messageSlice, msg] }
    });
  }
}));
