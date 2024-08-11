import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("LandingPage must be used within an AuthProvider");
  }
  const { loggedInUser } = authContext;

  useEffect(() => {
    if (loggedInUser !== null) {
      navigate("/map");
    }
  }, [loggedInUser, navigate]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="text-center mt-8 sm:mt-12">
        <img
          src="/path/to/logo.png"
          alt="App Logo"
          className="w-24 h-24 sm:w-32 sm:h-32 mx-auto"
        />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mt-4">
          Welcome to SafeMap
        </h1>
      </header>
      <main className="text-center">
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
          Discover the nearest bomb shelters in your area with ease. Stay safe
          and prepared in any situation.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-2 sm:px-8 sm:py-3 bg-orange-500 text-white mb-8 sm:mb-12 text-base sm:text-lg font-semibold rounded-md hover:bg-orange-600 transition"
        >
          Get Started
        </button>
      </main>
    </div>
  );
}

export default LandingPage;
