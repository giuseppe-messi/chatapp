import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { User } from "../domains/users/types";
import { useQuerySession } from "../domains/session/useQuerySession";
import { useQueryClient } from "@tanstack/react-query";
import { usersKeys } from "../domains/users/keys";

type AuthValue = {
  user: User | undefined;
  isLoadingUser: boolean;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: isLoadingUser } = useQuerySession();
  const queryClient = useQueryClient();

  const setUser = (user: User) => {
    queryClient.setQueryData(usersKeys.detail(user.id), user);
  };

  const authValue = useMemo(
    () => ({ user, isLoadingUser, setUser }),
    [user, isLoadingUser]
  );

  return <AuthContext value={authValue}>{children}</AuthContext>;
};

export const useAuth = () => useContext(AuthContext);
