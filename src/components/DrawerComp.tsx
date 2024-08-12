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
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl">
                My Shelters
              </AccordionTrigger>
              <AccordionContent>
                <RoomsList />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {loggedInUser && (
            <>
              <button className="w-full flex justify-between pr-3 font-semibold py-4 text-xl">
                <span>Settings</span>
              </button>
              <Separator />
              <button
                className="w-full flex justify-between pr-3 font-semibold py-4 text-xl"
                onClick={() => {
                  logout();
                  setOpenDrawer(!openDrawer);
                }}
              >
                <span>Log Out</span>
                <LogOut />
              </button>
            </>
          )}
          {/* <Separator /> */}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default DrawerComp;
