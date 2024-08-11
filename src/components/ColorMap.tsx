import React, { useState } from "react";

function ColorMap() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={` absolute bottom-10 left-9 bg-white rounded-lg shadow-md z-10 transition-all duration-300 ${
        isOpen ? "w-48" : "w-10"
      }`}
    >
      <button
        onClick={toggleAccordion}
        className={`w-full text-left p-2 bg-blue-500 text-white rounded-t-lg focus:outline-none transition-all duration-300 ${
          isOpen ? "p-4" : "p-2"
        }`}
      >
        <h3 className={`text-lg font-semibold text-center`}>
          {isOpen ? "Map Legend" : "^"}
        </h3>
        {!isOpen && (
          <div className="flex justify-center">
            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
          </div>
        )}
      </button>
      {isOpen && (
        <div className="p-4 space-y-2">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-blue-500 rounded-full inline-block mr-2"></span>
            <span className="text-sm">Your Location</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-orange-500 rounded-full inline-block mr-2"></span>
            <span className="text-sm">Public Shelter</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full inline-block mr-2"></span>
            <span className="text-sm">Private Shelter</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-gray-500 rounded-full inline-block mr-2"></span>
            <span className="text-sm">Shelter (Unavailable)</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorMap;
