import { FaLocationArrow } from "react-icons/fa6";

interface MyLocationBtnProps {
  goToMyLocation: () => void; // Function to center the map
}

function MyLocationBtn({ goToMyLocation }: MyLocationBtnProps) {
  return (
    <button
      onClick={() => goToMyLocation()}
      className="absolute bottom-20 right-10 z-10 p-2 bg-white border-none rounded shadow-lg cursor-pointer"
    >
      <FaLocationArrow size={20} className="text-blue-500" />
    </button>
  );
}

export default MyLocationBtn;
