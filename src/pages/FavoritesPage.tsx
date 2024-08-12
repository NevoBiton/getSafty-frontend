import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white text-gray-800 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-6 md:p-10 rounded-xl shadow-2xl border-t-8 border-orange-300 mx-4 overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-8 md:mb-12">
          Saved Safe Rooms
        </h2>
        <div className="mb-6 md:mb-8">
          {favRooms && favRooms.length > 1 ? (
            <Carousel className="overflow-hidden">
              <CarouselContent className="space-x-4">
                {favRooms.map((room, index) => (
                  <CarouselItem
                    key={room._id + "" + index}
                    className="mx-2 md:mx-4 border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                  >
                    <SmallShelter room={room} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-orange-500 hover:text-orange-700" />
              <CarouselNext className="text-orange-500 hover:text-orange-700" />
            </Carousel>
          ) : favRooms && favRooms.length === 1 ? (
            <div className="flex justify-center">
              <SmallShelter room={favRooms[0]} />
            </div>
          ) : (
            <p className="text-gray-600 text-center text-lg md:text-xl">
              You have no saved rooms yet. Explore and add some safe rooms to
              easily find them later.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;
