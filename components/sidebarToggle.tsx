"use client"; // Indicate that this is a client component

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./sidebar"; // Adjust path as necessary

interface SidebarToggleProps {
  userId: string; // Add userId as a prop
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-full bg-blue-600 text-white shadow-lg fixed bottom-4 right-4 z-20 md:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-gray-100 p-4 shadow-lg z-30 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar userId={userId} />
      </div>
    </>
  );
};

export default SidebarToggle;
