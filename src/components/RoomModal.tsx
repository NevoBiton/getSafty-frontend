import App from "@/App";
import { IAddress, IRoom, User } from "@/context/AuthContext";
import api from "@/services/api.services";
import axios from "axios";
import React, { useEffect, useState } from "react";
// Make sure to import the correct version of react-icons
import { FaTimes, FaWhatsapp, FaWheelchair } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: IRoom;
}

const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, room }) => {
  if (!isOpen) return null; // If the modal is not open, don't render anything
  const [owner, setOwner] = useState<User | null>(null);
  async function getOwner() {
    const { data } = await api.get(`/auth/${room.ownerId}`);
    console.log(data.user);
    setOwner(data.user);
  }
  useEffect(() => {
    getOwner();
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes /> {/* Use FaTimes for the close icon */}
        </button>
        <h2 className="text-2xl font-bold mb-4">{room.title}</h2>
        {room.image && room.image.length > 0 ? <img src={room.image[0]} /> : ""}
        <p className="text-gray-700 mb-4">{room.description}</p>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Address:</h4>
          <p>{`${room.address.street}, ${room.address.city}, ${room.address.number}`}</p>
          <p>{`Floor: ${room.address.floor || "1"}`}</p>
          <p>{`Apartment: ${room.address.appartment || "0"}`}</p>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">
            Capacity: {room.capacity || 0} people
          </h4>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold  flex align-middle items-center gap-3">
            Open: {room.available ? <IoMdCheckmark /> : <FaTimes />}{" "}
          </h4>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold flex align-middle items-center gap-3 ">
            <FaWheelchair />
            Accessibility: {room.accessible ? (
              <IoMdCheckmark />
            ) : (
              <FaTimes />
            )}{" "}
          </h4>
        </div>{" "}
        <div className="mt-4">
          <h4 className="text-lg font-semibold flex align-middle items-center gap-3 ">
            Public: {room.isPublic ? <IoMdCheckmark /> : <FaTimes />}{" "}
          </h4>
        </div>{" "}
        <div className="flex">
          <FaWhatsapp className="largeIcon cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
