import { useMutation, useQuery } from "@tanstack/react-query";
import type { User } from "./types";
import { ROUTES } from "./api";
import { api } from "../../baseApi";
import type { GetUsersApiResponse } from "../../types/api";
import { usersKeys } from "./keys";

type GetUsersParams = {
  queryStr: string;
};

type SignInPayload = Pick<User, "email">;
type SignUpPayload = Pick<User, "firstName" | "lastName" | "email">;

const getUsers = async ({ queryStr }: GetUsersParams) => {
  const params = {
    ...(queryStr !== "" && { filterByName: queryStr })
  };

  const { data } = await api.get<GetUsersApiResponse<User>>(ROUTES.users, {
    params
  });
  return data.items;
};

const signIn = async (email: SignInPayload) => {
  const { data } = await api.post<User>(ROUTES.userSignin, email);
  return data;
};

const signUp = async (payload: SignUpPayload) => {
  const { data } = await api.post<User>(ROUTES.users, payload);
  return data;
};

const signOut = async () => {
  await api.post(ROUTES.userSignout);
};

export const useUsersQuery = (props: GetUsersParams) => {
  const query = useQuery({
    queryKey: usersKeys.detail(props.queryStr),
    queryFn: () => getUsers(props)
  });

  return {
    ...query,
    users: query.data
  };
};

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
