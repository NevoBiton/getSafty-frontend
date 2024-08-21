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
import { GOOGLE_API_KEY } from "../../confige";

interface Location {
  lat: number;
  lng: number;
}

const libraries: "places"[] = ["places"];
const containerStyle = {
  width: "100%",
  height: "calc(100vh - 60px)",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  clickableIcons: false,
  gestureHandling: "greedy",
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
    googleMapsApiKey: GOOGLE_API_KEY || "", // Fallback to empty string if not defined
    libraries,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchLocation, setSearchLocation] = useState<Location | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [shelters, setShelters] = useState<IRoom[]>([]);
  const [searchParams, setSearchParams] = useSearchParams(); // Get and set search params
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null); // Ref for the autocomplete input
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the search input

  useEffect(() => {
    fetchShelters();
  }, [map, searchParams]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error obtaining location: ", error);
      },
      { enableHighAccuracy: true }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map]);

  const fetchShelters = async () => {
    try {
      const queryString = searchParams.toString();
      console.log("query: ", queryString);

      const { data } = await api.get(`/room?${queryString}`);
      setShelters(data.rooms);
    } catch (err) {
      console.log(err);
    }
  };

  const goToMyLocation = () => {
    setSearchLocation(null);
    if (map && userLocation) {
      map.panTo(new google.maps.LatLng(userLocation.lat, userLocation.lng));
      map.setZoom(15);
    }
  };

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

        setSearchLocation(newLocation);

        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          lat: newLocation.lat.toString(),
          lng: newLocation.lng.toString(),
        });

        map.panTo(new google.maps.LatLng(newLocation.lat, newLocation.lng));
        map.setZoom(15);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <CountDown location={searchLocation || userLocation} />

      {isLoaded ? (
        <div className="flex-1">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={
              searchLocation
                ? new google.maps.LatLng(searchLocation.lat, searchLocation.lng)
                : userLocation
                ? new google.maps.LatLng(userLocation.lat, userLocation.lng)
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
            {userLocation && (
              <MarkerF
                key={1}
                position={
                  new google.maps.LatLng(userLocation.lat, userLocation.lng)
                }
                icon={{
                  url:
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
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
            )}
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
                    navigate(`/map/${shelter._id}`);
                  }}
                />
              ) : null
            )}
            <FilterBtn loc={searchLocation || userLocation} />
            <MyLocationBtn goToMyLocation={goToMyLocation} />
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
