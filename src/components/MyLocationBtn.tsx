import React from "react";
import { FaLocationArrow } from "react-icons/fa6";

interface MyLocationBtnProps {
  centerMap: () => void; // Function to center the map
}

function MyLocationBtn({ centerMap }: MyLocationBtnProps) {
  return (
    <button
      onClick={centerMap}
      className="absolute bottom-12 right-2 z-10 p-2 bg-white border-none rounded shadow-lg cursor-pointer"
    >
      <FaLocationArrow size={20} className="text-blue-500" />
    </button>
  );
}

export default MyLocationBtn;
