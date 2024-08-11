import React from "react";

function ColorMap() {
  return (
    <div className="absolute  bottom-12 left-2 bg-white p-4 rounded-lg shadow-md z-10">
      <h3 className="text-lg font-semibold mb-2">Map Legend</h3>
      <div className="flex items-center mb-2">
        <span className="w-4 h-4 bg-blue-500 rounded-full inline-block mr-2"></span>
        <span className="text-sm">Your Location</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="w-4 h-4 bg-orange-500 rounded-full inline-block mr-2"></span>
        <span className="text-sm">Public Shelter</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="w-4 h-4 bg-green-500 rounded-full inline-block mr-2"></span>
        <span className="text-sm">Private Shelter (Available)</span>
      </div>
      <div className="flex items-center">
        <span className="w-4 h-4 bg-gray-500 rounded-full inline-block mr-2"></span>
        <span className="text-sm">Shelter (Unavailable)</span>
      </div>
    </div>
  );
}

export default ColorMap;
