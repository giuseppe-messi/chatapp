// import { ChatScreen } from "../../components/ChatScreen/ChatScreen";
import { Link, useNavigate } from "react-router-dom";
import { SocketWrapper } from "../../components/SocketWrapper/SocketWrapper";
import { UsersList } from "../../components/UsersList/UsersList";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { ROUTES } from "../../domains/users/api";
import axios from "axios";

const Home = () => {
  const user = useAuth()?.user;
  const navigate = useNavigate();

  console.log("user: ", user);

  // const mutation = useMutation({
  //   mutationFn: async () => {
  //     await axios.post(ROUTES.userSignout);
  //   }
  // });

  const handleSignout = async () => {
    await axios.post("/api" + ROUTES.userSignout);
    navigate("/signin");
  };

  return (
    <>
      <header className="flex flex-col relative">
        <Link
          to="#"
          className="self-end bg-white p-[4px] w-[90px] text-center rounded-[4px] hover:bg-gray-300 absolute top-[11px] right-[11px] text-sm"
          onClick={handleSignout}
        >
          Sign out
        </Link>
        <h1 className="text-center mt-4 text-white text-4xl tracking-wider font-bold text-white">
          ChatApp {user?.firstName}
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
