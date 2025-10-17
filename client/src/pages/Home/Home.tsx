import { Link, useNavigate } from "react-router-dom";
import { SocketWrapper } from "../../components/SocketWrapper/SocketWrapper";
import { UsersList } from "../../components/UsersList/UsersList";
import { useAuth } from "../../contexts/AuthContext";
import { useUserSignOutMutation } from "../../domains/users/actions";
import { APP_ROUTES } from "../../App";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const mutation = useUserSignOutMutation();

  const handleSignout = async () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        navigate(APP_ROUTES.signin);
      }
    });
  };

  return (
    <>
      <header className="flex flex-col relative">
        <div className="absolute top-[11px] right-[11px] text-end">
          <Link
            to="#"
            className="self-end bg-white p-[4px] w-[90px] text-center rounded-[4px] hover:bg-gray-300 text-sm"
            onClick={handleSignout}
          >
            Sign out
          </Link>
          <p className="text-white text-sm mt-1">Hi, {user?.firstName}</p>
        </div>
        <h1 className="text-center mt-4 text-white text-4xl tracking-wider font-bold text-white">
          ChatApp
        </h1>
      </header>

      <div className="flex flex-1 mt-4 p-2">
        <UsersList />
        <SocketWrapper />
      </div>
    </>
  );
};

export default Home;
