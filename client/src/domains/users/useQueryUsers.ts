import { useQuery } from "@tanstack/react-query";
import type { User } from "./types";
import { ROUTES } from "./api";
import type { GetUsersApiResponse } from "../../types/api";
import { usersKeys } from "./keys";
import { api } from "../../baseApi";

const fetchUsers = async ({ queryStr }: Props) => {
  const params = {
    ...(queryStr !== "" && { filterByName: queryStr })
  };

  const { data } = await api.get<GetUsersApiResponse<User>>(ROUTES.users, {
    params
  });
  return data.items;
};

type Props = {
  queryStr: string;
};

export const useQueryUsers = (props: Props) => {
  const query = useQuery({
    queryKey: usersKeys.detail(props.queryStr),
    queryFn: () => fetchUsers(props)
  });

  return {
    ...query,
    users: query.data
  };
};
