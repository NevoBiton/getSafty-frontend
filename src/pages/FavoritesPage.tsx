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
    return <div>Error: AuthContext is not available.</div>;
  }

  const { loggedInUser, favRooms, setFavRooms } = authContext;

  if (!loggedInUser) {
    return null; // Redirect handled in useEffect
  }
  console.log(favRooms);

  return (
    <div className="w-[100dvw] h-[88dvh] p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          My Favorites
        </h2>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Safe Rooms
          </h3>
          {favRooms && favRooms.length > 1 ? (
            <Carousel>
              <CarouselContent>
                {favRooms.map((room, index) => (
                  <CarouselItem key={room._id + "" + index}>
                    <SmallShelter room={room} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : favRooms && favRooms.length == 1 ? (
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
