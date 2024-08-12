import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEyeSlash, FaEye, FaEnvelope } from "react-icons/fa";
import { AuthContext, IUserLoginData } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api.services";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { toast } = useToast();

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("LoginPage must be used within an AuthProvider");
  }
  const { loggedInUser, login } = authContext;

  useEffect(() => {
    if (loggedInUser !== null) {
      navigate("/map");
    }
  }, [loggedInUser]);

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
      navigate("/map");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        className: "bg-red-500 text-white border-none",
        duration: 3000,
      });
      console.log(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 text-white px-4 sm:px-6 lg:px-8">
      {/* Background Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-300 to-blue-600 opacity-20 z-0"></div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm relative z-10 transform transition-transform hover:scale-105">
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          Login to GetSafety
        </h2>
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
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-gray-600 dark:text-gray-300 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
