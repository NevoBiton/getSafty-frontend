import React, { useRef, useState, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "./ui/button";
import { Autocomplete } from "@react-google-maps/api";
import { AuthContext } from "@/context/AuthContext";
import api from "@/services/api.services"; // Import your custom api instance

interface AddRoomDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddRoomDialog: React.FC<AddRoomDialogProps> = ({ isOpen, onClose }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>("");

    const { loggedInUser } = useContext(AuthContext)!;


    const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            const address = place.formatted_address || "";
            setSelectedAddress(address);
        }
    };

    const geocodeAddress = async (address: string) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDas_FQg7La7_-kxRLy2cLNK0_sUkjIHTM`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch geocode data");
            }
            const data = await response.json();
            const location = data.results[0].geometry.location;
            console.log(location);
            return location;
        } catch (error) {
            console.error("Error geocoding address:", error);
            return null;
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(formRef.current!);

        // Use the selected address from autocomplete
        const fullAddress = selectedAddress;
        const location = await geocodeAddress(fullAddress);

        if (!location) {
            alert("Failed to geocode address. Please check the address and try again.");
            return;
        }

        // Append latitude and longitude to form data
        formData.append("lat", location.lat.toString());
        formData.append("lng", location.lng.toString());

        // Append ownerId from the loggedInUser
        if (loggedInUser) {
            console.log("connected");
            formData.append("ownerId", loggedInUser.userId!);
        } else {
            console.log("not connected");
            alert("You must be logged in to add a room.");
            return;
        }

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }


        try {
            await api.post("/room", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Room added successfully");
            onClose(); // Close the dialog after submission
        } catch (err) {
            console.error("Error adding room:", err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add Room</DialogTitle>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Room Title"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                            <input
                                type="text"
                                placeholder="Enter address"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={selectedAddress}
                                onChange={(e) => setSelectedAddress(e.target.value)}
                                required
                            />
                        </Autocomplete>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            placeholder="Capacity"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            Available
                            <input type="checkbox" name="available" defaultChecked className="ml-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            Accessible
                            <input type="checkbox" name="accessible" defaultChecked className="ml-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            Public
                            <input type="checkbox" name="isPublic" defaultChecked className="ml-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        </label>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end space-x-4">
                        <Button type="button" onClick={onClose} className="bg-gray-500 text-white hover:bg-gray-600">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddRoomDialog;


