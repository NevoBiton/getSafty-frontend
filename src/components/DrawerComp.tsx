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
import { LogOut, PlusCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import AddShelterDrawer from "./costum/AddShelterDrawer";

interface DrawerCompProps {
  openDrawer: boolean;
  setOpenDrawer: (openDrawer: boolean) => void;
}

function DrawerComp({ openDrawer, setOpenDrawer }: DrawerCompProps) {
  const authContext = useContext(AuthContext);
  const [addShelterDialogOpen, setAddShelterDialogOpen] = useState(false);

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

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl relative">
                <div>My Shelters</div>
                <button
                  className="absolute right-8"
                  onClick={() => setAddShelterDialogOpen(true)}
                >
                  <PlusCircle size={20} />
                </button>

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

      {addShelterDialogOpen && (
        <AddShelterDrawer
          isOpen={addShelterDialogOpen}
          onClose={() => setAddShelterDialogOpen(false)}
        />
      )}
    </>
  );
}

export default DrawerComp;
