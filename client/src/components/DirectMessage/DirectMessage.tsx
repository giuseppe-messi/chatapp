import clsx from "clsx";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar } from "../Avatar/Avatar";
import type { Message } from "../../store/useMessages";

type MessageProps = {
  message: Message;
};

export const DirectMessage = ({ message }: MessageProps) => {
  const { user } = useAuth();
  const isOwnMessage = user?.id === message.from.userId;

  return (
    <div
      key={message._id}
      className={clsx(
        "border border-[#00000036] p-[10px] rounded-[3px] bg-[#dcdcdca3] gap-4",
        isOwnMessage && "flex flex-col items-end"
      )}
    >
      <Avatar
        background={message.from.avatarBG}
        letter={message.from.avatar}
        size="sm"
      />

      <p>{message.text}</p>
    </div>
  );
};
