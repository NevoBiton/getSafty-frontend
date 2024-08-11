import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrMapLocation } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-blue-800 flex justify-between items-center p-4 relative">
        <div className="flex items-center gap-28 pl-14">
          <button className="text-white hover:text-gray-300">
            <GiHamburgerMenu size={40} />
          </button>
          <button className="text-white hover:text-gray-300">
            <FaRegUser size={40} />
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 rounded-full border-4 border-black p-3 bg-white">
          <GrMapLocation
            onClick={() => navigate("/map")}
            size={60}
            className="text-blue-800"
          />
        </div>
        <div className="flex items-center gap-28 pr-14">
          <button className="text-white hover:text-gray-300">
            <FaRegBookmark size={40} />
          </button>
          <button>
            <img
              className="w-16 h-auto rounded-full "
              src="../src/images/pikud-haOref-logo.png"
              alt="Pikud HaOref Logo"
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default NavBar;
