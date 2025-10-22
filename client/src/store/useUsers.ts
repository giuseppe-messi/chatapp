import { create } from "zustand";

type useUsersProps = {
  peerId: string | null;
  onlineUsersIds: Set<string>;
  setPeerId: (peerId: string) => void;
  setOnlineUsersIds: (usersIds: string[]) => void;
};

export const useUsers = create<useUsersProps>((set) => ({
  peerId: null,
  onlineUsersIds: new Set(),
  setPeerId: (peerId) => set({ peerId }),
  setOnlineUsersIds: (usersIds) =>
    set({
      onlineUsersIds: new Set(usersIds)
    })
}));
