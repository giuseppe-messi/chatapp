import { create } from "zustand";

type useChatProps = {
  chattingWithUserId: string | null;
  setChattingWithUserId: (userId: string) => void;
};

export const useChat = create<useChatProps>((set) => ({
  chattingWithUserId: null,
  setChattingWithUserId: (userId) => set({ chattingWithUserId: userId })
}));
