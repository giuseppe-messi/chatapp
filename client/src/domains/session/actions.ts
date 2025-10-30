import { api } from "../../baseApi";
import { ROUTES } from "./api";
import { sessionKeys } from "./keys";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../users/types";

const getSession = async () => {
  const { data } = await api.get<User>(ROUTES.session);
  return data;
};

export const useQuerySession = () =>
  useQuery({
    queryKey: sessionKeys.key,
    queryFn: getSession,
    retry: false
  });
