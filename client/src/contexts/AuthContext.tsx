import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { User } from "../domains/users/types";
import { useQueryClient } from "@tanstack/react-query";
import { useQuerySession } from "../domains/session/actions";
import { sessionKeys } from "../domains/session/keys";

type AuthValue = {
  user: User | undefined;
  isLoadingUser: boolean;
  setUser: (user: User) => void;
};

const defaultNullishValue = {
  user: undefined,
  isLoadingUser: false,
  setUser: () => {}
};

const AuthContext = createContext<AuthValue>(defaultNullishValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: isLoadingUser } = useQuerySession();

  const queryClient = useQueryClient();

  const setUser = (user: User) => {
    queryClient.setQueryData(sessionKeys.key, user);
  };

  const authValue = useMemo(
    () => ({ user, isLoadingUser, setUser }),
    [user, isLoadingUser]
  );

  return <AuthContext value={authValue}>{children}</AuthContext>;
};

export const useAuth = () => useContext(AuthContext);
