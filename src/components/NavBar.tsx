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
      <div className="bg-blue-800 flex justify-between p-4 relative">
        <div className="w-28 sm:w-36 flex justify-between pl-3">
          <button
            onClick={() => setOpenDrawer(!openDrawer)}
            className="text-white hover:text-gray-300"
          >
            <GiHamburgerMenu size={32} />
          </button>
          <button className="text-white hovser:text-gray-300">
            <FaRegUser size={32} />
          </button>
        </div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 rounded-full border-4 border-black p-3 bg-white">
          <GrMapLocation
            onClick={() => navigate("/map")}
            size={50}
            className="text-blue-800"
          />
        </div>
        <div className="w-32 flex justify-between pl-3">
          <button className="text-white hover:text-gray-300">
            <FaRegBookmark size={32} />
          </button>
          <button>
            <img
              className="w-12 h-auto rounded-full "
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
