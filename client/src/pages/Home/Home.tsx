import { Link, useNavigate } from "react-router-dom";
import { SocketWrapper } from "../../components/SocketWrapper/SocketWrapper";
// import { UsersList } from "../../components/UsersList/UsersList";
import { useAuth } from "../../contexts/AuthContext";
import { useUserSignOutMutation } from "../../domains/users/actions";
import { APP_ROUTES } from "../../App";
// import { useChat } from "../../store/useChat";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const mutation = useUserSignOutMutation();
  // const { chatWithUserId } = useChat();

  // console.log("🚀 ~ chatWithUserId:", chatWithUserId);

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

      <SocketWrapper />

      {/* <div className="flex flex-1 mt-4 p-2">
        <UsersList />
        <main className="flex-1 flex flex-col justify-between bg-white p-4 rounded-sm rounded-tl-none rounded-bl-none">
          {chatWithUserId ? (
            <SocketWrapper currentUser={user} chatWithUserId={chatWithUserId} />
          ) : (
            <p>Select someone to chat with!</p>
          )}
        </main>
      </div> */}
    </>
  );
};

export default Home;
