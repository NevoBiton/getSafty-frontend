import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

function RoomsList() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("RegisterPage must be used within an AuthProvider");
  }
  const { userRooms } = authContext;

  return (
    <>
      <ul>
        {userRooms?.map((room) => (
          <li>
            <div>{room.title} </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default RoomsList;
