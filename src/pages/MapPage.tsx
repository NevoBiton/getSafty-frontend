import { useEffect, useState, useCallback, useContext, useRef } from "react";
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import MyLocationBtn from "../components/MyLocationBtn";
import AddRoomDialog from "@/components/AddRoomDialog";
import { AuthContext, IRoom } from "@/context/AuthContext";
import ColorMap from "@/components/ColorMap";
import FilterBtn from "@/components/FilterBtn";

import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api.services";
import Loader from "@/components/ui/Loader";
import CountDown from "@/components/CountDown";

interface Location {
  lat: number;
  lng: number;
}

const libraries: "places"[] = ["places"];
const containerStyle = {
  width: "100vw",
  height: "85vh",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  clickableIcons: false, // Disable clicking on places other than the bomb shelters
};

const pinIcons = {
  blue: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  red: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  orange: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  green: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
};

function MapPage() {
  const { loggedInUser } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
    }
  }, []);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDwY1nKLe_qB7XyA6_8uBsBkOG_uNdtxgg", // Use environment variable for API key
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [currentLocation, setCurrentLocaton] = useState<Location | null>(null);
  const [shelters, setShelters] = useState<IRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null); // State to manage selected room
  const [roomModalOpen, setRoomModalOpen] = useState(false); // State to manage RoomModal visibility
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams(); // Get and set search params
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null); // Ref for the autocomplete input
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the search input

  const nav = useNavigate();
  // Function to fetch shelters based on location and search parameters
  const getShelters = useCallback(
    async (loc: Location) => {
      if (!loc || !map) return;
      try {
        // Prepare the query string based on the search params
        const queryString = searchParams.toString();
        const response = await api.get(
          `http://localhost:3000/api/room?${queryString}`
        );

        setShelters(response.data.rooms);
      } catch (err) {
        console.log(err);
      }
    },
    [map, searchParams]
  );

  // Function to center the map to the current location
  const centerMap = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const NewcurrentLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Center the map immediately
          if (map) {
            map.panTo(
              new google.maps.LatLng(
                NewcurrentLocation.lat,
                NewcurrentLocation.lng
              )
            );
            map.setZoom(15);
          }
          if (inputRef.current) {
            inputRef.current.value = "";
          }

          // Set state and fetch shelters afterward
          setLocation(NewcurrentLocation);
          setCurrentLocaton(NewcurrentLocation);
          getShelters(NewcurrentLocation);
        },
        (error) => {
          console.error("Error obtaining location: ", error);

          // Fallback to a default location
          const defaultLocation: Location = { lat: 0, lng: 0 };
          if (map) {
            map.panTo(
              new google.maps.LatLng(defaultLocation.lat, defaultLocation.lng)
            );
            map.setZoom(20);
          }
          setLocation(defaultLocation);
        },
        {
          enableHighAccuracy: true, // Request higher accuracy
          timeout: 5000, // Reduce timeout for quicker fallback
          maximumAge: 10000, // Use cached location if available
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [map, getShelters]);

  // UseEffect to get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const currentLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(currentLocation);
          if (map) {
            map.setCenter(
              new google.maps.LatLng(currentLocation.lat, currentLocation.lng)
            );
            map.setZoom(15);
            getShelters(currentLocation);
          }
        },
        (error) => {
          console.error("Error obtaining location: ", error);
        },
        { enableHighAccuracy: true }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [map]);

  // Function to handle marker click
  const getPinColor = useCallback((shelter: IRoom) => {
    if (!shelter.available) {
      return pinIcons.red;
    }
    return shelter.isPublic ? pinIcons.orange : pinIcons.green;
  }, []);

  // Function to handle place selection from the autocomplete dropdown
  const onPlaceSelected = () => {
    if (autocompleteRef.current && map) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLocation: Location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        // Update the location state
        setLocation(newLocation);

        // Update the search parameters with the new lat and lng
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()), // Keep existing search params
          lat: newLocation.lat.toString(),
          lng: newLocation.lng.toString(),
        });

        // Center the map on the new location
        map.panTo(new google.maps.LatLng(newLocation.lat, newLocation.lng));
        map.setZoom(15); // Adjust zoom level as needed

        // Fetch shelters near the new location
        getShelters(newLocation);
      }
    }
  };

  const handleMarkerClick = useCallback((shelter: IRoom) => {
    setSelectedRoom(shelter); // Set the selected room
    setRoomModalOpen(true); // Open the RoomModal
    // Remove any logic here that centers or pans the map
  }, []);

  return (
    <div>
      <CountDown location={location} />
      <button onClick={() => setIsDialogOpen(true)}>TEST</button>
      <AddRoomDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      {isLoaded && location ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={
            location
              ? new google.maps.LatLng(location.lat, location.lng)
              : undefined
          }
          zoom={15}
          onLoad={setMap}
          options={mapOptions}
        >
          {/* Autocomplete Input */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={onPlaceSelected}
            >
              <input
                type="text"
                ref={inputRef}
                placeholder="Search for a place"
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `240px`,
                  height: `40px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                }}
              />
            </Autocomplete>
          </div>
          <MarkerF
            key={1}
            position={new google.maps.LatLng(location.lat, location.lng)}
            icon={{
              url: pinIcons.blue,
              scaledSize: new google.maps.Size(25, 25),
            }}
          />
          {shelters.map((shelter: IRoom, index) =>
            shelter.location ? (
              <MarkerF
                key={`${shelter._id}${index}`}
                position={{
                  lat: shelter.location.lat,
                  lng: shelter.location.lng,
                }}
                icon={{
                  url: getPinColor(shelter),
                  scaledSize: new google.maps.Size(25, 25),
                }}
                onClick={() => {
                  nav(`/map/${shelter._id}`);
                }}
              />
            ) : null
          )}
          <FilterBtn loc={location} />
          <MyLocationBtn centerMap={centerMap} />
          <ColorMap />
          <button onClick={() => setIsDialogOpen(true)}>TEST</button>
          <AddRoomDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
          />
        </GoogleMap>
      ) : (
        <Loader />
      )}
      <Outlet />
    </div>
  );
}

export default MapPage;




