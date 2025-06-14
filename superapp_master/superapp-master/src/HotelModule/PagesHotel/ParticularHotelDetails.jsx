import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import hotel2 from "../ImagesHotel/hotel2.svg";
import hotel3 from "../ImagesHotel/hotel3.svg";
import share from "../../Icons/shareicon.svg";
import star from "../../Icons/Star.svg";
import search from "../../Icons/search.svg";
import mic from "../../Icons/Mic.svg";
import { Heart } from "lucide-react";
import arrowIcon from "../../Icons/backiconhome.svg";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import profilepic from '../../Clothes/Images/profilepic.svg';
import TabAbout from "../ComponentsHotel/TabAbout";
import TabGallery from "../ComponentsHotel/TabGallery";
import { FaPlusSquare } from "react-icons/fa";
import CheckInCheckOut from "../ComponentsHotel/CheckInCheckOut";
import GuestsHotel from "../ComponentsHotel/GuestsHotel";

function ParticularHotelDetails() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("about");
    const [selectedImage, setSelectedImage] = useState(hotel2); // Default image
    const [isLiked, setIsLiked] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState(["Verified", "Latest"]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [CheckIn, setCheckIn] = useState(false);
    const [noOFGuests, setnoOFGuests] = useState(false);

    const openGuests = () => {
        setnoOFGuests(true);
    };

    const closeGuests = () => {
        setnoOFGuests(false);
    };

    const closeCheckIn = () => {
        setCheckIn(false);
    };
    return (
        <div className="max-w-md mx-auto overflow-hidden">
            <div className="pb-28">
                <div className="relative">
                    <img
                        src={selectedImage}
                        alt="Hotel"
                        className="w-full h-72 object-cover transition-all duration-300"
                    />

                    <div className="absolute left-1/2 bottom-4 w-3/4 bg-white rounded-lg p-1 transform -translate-x-1/2">
                        <Swiper
                            spaceBetween={4}
                            slidesPerView={6}
                        >
                            {[hotel3, hotel2, hotel3, hotel2, hotel2, hotel2, hotel3, hotel2, hotel2, hotel2].map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index}`}
                                        className={`w-[44px] h-[44px] object-cover rounded cursor-pointer ${selectedImage === image ? "border-2 border-[#5C3FFF]" : ""
                                            }`}
                                        onClick={() => setSelectedImage(image)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="absolute top-10 right-4 flex items-center gap-2">
                        <div
                            className="bg-white rounded-full p-1 cursor-pointer shadow-md w-[30px] h-[30px] flex items-center justify-center"
                            onClick={(e) => { e.stopPropagation(); setIsLiked((prev) => !prev); }}
                        >
                            {isLiked ? (
                                <Heart size={22} fill="#5C3FFF" stroke="#5C3FFF" />
                            ) : (
                                <Heart size={22} stroke="#5C3FFF" />
                            )}
                        </div>
                        <img src={share} alt="Share" className="w-[30px] h-[30px] bg-white rounded-full cursor-pointer" />
                    </div>
                    <img src={arrowIcon} alt=""
                        onClick={() => navigate(-1)}
                        className="absolute top-10 left-4 w-7 h-7 bg-white rounded-full cursor-pointer" />

                </div>
                <div className="flex justify-between items-center px-4 pt-4">
                    <span className="text-sm text-[#1FA300] font-medium">20% off</span>
                    <div className="flex items-center">
                        <img src={star} alt="star" className="w-3 h-3" />
                        <span className="text-xs font-medium ml-1 ">4.8<span className="text-sm font-medium text-[#AEACAC]">(107 reviews)</span></span>
                    </div>
                </div>
                {/* Hotel Info */}
                <div className="px-4 pt-2 flex justify-between items-center ">
                    <div>
                        <h2 className="text-xl font-medium">Hotel Galaxy</h2>
                        <p className="text-[#AEACAC] text-[15px] font-medium">New York, USA</p>
                    </div>
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="32" cy="32" r="32" fill="#5C3FFF" />
                        <path
                            d="M47.92 16.6524L8.70341 31.0215C7.20412 31.5683 7.21069 32.447 8.45103 32.8236L18.8126 35.9935L42.2816 22.3387C43.2927 21.7088 44.2343 21.8572 43.3797 22.5515L22.8323 39.5148H22.8309L22.8323 39.5154L22.1324 50.2784C23.0812 50.2784 23.5076 49.8441 24.0296 49.3473L28.9705 44.6376L39.9696 52.6576C41.7641 53.7089 42.9724 53.2882 43.4081 51.2255L48.8401 19.6134C49.3793 16.9189 48.1366 15.8386 47.92 16.6524Z"
                            fill="white"
                        />
                    </svg>
                </div>

                {/* Tabs */}
                <div className="flex border-b justify-between px-4 pt-4">
                    {["about", "gallery", "review"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1 border-b-4 text-center ${activeTab === tab
                                ? "border-[#5C3FFF] font-medium text-base"
                                : "border-transparent font-medium text-base"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                {/* Tab Content */}
                <div className="p-4">
                    {activeTab === "about" && (
                        <TabAbout />
                    )}
                    {activeTab === "gallery" && (
                        <TabGallery />
                    )}
                    {activeTab === "review" && (
                        <div>
                            <div className="flex justify-between items-center mt-1">
                                <h3 className="text-black font-medium text-base">Reviews</h3>
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="flex items-center text-[#5C3FFF]">
                                    <div className="mr-1 pb-[1px] border-b-2 border-[#5C3FFF] inline-flex">
                                        <Pencil size={16} />
                                    </div>
                                    <span className="font-medium text-base">add Review</span>
                                </button>
                            </div>
                            {/* <div className="flex justify-center mt-3">
                                <div className="relative w-full ">
                                    <img
                                        src={search}
                                        alt="search"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-7"
                                    />
                                    <input
                                        type="text"
                                        placeholder="What do you want.."
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF]"
                                    />
                                    <img
                                        src={mic}
                                        alt="mic"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-7"
                                    />
                                </div>
                            </div> */}
                            <div className="pt-4">
                                {/* Filter Buttons */}
                                {/* <div className="flex justify-between items-center">
                                    <button className="px-2 py-1  text-xs font-medium bg-[#F4F3F3] rounded-full">
                                        Filter ▼
                                    </button>
                                    <button className="px-2 py-1 text-white bg-[#5C3FFF] rounded-full text-xs font-medium">
                                        Verified
                                    </button>
                                    <button className="px-2 py-1 text-white bg-[#5C3FFF] rounded-full text-xs font-medium">
                                        Latest
                                    </button>
                                    <button className="px-2 py-1 bg-[#F4F3F3] rounded-full text-xs font-medium">
                                        With Photos
                                    </button>
                                </div> */}

                                {/* User Review */}
                                <div className="mt-0 space-y-4">
                                    {/* Review 1 */}
                                    <div className="border p-4 rounded-2xl shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <img src={profilepic} alt="User" className="w-11 h-11 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-gray-900">John Dey</p>
                                                    <div className="flex text-yellow-400 text-sm">
                                                        ★★★★☆
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400">10 months ago</p>
                                        </div>
                                        <p className="mt-2 text-gray-700">
                                            Great product! The quality is amazing, and the customer service was very helpful.
                                        </p>
                                    </div>

                                    {/* Review 2 */}
                                    <div className="border p-4 rounded-2xl shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <img src={profilepic} alt="User" className="w-11 h-11 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Michael Brown</p>
                                                    <div className="flex text-yellow-400 text-sm">
                                                        ★★★☆☆
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400">2 months ago</p>
                                        </div>
                                        <p className="mt-2 text-gray-700">
                                            The product is decent, but I expected better durability. Shipping was fast though.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 w-full pt-2 py-1 pb-12 z-20 flex justify-between items-center px-4 bg-white border-t ">
                {/* Price Section */}
                <div className="flex flex-col">
                    <span className="text-[#AEACAC] text-sm font-medium">Total price</span>
                    <span className="text-[#5C3FFF] font-semibold text-lg">
                        ₹ 160 <span className="text-[#AEACAC] text-xs">/Day</span>
                    </span>
                </div>

                {/* Button */}
                <button
                    onClick={() => setCheckIn(true)}
                    className="bg-[#5C3FFF] text-white px-6 py-2 rounded-full text-lg font-medium">
                    Book Now
                </button>
            </div>

            {showReviewForm && (
                <>
                    {/* Black background overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowReviewForm(false)}>
                        <div className="fixed bottom-0 left-0 w-full max-h-[80vh] bg-white rounded-t-[3rem] z-50 overflow-y-auto border-t">
                            <div className="pb-32 px-4 pt-4">
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-sm text-[#1FA300] font-medium">20% off</span>
                                    <div className="flex items-center">
                                        <img src={star} alt="star" className="w-3 h-3" />
                                        <span className="text-xs font-medium ml-1 ">4.8<span className="text-sm font-medium text-[#AEACAC]">(107 reviews)</span></span>
                                    </div>
                                </div>
                                {/* Hotel Info */}
                                <div className=" pt-2 flex justify-between items-center pb-4">
                                    <div>
                                        <h2 className="text-xl font-medium">Hotel Galaxy</h2>
                                        <p className="text-[#AEACAC] text-[15px] font-medium">New York, USA</p>
                                    </div>

                                </div>
                                <hr />
                                {/* Star Rating */}
                                <p className="mt-4 font-medium text-base text-[#AEACAC] text-center">Your overall rating of this product</p>
                                <div className="flex mt-2 justify-center">
                                    {Array(5).fill().map((_, i) => (
                                        <img key={i} src={star} alt="star" className="w-6 h-6 mx-1" />
                                    ))}
                                </div>

                                {/* Review Input */}
                                <p className="mt-4 font-medium text-base">Add detailed review</p>
                                <textarea
                                    className="w-full h-[103px] pl-2 bg-[#F1EDFF] rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-[#5C3FFF]"
                                    placeholder="Enter here"
                                ></textarea>

                                {/* Add Photo */}
                                {/* <div className="mt-4 flex items-center text-[#5C3FFF] cursor-pointer">
                                    <input type="file" id="upload-photo" className="hidden" />
                                    <button className="flex items-center text-[#5C3FFF] text-base font-medium">
                                        <FaPlusSquare className="mr-1" /> add photo
                                    </button>
                                </div> */}

                            </div>
                            <div className="fixed bottom-0 w-full bg-white border-t px-4 pb-12">
                                <button
                                    onClick={() => setShowReviewForm(false)}
                                    className="w-full mt-4 bg-[#5C3FFF] text-white py-2 rounded-full text-lg font-medium">
                                    Submit
                                </button>


                            </div>
                        </div>
                    </div>
                </>
            )}

            {CheckIn && (
                <>
                    {/* Black background overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeCheckIn}></div>

                    {/* CheckIn Popup */}
                    <div className="fixed bottom-0 left-0 w-full max-h-[80vh] bg-white rounded-t-[3rem] z-50 overflow-y-auto border-t">
                        <CheckInCheckOut openGuests={openGuests} />
                    </div>
                </>
            )}

            {noOFGuests && (
                <>
                    {/* Black background overlay (to cover CheckIn as well) */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeGuests}></div>

                    {/* No of Guests Modal */}
                    <div className="fixed bottom-0 left-0 w-full max-h-[80vh] bg-white rounded-t-[3rem] z-50 overflow-y-auto border-t">
                        <GuestsHotel closeGuests={closeGuests} />
                    </div>
                </>
            )}


        </div >
    );
}

export default ParticularHotelDetails;
