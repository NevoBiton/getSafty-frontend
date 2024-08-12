import React, { useState, useEffect } from "react";
import api from "@/services/api.services"; // Import the api service
import { Clock } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

interface Zone {
  name: string;
  countdown: number;
  location: Location;
}

interface CountDownProps {
  location: Location | null;
}

const CountDown: React.FC<CountDownProps> = ({ location }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [zoneName, setZoneName] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      const fetchNearestZone = async () => {
        try {
          const response = await api.get<Zone>(`/room/zones/nearest`, {
            params: {
              lat: location.lat,
              lng: location.lng,
            },
          });
          const nearestZone = response.data;

          if (nearestZone) {
            setCountdown(nearestZone.countdown);
            setZoneName(nearestZone.name);
          }
        } catch (err) {
          console.error("Failed to fetch nearest zone", err);
        }
      };

      fetchNearestZone(); // Call the function to fetch the nearest zone
    }
  }, [location]);

  return (
    <div className="absolute  -right-1 mt-56  p-2 bg-red-600/90 text-white rounded-md shadow-sm z-10  md:right-5 md:p-3">
      {zoneName && countdown !== null ? (
        <div>
          {/* <h3 className="text-sm font-semibold md:text-base">Nearest Zone: {zoneName}</h3> */}
          <div className="flex gap-1 items-center text-xs md:text-sm">
            <p>
              Alert Zone:
              <br />
              {countdown} seconds
            </p>
            <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 self-end" />
          </div>
        </div>
      ) : (
        <p className="text-xxs md:text-xs">Loading countdown...</p>
      )}
    </div>
  );
};

export default CountDown;
