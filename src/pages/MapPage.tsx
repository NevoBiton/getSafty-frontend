import { useEffect, useState, useCallback, useContext, useRef } from "react";
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import MyLocationBtn from "../components/MyLocationBtn";
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
  width: "100%",
  height: "calc(100vh - 0px)",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  clickableIcons: false,
  // styles: darkModeStyle,
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
  const [searchParams, setSearchParams] = useSearchParams(); // Get and set search params
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null); // Ref for the autocomplete input
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the search input

  const nav = useNavigate();

  const getShelters = useCallback(
    async (loc: Location) => {
      if (!loc || !map) return;
      try {
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
  useEffect(() => {
    if (location) {
      getShelters(location);
    }
  }, [location, map, searchParams, getShelters]);
  const centerMap = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const NewcurrentLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

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

          setLocation(NewcurrentLocation);
          setCurrentLocaton(NewcurrentLocation);
          getShelters(NewcurrentLocation);
        },
        (error) => {
          console.error("Error obtaining location: ", error);

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
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 10000,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [map, getShelters]);

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

  const getPinColor = useCallback((shelter: IRoom) => {
    if (!shelter.available) {
      return pinIcons.red;
    }
    return shelter.isPublic ? pinIcons.orange : pinIcons.green;
  }, []);

  const onPlaceSelected = () => {
    if (autocompleteRef.current && map) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLocation: Location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setLocation(newLocation);

        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          lat: newLocation.lat.toString(),
          lng: newLocation.lng.toString(),
        });

        map.panTo(new google.maps.LatLng(newLocation.lat, newLocation.lng));
        map.setZoom(15);

        getShelters(newLocation);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <CountDown location={location} />

      {isLoaded && location ? (
        <div className="flex-1">
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
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3">
              <Autocomplete
                className="max-w-[50%] min-w-[50%] mx-auto mt-5"
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={onPlaceSelected}
              >
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="Search for a place"
                  className="w-full h-10 px-3 text-sm rounded-md shadow-lg outline-none border border-gray-200"
                />
              </Autocomplete>
            </div>
            {/* <MarkerF
              key={1}
              position={new google.maps.LatLng(location.lat, location.lng)}
              icon={{
                url: pinIcons.blue,
                scaledSize: new google.maps.Size(25, 25),
              }}
            /> */}

            <MarkerF
              key={1}
              position={new google.maps.LatLng(location.lat, location.lng)}
              icon={{
                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="10" r="3"/>
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
      </svg>
    `),
                scaledSize: new google.maps.Size(25, 25), // Adjust the size as needed
                labelOrigin: new google.maps.Point(20, -15), // Adjust the label position if needed
              }}
              label={{
                text: "Your Location",
                color: "#000",
                fontSize: "14px",
                fontWeight: "bold",
                className: "marker-label",
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
          </GoogleMap>
        </div>
      ) : (
        <Loader />
      )}
      <Outlet />
    </div>
  );
}

export default MapPage;
