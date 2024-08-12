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
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 text-white p-6 sm:p-8 lg:p-12">
      {/* Background Shapes */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[200vw] h-[200vw] rounded-full bg-gradient-to-r from-blue-300 to-blue-600 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[150vw] h-[150vw] bg-gradient-to-r from-blue-600 to-blue-800 rounded-full opacity-20"></div>
      </div>

      <header className="relative z-10 text-center mt-16 sm:mt-20 lg:mt-24">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold drop-shadow-lg">
          Welcome to GetSafety
        </h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl mt-4 font-light drop-shadow-md">
          Your Trusted Platform for Finding Safe Shelters Nearby
        </h2>
      </header>

      <main className="relative z-10 flex flex-col items-center text-center mt-12">
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-10 sm:mb-12 lg:mb-16 leading-relaxed drop-shadow-md max-w-3xl">
          Discover nearby public bomb shelters and join safeRooms provided by
          local owners during alerts. Stay safe and prepared with GetSafety,
          your go-to solution in times of need.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl sm:text-2xl font-semibold rounded-full shadow-lg hover:shadow-2xl transition transform hover:scale-105"
        >
          Get Started
        </button>
      </main>

      <footer className="relative z-10 text-center text-gray-300 text-sm mt-16 sm:mt-20 lg:mt-24">
        © {new Date().getFullYear()} GetSafety. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
