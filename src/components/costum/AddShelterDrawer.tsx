import React, { useRef, useState, useContext } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Autocomplete } from "@react-google-maps/api";
import { AuthContext, IRoom } from "@/context/AuthContext";
import api from "@/services/api.services"; // Import your custom api instance

interface AddRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddShelterDrawer({ isOpen, onClose }: AddRoomDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [addressComponents, setAddressComponents] = useState({
    city: "",
    street: "",
    number: "",
  });

  const { loggedInUser, setUserRooms } = useContext(AuthContext)!;

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const components = place.address_components || [];

      let street = "";
      let number = "";
      let city = "";

      components.forEach((component) => {
        if (component.types.includes("route")) {
          street = component.long_name;
        } else if (component.types.includes("street_number")) {
          number = component.long_name;
        } else if (component.types.includes("locality")) {
          city = component.long_name;
        }
      });

      setAddressComponents({ city, street, number });
    }
  };

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyDas_FQg7La7_-kxRLy2cLNK0_sUkjIHTM`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch geocode data");
      }
      const data = await response.json();
      const location = data.results[0].geometry.location;
      return location;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    console.log("start");

    event.preventDefault();

    const formData = new FormData(formRef.current!);

    if (!addressComponents.street || !addressComponents.number) {
      alert("Please provide a valid address with both street and number.");
      return;
    }

    const fullAddress = `${addressComponents.street} ${addressComponents.number}, ${addressComponents.city}`;
    const location = await geocodeAddress(fullAddress);

    if (!location) {
      alert(
        "Failed to geocode address. Please check the address and try again."
      );
      return;
    }

    const roomData = {
      title: formData.get("title") as string,
      address: {
        city: addressComponents.city,
        street: addressComponents.street,
        number: addressComponents.number,
        floor: formData.get("floor") as string,
        apartment: formData.get("apartment") as string,
      },
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      // images: formData.getAll("image") as string[], // assuming you handle file upload separately
      capacity: parseInt(formData.get("capacity") as string, 10),
      description: formData.get("description") as string,
      available: formData.get("available") === "on",
      accessible: formData.get("accessible") === "on",
      isPublic: formData.get("isPublic") === "on",
      ownerId: loggedInUser ? loggedInUser._id : null,
    };

    try {
      const { data: newRoom } = await api.post("/room", roomData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Room added successfully");
      setUserRooms((prevUserRooms: IRoom[]): IRoom[] => [
        ...prevUserRooms,
        newRoom,
      ]);
      onClose(); // Close the dialog after submission
    } catch (err) {
      console.error("Error adding room:", err);
      alert("Failed to add room. Please try again.");
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="overflow-scroll mx-auto px-6 rounded-lg bg-white shadow-lg">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-semibold text-gray-900">
              Add Shelter
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shelter Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Room Title"
                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                  type="text"
                  placeholder="Enter address"
                  className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </Autocomplete>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Floor
                </label>
                <input
                  type="text"
                  name="floor"
                  placeholder="Floor"
                  className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Apartment
                </label>
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment"
                  className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Description"
                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Available
                <input
                  type="checkbox"
                  name="available"
                  defaultChecked
                  className="p-1 ml-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center text-sm font-medium text-gray-700">
                Accessible
                <input
                  type="checkbox"
                  name="accessible"
                  defaultChecked
                  className="p-1 ml-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
              <label className="flex items-center text-sm font-medium text-gray-700">
                Public
                <input
                  type="checkbox"
                  name="isPublic"
                  defaultChecked
                  className="p-1 ml-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </DrawerDescription>

          <DrawerFooter className="flex justify-end space-x-4 pt-4 border-t mt-4">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </Button>
            <DrawerClose>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

export default AddShelterDrawer;
