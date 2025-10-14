import type { User } from "../../domains/users/types";
import { useChat } from "../../store/useChat";
import clsx from "clsx";

type UserListItemProps = {
  user: User;
};

export const UserListItem = ({ user }: UserListItemProps) => {
  const { chattingWithUserId, setChattingWithUserId } = useChat();
  const isActive = chattingWithUserId === user.id;

  return (
    <li
      className={clsx(
        "border-b border-gray-300",
        isActive ? "bg-indigo-400" : "hover:bg-gray-50"
      )}
      onClick={() => setChattingWithUserId(user.id)}
    >
      <div className="flex items-center justify-around p-2">
        <div className="w-[45px]">
          <img
            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
            className="inline-block size-7 rounded-full ring-1 ring-gray-600 outline -outline-offset-1 outline-white/10"
          />
        </div>

        <div className="flex-1 justify-center text-center">
          <p
            className={clsx(
              "text-sm/6 font-semibold text-indigo-400",
              isActive && "text-white"
            )}
          >
            {user.firstName}
          </p>
        </div>
      </div>
    </li>
  );
};
