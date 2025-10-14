import { LoadingSpinner } from "@react-lab-mono/ui";
import type { User } from "../../domains/users/types";
import { UserListItem } from "../UserListItem/UserListItem";

type UserListProps = {
  users: User[] | undefined;
  onLoading: boolean;
  error: Error | null;
};

export const UserList = ({ users, onLoading, error }: UserListProps) => {
  if (onLoading) return <LoadingSpinner color="var(--color-indigo-400)" />;

  if (users?.length === 0)
    return <p className="text-center mt-10 text-indigo-400">no one found!</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-indigo-400">Something went wrong!</p>
    );

  return (
    <ul
      role="list"
      className="flex flex-col items-center-2 overflow-y-scroll h-[66vh]"
    >
      {users?.map((user) => (
        <UserListItem user={user} key={user.id} />
      ))}
    </ul>
  );
};
