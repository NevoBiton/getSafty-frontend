import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import MyLocationBtn from "../components/MyLocationBtn";

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
  const [shelters, setShelters] = useState<google.maps.places.PlaceResult[]>(
    []
  );

  const fetchShelters = (loc: Location) => {
    if (!loc || !map) return;

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: loc,
        radius: 50000,
        keyword: "bomb shelter",
      },
      (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setShelters((prev) => [...prev, ...results]);
          if (pagination?.hasNextPage) {
            setTimeout(() => pagination.nextPage(), 2000);
          }
        }
      }
    );
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
            fetchShelters(currentLocation);
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

  return (
    <div>
      {isLoaded && location ? (
        <GoogleMap
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
          {shelters.map(
            (shelter, index) =>
              shelter.geometry &&
              shelter.geometry.location && (
                <MarkerF
                  key={`${shelter.place_id}-${index}`}
                  position={{
                    lat: shelter.geometry.location.lat(),
                    lng: shelter.geometry.location.lng(),
                  }}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  }}
                  onClick={() => {
                    // Handle shelter click here
                    alert(`Clicked on shelter: ${shelter.name}`);
                  }}
                />
              )
          )}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
      <MyLocationBtn centerMap={centerMap} />
    </div>
  );
}

export default MapPage;
