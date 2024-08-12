import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext"; // Adjust the path based on your project structure
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SmallShelter from "@/components/SmallShelter";

function FavoritesPage() {
  const authContext = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!authContext || !authContext.loggedInUser) {
      nav("/login");
    }
  }, [authContext, nav]);

  if (!authContext) {
    return (
      <div className="text-red-600 text-center">
        Error: AuthContext is not available.
      </div>
    );
  }

  const { loggedInUser, favRooms } = authContext;

  if (!loggedInUser) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="w-full h-[88dvh] p-6 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg border-t-8 border-orange-500">
        <h2 className="text-4xl font-bold mb-8 text-blue-800">My Favorites</h2>
        <div className="mb-8">
          <h3 className="text-3xl font-semibold mb-6 text-blue-800">
            Safe Rooms
          </h3>
          {favRooms && favRooms.length > 1 ? (
            <Carousel>
              <CarouselContent className="space-x-4">
                {favRooms.map((room, index) => (
                  <CarouselItem
                    key={room._id + "" + index}
                    className="transform hover:scale-105 transition-transform border border-gray-300 rounded-lg shadow-md overflow-hidden"
                  >
                    <SmallShelter room={room} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-orange-600 hover:text-orange-800" />
              <CarouselNext className="text-orange-600 hover:text-orange-800" />
            </Carousel>
          ) : favRooms && favRooms.length === 1 ? (
            <SmallShelter room={favRooms[0]} />
          ) : (
            <p className="text-gray-600">No favorite rooms available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;
