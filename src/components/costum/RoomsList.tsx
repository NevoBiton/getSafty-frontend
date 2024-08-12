import { AuthContext, IRoom } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { Switch } from "../ui/switch";
import api from "@/services/api.services";
import { Edit } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import EditRoomDialog from "./EditRoomDialog";
import { Separator } from "../ui/separator";

function RoomsList() {
  const authContext = useContext(AuthContext);
  const [openEditRoomModal, setOpenEditRoomModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  if (!authContext) {
    throw new Error("RegisterPage must be used within an AuthProvider");
  }
  const { userRooms, setUserRooms } = authContext;

  async function editRoomDetails(
    roomId: string | undefined,
    newData: Partial<IRoom>
  ) {
    try {
      const { data } = await api.patch(`/room/${roomId}`, newData);
      const updatedRoom: IRoom = data.room;
      setUserRooms((prev: IRoom[]): IRoom[] =>
        prev.map((room) => (room._id === updatedRoom._id ? updatedRoom : room))
      );
    } catch (error) {
      console.log(error);
    }
  }

  function handleEditRoomClick(roomId: string | undefined) {
    roomId && searchParams.set("roomId", roomId);
    setSearchParams(searchParams);
    setOpenEditRoomModal(true);
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {openEditRoomModal && (
          <EditRoomDialog
            isOpen={openEditRoomModal}
            onClose={() => setOpenEditRoomModal(false)}
          />
        )}
        {userRooms?.map((room) => (
          <li key={room._id} className="space-y-3">
            <Separator />
            <div className="flex justify-between">
              <div className="font-medium text-lg">{room.title}</div>
              <div className="flex gap-2 items-center">
                <Edit
                  className="cursor-pointer"
                  size={20}
                  onClick={() => handleEditRoomClick(room._id)}
                />
                <Switch
                  checked={room.available}
                  onClick={() =>
                    editRoomDetails(room._id, { available: !room.available })
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default RoomsList;
