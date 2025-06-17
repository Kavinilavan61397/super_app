import React, { useState, useRef, useEffect } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import navbarimage from "assets/img/layout/Navbar.png";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";
import { authService } from "../../services/authService";
import API_CONFIG from "../../config/api.config";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data using authService
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      // The authService.logout() will handle the redirection
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, we should still clear local data and redirect
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN_EXPIRATION);
      window.location.href = API_CONFIG.ROUTES.LOGIN;
    } finally {
      setIsLoggingOut(false);
      setShowModal(false);
    }
  };

  const confirmLogout = () => {
    handleLogout();
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [awbOrderNo, setAwbOrderNo] = useState("");

  // Function to handle modal toggle
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const buttonRef = useRef(null);

  // Handle form submission
  const handleSubmit = () => {
    if (awbOrderNo.trim()) {
      alert(`Tracking information for AWB/Order No: ${awbOrderNo}`);
      setIsModalOpen(false);
    } else {
      alert("Please enter an AWB/Order No.");
    }
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Admin
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-1 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[300px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        {/* <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            class="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div> */}
        <button
          ref={buttonRef}
          onClick={toggleModal}
          className="px-6 py-2 bg-[#4318ff] text-white rounded-lg hover:bg-[#4318ff]"
        >
          Track Order
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 margin-top-60">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 mt-80">
              <button
                onClick={toggleModal}
                className="absolute -mt-8 text-gray-600 text-3xl ml-[310px]"
              >
                &times;
              </button>
              <h2 className="text-2xl  font-semibold mb-4">Track Your Order</h2>
              <div className="mb-4">
                <label htmlFor="awbOrderNo" className="block text-lg mb-2 text-gray-600 text-3xl">
                  AWB/Order No:
                </label>
                <input
                  type="text"
                  id="awbOrderNo"
                  value={awbOrderNo}
                  onChange={(e) => setAwbOrderNo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter AWB or Order No."
                />
              </div>
              {/* Search Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 py-3 px-6 bg-[#4318ff] text-white rounded-lg shadow-md hover:bg-[#3300cc] transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4318ff] focus:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-4.35-4.35M18 10a8 8 0 11-8-8 8 8 0 018 8z"
                    />
                  </svg>
                  <span>Search</span>
                </button>
              </div>



            </div>
          </div>
        )}


        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        {/* start Notification */}
        {/* <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notification
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  Mark all read
                </p>
              </div>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Horizon UI Dashboard PRO
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
                  </p>
                </div>
              </button>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">

                    Online-Shop UI Dashboard PRO

                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
                  </p>
                </div>
              </button>
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        /> */}
        {/* start Horizon PRO */}
        {/* <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          children={
            <div className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div
                style={{
                  backgroundImage: `url(${navbarimage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                className="mb-2 aspect-video w-full rounded-lg"
              />
              <a
                target="blank"
                href="https://horizon-ui.com/pro?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                Buy Horizon UI PRO
              </a>
              <a
                target="blank"
                href="https://horizon-ui.com/docs-tailwind/docs/react/installation?ref=live-free-tailwind-react"
                className="px-full linear flex cursor-pointer items-center justify-center rounded-xl border py-[11px] font-bold text-navy-700 transition duration-200 hover:bg-gray-200 hover:text-navy-700 dark:!border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:active:bg-white/10"
              >
                See Documentation
              </a>
              <a
                target="blank"
                href="https://horizon-ui.com/?ref=live-free-tailwind-react"
                className="hover:bg-black px-full linear flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold text-navy-700 transition duration-200 hover:text-navy-700 dark:text-white dark:hover:text-white"
              >
                Try Horizon Free
              </a>
            </div>
          }
          classNames={"py-2 top-6 -left-[250px] md:-left-[330px] w-max"}
          animation="origin-[75%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
        /> */}
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        {/* <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={avatar}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, Adela
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <a
                  href=" "
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Newsletter Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="mt-3 text-left text-sm font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 ease-in-out px-3 py-2"
                >
                  Log Out
                </button>
              
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        /> */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={profileData?.logo || avatar}
              alt={profileData?.name || "Admin"}
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {/* 👋 Hey, {profileData?.name || "User"} */}
                   Hey Admin
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <a
                  href="#"
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </a>
                {/* <a
                  href="#"
                  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Newsletter Settings
                </a> */}

                <button
                  onClick={() => setShowModal(true)} // Open the modal
                  className="mt-3 text-left text-sm font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 ease-in-out px-3 py-2"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />

        {/* Modal for logout confirmation */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl mt-96">
              <p className="text-xl font-semibold mb-4">Are you sure you want to log out?</p>
              <p className="text-md mb-4 text-gray-600">
                You will be logged out and your session will end. 
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center justify-center"
                  disabled={isLoggingOut} // Disable button while logging out
                >
                  {isLoggingOut ? (
                    <FaSpinner className="animate-spin mr-2" /> // Show spinner when logging out
                  ) : (
                    "Log Out"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;