import { Filter } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Location {
  lat: number;
  lng: number;
}

interface FilterBtnProps {
  loc: Location;
}

function FilterBtn({ loc }: FilterBtnProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [open, setOpen] = useState(false);
  const [radius, setRadius] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  function handleFilterClick() {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Prepare the search params with the form values and location
    const newSearchParams = new URLSearchParams(searchParams);

    if (wheelchairAccessible) {
      newSearchParams.set("accessible", "true");
    } else {
      newSearchParams.delete("accessible");
    }

    if (open) {
      newSearchParams.set("open", "true");
    } else {
      newSearchParams.delete("open");
    }

    if (radius) {
      newSearchParams.set("radius", radius);
    } else {
      newSearchParams.delete("radius");
    }

    if (isPublic) {
      newSearchParams.set("isPublic", "true");
    } else {
      newSearchParams.delete("isPublic");
    }

    // Debug: Check the loc object
    console.log("Location object received:", loc);

    // Use the provided loc object to set lat and lng
    if (loc?.lat && loc?.lng) {
      newSearchParams.set("lat", loc.lat.toString());
      newSearchParams.set("lng", loc.lng.toString());
    } else {
      console.warn("Location data is missing or invalid.");
    }

    // Debug: Check the searchParams before setting
    console.log("New search params to be set:", newSearchParams.toString());

    // Apply all search params at once
    setSearchParams(newSearchParams);

    // Close the filter form after submission
    setIsOpen(false);
  }

  function handleReset() {
    // Reset the form state
    setWheelchairAccessible(false);
    setOpen(false);
    setRadius("");
    setIsPublic(false);

    // Clear all search params
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);

    // Optionally close the filter form
    setIsOpen(false);
  }

  return (
    <div className="relative z-10">
      <div
        className={`absolute top-10 left-9 text-white bg-blue-500 rounded-lg shadow-md transition-all duration-300 flex items-center p-2 cursor-pointer`}
        onClick={handleFilterClick}
      >
        <Filter /> {/* lucide-react Filter icon */}
      </div>

      {isOpen && (
        <div
          className="absolute top-20 left-9 bg-white rounded-lg shadow-lg p-4 transition-all duration-300"
          style={{ width: "300px" }} // Adjust the width as needed
        >
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="accessible"
                name="Accessible"
                checked={wheelchairAccessible}
                onChange={(e) => setWheelchairAccessible(e.target.checked)}
                className="m-2"
              />
              <label htmlFor="accessible">Wheelchair Accessible</label>
            </div>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="open"
                name="open"
                checked={open}
                onChange={(e) => setOpen(e.target.checked)}
                className="m-2"
              />
              <label htmlFor="open">Open</label>
            </div>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="public"
                name="public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="m-2"
              />
              <label htmlFor="public">Public</label>
            </div>

            <div className="mb-4">
              <input
                type="number"
                id="radius"
                name="Radius"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="Radius (km)"
                className="w-full m-2 border-2 border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 mr-2"
              >
                Apply Filter
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Reset Filter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default FilterBtn;
