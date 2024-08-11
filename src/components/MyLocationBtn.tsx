import React from "react";
import { FaLocationArrow } from "react-icons/fa6";

interface MyLocationBtnProps {
  centerMap: () => void; // Function to center the map
}

function MyLocationBtn({ centerMap }: MyLocationBtnProps) {
  return (
    <button
      onClick={centerMap}
      style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        zIndex: 10,
        padding: "10px",
        background: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
      }}
    >
      <FaLocationArrow size={20} color="#007bff" />
    </button>
  );
}

export default MyLocationBtn;
