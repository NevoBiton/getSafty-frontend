import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IRoom } from "@/context/AuthContext";

interface RoomProps {
  room: IRoom;
}

function SmallShelter({ room }: RoomProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/map/${room._id}`);
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-300 to-blue-400 p-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {room.title}
        </CardTitle>
        <CardDescription className="text-gray-700">
          {room.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          <li className="text-gray-700">
            <strong>Street:</strong> {room?.address?.street || "N/A"}
          </li>
          <li className="text-gray-700">
            <strong>City:</strong> {room?.address?.city || "N/A"}
          </li>
          <li className="text-gray-700">
            <strong>Capacity:</strong> {room.capacity || "Unknown"}
          </li>
        </ul>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t">
        <button
          onClick={handleViewDetails}
          className="bg-orange-300 text-gray-800 px-4 py-2 rounded-full hover:bg-orange-400 transition"
        >
          View Details
        </button>
      </CardFooter>
    </Card>
  );
}

export default SmallShelter;
