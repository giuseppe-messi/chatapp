import { useQuery } from "@tanstack/react-query";
import type { User } from "../users/types";
import { ROUTES } from "./api";
import { sessionKeys } from "./keys";
import { api } from "../../baseApi";

const getSession = async () => {
  const { data } = await api.get<User>(ROUTES.session);
  return data;
};

export const useQuerySession = () => {
  const query = useQuery({
    queryKey: sessionKeys.key,
    queryFn: getSession,
    retry: false
  });

  return {
    ...query,
    user: query.data
  };
};
