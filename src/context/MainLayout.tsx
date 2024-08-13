import { socket } from "@/App";
import NavBar from "@/components/NavBar";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

function MainLayout() {
  const { toast } = useToast();
  useEffect(() => {
    socket.on("alert", (data) => {
      toast({
        title: "RED ALERT!!!",
        description: data.cities,
        className: "bg-red-500 text-white border-none toast-animation",
        duration: 15000,
      });
    });
  }, []);

  return (
    <>
      <Outlet />
      <NavBar />
    </>
  );
}

export default MainLayout;
