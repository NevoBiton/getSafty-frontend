import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RoomsList from "./costum/RoomsList";
import { LogOut } from "lucide-react";
import { Separator } from "./ui/separator";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

interface DrawerCompProps {
  openDrawer: boolean;
  setOpenDrawer: (openDrawer: boolean) => void;
}

function DrawerComp({ openDrawer, setOpenDrawer }: DrawerCompProps) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("RegisterPage must be used within an AuthProvider");
  }
  const { loggedInUser, logout } = authContext;

  return (
    <>
      <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
        <SheetContent
          side={"left"}
          className="bg-gradient-to-br from-blue-100 via-blue-50 to-white text-gray-800 shadow-lg"
        >
          <SheetHeader className="border-b border-gray-300 pb-4 mb-6">
            <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
          </SheetHeader>

          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="item-1" className="border-t border-gray-200">
              <AccordionTrigger className="text-lg font-medium bg-gradient-to-r from-blue-300 to-blue-400 text-gray-800 py-2 px-3 rounded-md hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 transition">
                My Shelters
              </AccordionTrigger>
              <AccordionContent className="p-3 bg-gray-50 text-gray-700 rounded-md mt-2">
                <RoomsList />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {loggedInUser && (
            <>
              <button className="text-lg w-full text-left font-medium bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 py-2 px-3 rounded-md hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 transition">
                Settings
              </button>
              <Separator className="my-4" />
              <button
                className="text-lg w-full flex justify-between font-medium bg-gradient-to-r from-red-300 to-red-400 text-gray-800 py-2 px-3 rounded-md hover:bg-gradient-to-r hover:from-red-400 hover:to-red-500 transition"
                onClick={() => {
                  logout();
                  setOpenDrawer(!openDrawer);
                }}
              >
                <span>Log Out</span>
                <LogOut className="text-gray-800" />
              </button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default DrawerComp;
