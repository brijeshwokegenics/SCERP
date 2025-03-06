import { BellIcon, ArrowCircleRightIcon  } from '@heroicons/react/outline';

import Logout from "./headerSidebar/Logout";

const Header = () => {
  return (
    <nav className="shadow-md w-full text-black overflow-x-hidden">
      <div className="flex justify-between items-center p-4 bg-white">
        <span className="text-2xl font-bold">WG School</span>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <BellIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          </div>
          <Logout />
        </div>
      </div>

    </nav>
  );
};

export default Header;