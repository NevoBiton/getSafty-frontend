import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import MyLocationBtn from "../components/MyLocationBtn";
import axios from "axios";
import { IRoom } from "@/context/AuthContext";
import ColorMap from "@/components/ColorMap";

interface Location {
  lat: number;
  lng: number;
}

const libraries: "places"[] = ["places"];
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function MapPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDwY1nKLe_qB7XyA6_8uBsBkOG_uNdtxgg", // Replace with your actual Google Maps API key
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [shelters, setShelters] = useState<IRoom[]>([]);

  const getShelters = async (loc: Location) => {
    if (!loc || !map) return;
    try {
      const response = await axios.get("http://localhost:3000/api/room");
      console.log("Shelters Data:", response.data.rooms); // Log the fetched data
      setShelters(response.data.rooms);
    } catch (err) {
      console.log(err);
    }
  };

  const centerMap = useCallback(() => {
    if (location && map) {
      map.panTo(new google.maps.LatLng(location.lat, location.lng));
      map.setZoom(15); // Set a reasonable zoom level
    }
  }, [location, map]);

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
            map.setZoom(15); // Ensure zoom is adequate to view the location
            getShelters(currentLocation);
          }
        },
        (error) => {
          console.error("Error obtaining location: ", error);
        },
        { enableHighAccuracy: true } // Use high accuracy if available
      );

      return () => {
        navigator.geolocation.clearWatch(watchId); // Clear the watch when the component unmounts
      };
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [map]);

  // Function to determine pin color based on shelter properties
  const getPinColor = (shelter: IRoom) => {
    if (!shelter.available) {
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png"; // Grey for unavailable
    }
    return shelter.isPublic
      ? "http://maps.google.com/mapfiles/ms/icons/orange-dot.png" // Orange for public
      : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // Green for private and available
  };

  return (
    <div>
      {isLoaded && location ? (
        <GoogleMap
          key={location.lat}
          mapContainerStyle={containerStyle}
          center={
            location
              ? new google.maps.LatLng(location.lat, location.lng)
              : undefined
          }
          zoom={15}
          onLoad={(map) => {
            setMap(map);

            // Disable clicking on places other than the bomb shelters
            map.setOptions({
              clickableIcons: false,
            });
          }}
          options={{
            disableDefaultUI: true, // Disable all default UI
            zoomControl: false, // Disable the zoom control so users can manually zoom
            fullscreenControl: false, // Disable the fullscreen control
            streetViewControl: false, // Disable the street view control
            mapTypeControl: false, // Disable the map type control
          }}
        >
          <MarkerF
            position={new google.maps.LatLng(location.lat, location.lng)}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(25, 25),
            }}
          />

          {shelters.map((shelter: IRoom) =>
            shelter.location ? (
              <MarkerF
                key={shelter.roomId}
                position={{
                  lat: shelter.location.lat,
                  lng: shelter.location.lng,
                }}
                icon={{
                  url: getPinColor(shelter), // Use the function to set the pin color
                  scaledSize: new google.maps.Size(25, 25), // Set a consistent size for all pins
                }}
                onClick={() => {
                  alert(`Clicked on shelter: ${shelter.available}`);
                }}
              />
            ) : null
          )}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
      <MyLocationBtn centerMap={centerMap} />
      <ColorMap />
    </div>
  );
}

export default MapPage;
