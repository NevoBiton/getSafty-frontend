import React from "react";
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
  console.log(room);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          <li>{room?.address?.street}</li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default SmallShelter;
