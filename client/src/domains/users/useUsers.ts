import { useQuery } from "@tanstack/react-query";
import type { User } from "./types";
import { api, ROUTES } from "./api";
import type { ApiResponse } from "../../types/api";
import { usersKeys } from "./keys";

const fetchUsers = async ({ queryStr }: Props) => {
  const params = {
    ...(queryStr !== "" && { filterByName: queryStr })
  };

  const { data } = await api.get<ApiResponse<User>>(ROUTES.users, {
    params
  });
  return data.items;
};

type Props = {
  queryStr: string;
};

export const useUsers = (props: Props) => {
  const query = useQuery({
    queryKey: usersKeys.detail(props.queryStr),
    queryFn: () => fetchUsers(props)
  });

  return {
    ...query,
    users: query.data
  };
};
