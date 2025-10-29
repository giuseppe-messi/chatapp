import { Link } from "react-router-dom";
import { StatusCircle } from "../StatusCircle/StatusCircle";

type HeaderProps = {
  userName: string;
  isOnline: boolean;
  onSignOut: () => void;
};

export const Header = ({ userName, isOnline, onSignOut }: HeaderProps) => (
  <header className="flex flex-col relative">
    <div className="absolute top-[11px] right-[11px] text-end">
      <Link
        to="#"
        className="self-end bg-white p-[4px] w-[90px] text-center rounded-[4px] hover:bg-gray-300 text-sm"
        onClick={onSignOut}
      >
        Sign out
      </Link>
      <p className="text-white text-sm mt-1 flex mt-3">
        Hi, {userName}
        <StatusCircle isActive={isOnline} />
      </p>
    </div>
    <h1 className="text-center mt-4 text-white text-4xl tracking-wider font-bold text-white">
      ChatApp
    </h1>
  </header>
);
