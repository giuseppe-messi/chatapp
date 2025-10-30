import { api } from "../../baseApi";
import { ROUTES } from "./api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usersKeys } from "./keys";
import type { User } from "./types";
import type { GetUsersApiResponse } from "../../types/api";

type GetUsersParams = {
  queryStr: string;
};

type SignInPayload = Pick<User, "email" | "password">;
type SignUpPayload = Pick<
  User,
  "firstName" | "lastName" | "email" | "password"
>;

const getUsers = async ({ queryStr }: GetUsersParams) => {
  const params = {
    ...(queryStr !== "" && { filterByName: queryStr })
  };

  const { data } = await api.get<GetUsersApiResponse<User>>(ROUTES.users, {
    params
  });
  return data.items;
};

const signIn = async (payload: SignInPayload) => {
  const { data } = await api.post<User>(ROUTES.userSignin, payload);
  return data;
};

const signUp = async (payload: SignUpPayload) => {
  const { data } = await api.post<User>(ROUTES.users, payload);
  return data;
};

const signOut = async () => {
  await api.post(ROUTES.userSignout);
};

export const useUsersQuery = ({ queryStr }: GetUsersParams) =>
  useQuery({
    queryKey: usersKeys.detail(queryStr),
    queryFn: () => getUsers({ queryStr })
  });

export const useUserSignInMutation = () =>
  useMutation({
    mutationFn: signIn
  });

export const useUserSignUpMutation = () =>
  useMutation({
    mutationFn: signUp
  });

export const useUserSignOutMutation = () =>
  useMutation({
    mutationFn: signOut
  });
