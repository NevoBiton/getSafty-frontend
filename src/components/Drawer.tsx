interface DrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Drawer = ({ open, setOpen }: DrawerProps) => {
  return (
    <div
      id="dialog-left"
      className="relative z-10"
      aria-labelledby="slide-over"
      role="dialog"
      aria-modal="true"
      // onClick={() => setOpen(!open)}
    >
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed max-w-full inset-y-0 left-0">
            <div
              className={`pointer-events-auto relative w-full h-full transform transition-transform ease-in-out duration-500 ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <div className="flex flex-col h-full overflow-y-scroll bg-white p-20 shadow-xl  rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
