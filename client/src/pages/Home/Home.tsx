import { Chat } from "../../components/Chat/Chat";
import { UsersList } from "../../components/UsersList/UsersList";

const Home = () => {
  return (
    <>
      <h1 className="text-center mt-4 text-white text-4xl tracking-wider font-bold text-white">
        ChatApp
      </h1>

      <div className="flex flex-1 mt-4 p-2">
        <UsersList />
        <Chat />
      </div>
    </>
  );
};

export default Home;
