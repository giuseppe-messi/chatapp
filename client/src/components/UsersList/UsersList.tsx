import { Search } from "../Search/Search";
import { useQueryUsers } from "../../domains/users/useQueryUsers";
import { useState } from "react";
import { useDebouncedValue } from "../../helpers/useDebouncedValue";
import { UserList } from "../UserList/UserList";

export const UsersList = () => {
  const [query, setQuery] = useState("");
  const handleQuery = (query: string) => setQuery(query);

  const { error, users, isFetching } = useQueryUsers({
    queryStr: useDebouncedValue(query)
  });

  return (
    <aside className="w-1/4 max-w-xs bg-white border-r border-gray-900 rounded-sm rounded-tr-none rounded-br-none cursor-pointer">
      <h3 className="text-center text-2xl font-bold text-indigo-400 p-4">
        Users
      </h3>

      <Search query={query} onQuery={handleQuery} />
      <UserList users={users} onLoading={isFetching} error={error} />
    </aside>
  );
};
