import { useState } from "react";
import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrMapLocation } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import DrawerComp from "./DrawerComp";

function NavBar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-blue-800 flex justify-between items-center p-4 fixed bottom-0 left-0 right-0 z-50 h-[10%]">
        <div className="flex justify-between w-1/3 sm:w-1/4">
          <button
            onClick={() => setOpenDrawer(!openDrawer)}
            className="text-white hover:text-gray-300"
          >
            <GiHamburgerMenu size={32} />
          </button>
          <button
            className="text-white hover:text-gray-300"
            onClick={() => navigate("/myProfile")}
          >
            <FaRegUser size={32} />
          </button>
        </div>

        <div
          className="flex justify-center items-center mt-10 w-20 h-20 bg-white p-2 rounded-full border-4 border-blue-800 cursor-pointer transform -translate-y-1/2 "
          onClick={() => navigate("/map")}
        >
          <GrMapLocation size={32} className="text-blue-800" />
        </div>

        <div className="flex justify-between w-1/3 sm:w-1/4">
          <button
            className="text-white hover:text-gray-300"
            onClick={() => navigate("favourites")}
          >
            <FaRegBookmark size={32} />
          </button>
          <button onClick={() => navigate("/instructions")}>
            <img
              className="w-10 h-auto rounded-full"
              src="../src/images/pikud-haOref-logo.png"
              alt="Pikud HaOref Logo"
            />
          </button>
        </div>
      </div>
      <DrawerComp openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </>
  );
}

export default NavBar;
