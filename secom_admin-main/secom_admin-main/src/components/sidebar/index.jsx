/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import { NavLink } from "react-router-dom";

import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0" : "-translate-x-96"
        }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          Online Shop
          {/* <span class="font-medium">FREE</span> */}

          {/* Horizon <span class="font-medium">FREE</span> */}

        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      
      <ul className="mb-auto pt-1 overflow-y-auto max-h-[calc(100vh-150px)] hide-scrollbar">
        <Links routes={routes} />
      </ul>

      {/* Free Horizon Card */}
      <div className="flex justify-center">

        {/* <SidebarCard /> */}

        {/* <SidebarCard /> */}

      </div>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
