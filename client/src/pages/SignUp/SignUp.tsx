import axios from "axios";
import { APP_ROUTES } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useRef } from "react";
import { useToastersStore } from "@react-lab-mono/ui";
import { useUserSignUpMutation } from "../../domains/users/actions";

export const SignUp = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const mutation = useUserSignUpMutation();
  const { enQueueToast } = useToastersStore();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    const formData = {
      firstName: String(fd.get("firstName")),
      lastName: String(fd.get("lastName")),
      email: String(fd.get("email")),
      password: String(fd.get("password"))
    };

    mutation.mutate(formData, {
      onSuccess: (data) => {
        enQueueToast("sucess", "Successfully registered!");
        setUser(data);
        navigate(APP_ROUTES.home);
      },
      onError: (err) => {
        let errorMessage = "Registration failed!";

        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message ?? errorMessage;
        }
        enQueueToast("error", errorMessage);
      }
    });
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-[#ffe571] p-3 text-xs text-center">
          <p>
            This is a small personal project. I’m applying security best
            practices where possible, but just in case:
          </p>
          <br />
          <strong>
            <h3>Do not use a password you use anywhere else !!!</h3>
          </strong>
        </div>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          method="POST"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm/6 font-medium text-gray-100"
            >
              First Name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                type="firstName"
                name="firstName"
                required
                autoComplete="firstName"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                type="lastName"
                name="lastName"
                required
                autoComplete="lastName"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                minLength={8}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Already registered?{" "}
          <Link
            to="/signin"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Log in here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
