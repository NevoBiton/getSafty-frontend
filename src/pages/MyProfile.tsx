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

function MyProfile() {
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

  const { loggedInUser, userRooms } = authContext;

  if (!loggedInUser) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="w-full h-[88dvh] p-6 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-8 text-gray-900">My Profile</h2>
        <div className="flex items-center mb-8">
          <img
            src={loggedInUser.profilePic}
            alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
            className="w-28 h-28 rounded-full object-cover mr-8 shadow-md"
          />
          <div>
            <p className="text-xl font-medium text-gray-800 mb-2">
              <span className="font-semibold">Name:</span>{" "}
              {`${loggedInUser.firstName} ${loggedInUser.lastName}`}
            </p>
            <p className="text-xl font-medium text-gray-800 mb-2">
              <span className="font-semibold">Email:</span> {loggedInUser.email}
            </p>
            <p className="text-xl font-medium text-gray-800 mb-2">
              <span className="font-semibold">Phone:</span>{" "}
              {loggedInUser.phoneNumber}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-semibold mb-6 text-gray-900">
            Safe Rooms
          </h3>
          {userRooms && userRooms.length > 1 ? (
            <Carousel>
              <CarouselContent className="space-x-4">
                {userRooms.map((room) => (
                  <CarouselItem
                    key={room._id}
                    className="transform hover:scale-105 transition-transform"
                  >
                    <SmallShelter room={room} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-blue-600 hover:text-blue-800" />
              <CarouselNext className="text-blue-600 hover:text-blue-800" />
            </Carousel>
          ) : userRooms && userRooms.length === 1 ? (
            <SmallShelter room={userRooms[0]} />
          ) : (
            <p className="text-gray-600">No safe rooms available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
