import type { User } from "../../domains/users/types";
import clsx from "clsx";
import { Avatar } from "../Avatar/Avatar";
import { StatusCircle } from "../StatusCircle/StatusCircle";
import { useUsers } from "../../store/useUsers";

type UserListItemProps = {
  user: User;
};

export const UserListItem = ({ user }: UserListItemProps) => {
  const { onlineUsersIds, peerId, setPeerId } = useUsers();
  const isOnline = onlineUsersIds.has(user.id);
  const isActive = peerId === user.id;

  return (
    <li
      className={clsx(
        "group border-b border-gray-300",
        isActive ? "bg-indigo-400" : "hover:bg-gray-200"
      )}
      onClick={() => setPeerId(user.id)}
    >
      <div className="flex items-center justify-around p-2">
        <div className="flex">
          <Avatar background={user.avatarBG} letter={user.avatar} />
          <StatusCircle isActive={isOnline} />
        </div>

        <div className="flex-1 justify-center text-center">
          <p
            className={clsx(
              "text-sm/6 font-semibold text-indigo-400",
              isActive ? "text-white" : "group-hover:text-indigo-700"
            )}
          >
            {user.firstName}
          </p>
        </div>
      </div>
    </li>
  );
};
