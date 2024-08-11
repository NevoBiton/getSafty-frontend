import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEyeSlash, FaEye, FaEnvelope } from "react-icons/fa";
import { AuthContext, IUserLoginData } from "@/context/AuthContext";
import api from "@/services/api.services";

function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("RegisterPage must be used within an AuthProvider");
  }
  const { loggedInUser, login } = authContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser !== null) {
      navigate("/");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const userLoginData: IUserLoginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const { data } = await api.post("/auth/login", userLoginData);
      login(data.token);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-pink-100 px-[1em]">
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover z-0"
      >
        <source src={""} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm relative z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 text-gray-700 dark:text-white dark:bg-gray-800 focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaLock className="text-gray-400 mr-3" />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 text-gray-700 dark:text-white dark:bg-gray-800 focus:outline-none"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() =>
                  setShowPassword((prevShowPassword) => !prevShowPassword)
                }
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white py-2 rounded-full hover:from-pink-600 hover:to-pink-800 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-25 z-0"></div>
    </div>
  );
}

export default LoginPage;
