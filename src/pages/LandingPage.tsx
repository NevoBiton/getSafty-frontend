import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("RegisterPage must be used within an AuthProvider");
  }
  const { loggedInUser } = authContext;

  useEffect(() => {
    console.log(loggedInUser);

    if (loggedInUser !== null) {
      navigate("/map");
    }
  }, [loggedInUser]);

  return <div>LandingPage</div>;
}

export default LandingPage;
