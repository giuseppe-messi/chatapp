import { create } from "zustand";

type useChatProps = {
  chatWithUserId: string | null;
  setChatWithUserId: (userId: string) => void;
};

export const useChat = create<useChatProps>((set, get) => ({
  chatWithUserId: null,
  connectedUsersIds: [],
  setChatWithUserId: (userId) => set({ chatWithUserId: userId })
}));
