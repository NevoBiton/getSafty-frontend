import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Outlet />
      <NavBar />
    </>
  );
}

export default MainLayout;
