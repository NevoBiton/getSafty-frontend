import React, { useContext, useEffect, useState } from "react";
import {
  FaRegBookmark,
  FaTimes,
  FaWhatsapp,
  FaWheelchair,
} from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { IoMdCheckmark } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api.services";
import Loader from "@/components/ui/Loader"; // Adjust the path based on your file structure
import { AuthContext, IRoom, User } from "@/context/AuthContext"; // Adjust the path based on your file structure
import { FaPhoneFlip } from "react-icons/fa6";
import { Button } from "../ui/button";

function ShelterDetailsDrawer() {
  const { id } = useParams<{ id: string }>(); // Extract _id from the URL
  const [room, setRoom] = useState<IRoom>();
  const [favState, setFavState] = useState<boolean>(false);
  const [owner, setOwner] = useState<User | null>(null);
  const [formatedNumber, setFormatedNumber] = useState<string>("");
  const nav = useNavigate();
  const authContext = useContext(AuthContext);

  // Ensure the user is logged in
  useEffect(() => {
    if (!authContext || !authContext.loggedInUser) {
      nav("/login");
    }
  }, [authContext, nav]);

  if (!authContext) {
    return <div>Error: AuthContext is not available.</div>;
  }

  const { loggedInUser, favRooms = [], setFavRooms } = authContext;

  // Use useEffect to check favorite status when favRooms or id changes
  useEffect(() => {
    if (favRooms && id) {
      const isFavorite = favRooms.some((fav: IRoom) => fav._id === id);
      setFavState(isFavorite);
    }
  }, [favRooms, id]);

  async function getOwnerAndRoom() {
    try {
      const { data } = await api.get(`/room/${id}`);
      setRoom(data.room);

      if (loggedInUser) {
        if (loggedInUser.phoneNumber.startsWith("0")) {
          setFormatedNumber("972" + loggedInUser.phoneNumber.slice(1));
        } else {
          setFormatedNumber(loggedInUser.phoneNumber);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getOwnerAndRoom();
  }, []);

  if (!room) {
    return <Loader />;
  }

  const handleWhatsAppClick = () => {
    if (formatedNumber !== "") {
      window.open(`https://wa.me/${formatedNumber}`, "_blank");
    }
  };

  const handlePhoneClick = () => {
    if (formatedNumber !== "") {
      window.open(`tel:${formatedNumber}`, "_blank");
    }
  };

  async function toggleFav() {
    if (!loggedInUser) return;

    try {
      const { data } = await api.patch(`/room/favorite/${id}`);

      // Update the favorites array in the context
      let updatedFavorites: any;
      if (favRooms) {
        if (data.state) {
          updatedFavorites = [...favRooms, room];
        } else {
          updatedFavorites = favRooms.filter((fav: IRoom) => fav._id !== id);
        }
      } else if (data.this.state) {
        updatedFavorites = [room];
      } else {
        updatedFavorites = [];
      }

      // Set the updated favorites array in the context
      setFavRooms(updatedFavorites);

      // Update the favState based on the updated favorites array
      setFavState(data.state);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Drawer open={true} onOpenChange={() => nav(-1)}>
        <DrawerContent className="overflow-scroll h-[55%] w-full mx-auto px-4  rounded-t-lg bg-white shadow-lg transition-all duration-300 ease-in-out fixed bottom-0">
          <DrawerHeader className="flex justify-between items-center py-2 border-b border-gray-200">
            <DrawerTitle className="text-xl font-semibold text-gray-900">
              {room.title.charAt(0).toUpperCase() + room.title.slice(1)}
            </DrawerTitle>
            <DrawerClose>
              <Button onClick={() => nav(-1)} variant="outline" size="sm">
                Close
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <DrawerDescription className="py-2">
            {room.image && room.image.length > 0 ? (
              <img
                src={room.image[0]}
                alt={room.title}
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-full h-32 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}

            <p className="text-gray-700 text-sm my-2">{room.description}</p>

            <div className="flex justify-between">
              <div>
                <h4 className="text-sm font-semibold">Address:</h4>
                <p className="text-sm">{`${room.address.street}, ${room.address.city}`}</p>
                <p className="text-sm">{`Floor: ${
                  room.address.floor || "1"
                }`}</p>
                <p className="text-sm">{`Apartment: ${
                  room.address.appartment || "0"
                }`}</p>
              </div>
              <div className="text-right">
                <h4 className="text-sm font-semibold">Capacity:</h4>
                <p className="text-sm">{`${room.capacity || 0} people`}</p>
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1">
                <h4 className="text-sm font-semibold">Open:</h4>
                {room.available ? (
                  <IoMdCheckmark className="text-green-600 text-lg" />
                ) : (
                  <FaTimes className="text-red-600 text-lg" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <h4 className="text-sm font-semibold">Public:</h4>
                {room.isPublic ? (
                  <IoMdCheckmark className="text-green-600 text-lg" />
                ) : (
                  <FaTimes className="text-red-600 text-lg" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-5">
              <div className="flex gap-5">
                <FaWhatsapp
                  className="largeIcon text-green-500 text-2xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={handleWhatsAppClick}
                />
                <FaPhoneFlip
                  className="largeIcon text-green-800 text-2xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={handlePhoneClick}
                />
              </div>
              <div className="text-2xl">
                <FaRegBookmark
                  onClick={toggleFav}
                  className={`cursor-pointer transition-colors ${
                    favState
                      ? "text-orange-600"
                      : "text-black hover:text-gray-600"
                  }`}
                />
              </div>
            </div>
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ShelterDetailsDrawer;
