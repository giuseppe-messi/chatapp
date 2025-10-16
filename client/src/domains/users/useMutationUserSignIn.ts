import { useMutation } from "@tanstack/react-query";
import type { User } from "./types";
import { ROUTES } from "./api";
import { api } from "../../baseApi";

type PickEmail = Pick<User, "email">;

const signIn = async (email: PickEmail) => {
  const { data } = await api.post<User>(ROUTES.userSignin, email);
  return data;
};

export const useMutationUserSignIn = () =>
  useMutation({
    mutationFn: signIn
  });
