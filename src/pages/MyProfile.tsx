import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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

  const initials = `${loggedInUser.firstName[0].toUpperCase()}${loggedInUser.lastName[0].toUpperCase()}`;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white text-gray-800 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-6 md:p-10 rounded-xl shadow-2xl border-t-8 border-orange-300 mx-4 overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 text-blue-800 text-center">
          My Profile
        </h2>
        <div className="flex flex-col md:flex-row items-center mb-8 md:mb-12">
          <Avatar className="w-28 h-28 md:w-32 md:h-32 rounded-full mb-4 md:mb-0 md:mr-8 shadow-lg border-4 border-orange-300">
            <AvatarImage
              src={loggedInUser.profilePic}
              alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
            />
            <AvatarFallback className="bg-orange-300 text-white font-bold text-2xl md:text-3xl uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <p className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">
              <span className="text-orange-600">Name:</span>{" "}
              {`${loggedInUser.firstName} ${loggedInUser.lastName}`}
            </p>
            <p className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">
              <span className="text-orange-600">Email:</span>{" "}
              {loggedInUser.email}
            </p>
            <p className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">
              <span className="text-orange-600">Phone:</span>{" "}
              {loggedInUser.phoneNumber}
            </p>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-blue-800 text-center">
            Safe Rooms
          </h3>
          {userRooms && userRooms.length > 1 ? (
            <Carousel className="overflow-hidden">
              <CarouselContent className="space-x-4">
                {userRooms.map((room) => (
                  <CarouselItem
                    key={room._id}
                    className="mx-2 md:mx-4 border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                  >
                    <SmallShelter room={room} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-orange-500 hover:text-orange-700" />
              <CarouselNext className="text-orange-500 hover:text-orange-700" />
            </Carousel>
          ) : userRooms && userRooms.length === 1 ? (
            <SmallShelter room={userRooms[0]} />
          ) : (
            <p className="text-gray-600 text-center text-lg md:text-xl">
              No safe rooms available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
