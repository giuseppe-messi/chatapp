import { useNavigate } from "react-router-dom";
import { useUserSignOutMutation } from "../../domains/users/actions";
import { APP_ROUTES } from "../../App";
import { useSocket } from "../../hooks/useSocket";
import { Header } from "../../components/Header/Header";
import { UsersList } from "../../components/UsersList/UsersList";
import { ChatScreen } from "../../components/ChatScreen/ChatScreen";

const Home = () => {
  const { user, peerId, isOnline, messageSlice, sendMessage } = useSocket();
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
      <Header
        userName={user?.firstName ?? ""}
        onSignOut={handleSignout}
        isOnline={isOnline}
      />
      <div className="flex flex-1 mt-4 p-2">
        <UsersList />
        <main className="flex-1 flex flex-col justify-between bg-white p-4 rounded-sm rounded-tl-none rounded-bl-none">
          {peerId ? (
            <ChatScreen messages={messageSlice} onSend={sendMessage} />
          ) : (
            <p className="text-center mt-10">Select someone to chat with!</p>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
