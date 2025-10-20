import type { User } from "../../domains/users/types";
import { useChat } from "../../store/useChat";
import clsx from "clsx";
import { Avatar } from "../Avatar/Avatar";

type UserListItemProps = {
  user: User;
};

export const UserListItem = ({ user }: UserListItemProps) => {
  const { chatWithUserId, setChatWithUserId } = useChat();

  const isActive = chatWithUserId === user.id;

  return (
    <li
      className={clsx(
        "group border-b border-gray-300",
        isActive ? "bg-indigo-400" : "hover:bg-gray-200"
      )}
      onClick={() => setChatWithUserId(user.id)}
    >
      <div className="flex items-center justify-around p-2">
        <div className="flex">
          <Avatar background={user.avatarBG} letter={user.avatar} />

          <div
            className={clsx(
              "w-2 h-2 rounded-full",
              true ? "bg-green-600" : "bg-gray-400"
            )}
          />
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
