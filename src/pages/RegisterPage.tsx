import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    likes: [],
  });

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (loggedInUser !== null) {
      navigate("/");
    }
  }, [loggedInUser, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
      setCustomError(
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
      );
      return;
    }
    setCustomError(null);
    try {
      const response = await api.post("/auth/register", formData);
      if (response) {
        toast({
          title: "Registration successful",
          description: "Please log in to continue.",
          className: "bg-pink-300 text-black border-none",
        });
      } else {
        setCustomError("Failed to register. Please try again.");
        return;
      }
      setSuccess("Register successfully. Please log in.");
      navigate("/login");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
      setSuccess(null);
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
        <source src={rimonim} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm relative z-10 dark:bg-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">
          Register
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        {customError && <p className="text-red-500 mb-4">{customError}</p>}
        <form onSubmit={handleRegister} className="space-y-6" noValidate>
          <div className="flex items-center border-b border-gray-300 py-2 relative">
            <FaUser className="text-gray-400 mr-3" />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              className="w-full p-2 text-gray-700 dark:text-white dark:bg-gray-800 focus:outline-none"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaLock className="text-gray-400 mr-3 animate-bounce" />
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
          <div className="flex items-center border-b border-gray-300 py-2 relative">
            <FaIdBadge className="text-gray-400 mr-3" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              className="w-full p-2 text-gray-700 dark:text-white dark:bg-gray-800 focus:outline-none"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2 relative">
            <FaIdBadge className="text-gray-400 mr-3" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              className="w-full p-2 text-gray-700 dark:text-white dark:bg-gray-800 focus:outline-none"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2 relative">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 text-gray-700 dark:text-white dark:bg-gray-800 focus:outline-none"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white py-2 rounded-full hover:from-pink-600 hover:to-pink-800 transition duration-300 transform hover:scale-105"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-gray-600 dark:text-gray-200">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
