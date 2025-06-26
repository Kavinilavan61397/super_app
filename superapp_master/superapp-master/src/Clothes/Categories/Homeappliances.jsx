import React, { useRef } from 'react';
import Header from '../Header/ClothesHeader';
import search from '../../Icons/search.svg';
import mic from '../../Icons/Mic.svg';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from '../Images/home_appliances_banner.jpeg';
import banner2 from '../Images/fan_banner.jpeg';
import banner3 from '../Images/tv_banner.jpg';
import banner4 from '../Images/ac_banner.jpg';
import banner5 from '../Images/kitchen_banner.jpeg';
import banner6 from '../Images/refrigerator_banner.jpeg';
import refrigeratorImg from '../Images/refrigerator.png';
import washingMachineImg from '../Images/washing_machine.png';
import airConditionerImg from '../Images/air_conditioner.png';
import kitchenAppliancesImg from '../Images/blender.png';
import televisionImg from '../Images/television.png';
import fansImg from '../Images/fans.png';
import Footer from '../../Utility/Footer';


const categories = [
    { name: "Refrigerators", image: refrigeratorImg, route: '/categories/homeappliances/refrigerators' },
    { name: "Washing Machines", image: washingMachineImg, route: '/categories/homeappliances/washing-machines' },
    { name: "Air Conditioners & Coolers", image: airConditionerImg, route: '/categories/homeappliances/air-conditioners-coolers' },
    { name: "Kitchen Appliances", image: kitchenAppliancesImg, route: '/categories/homeappliances/kitchen-appliances' },
    { name: "Televisions", image: televisionImg, route: '/categories/homeappliances/televisions' },
    { name: "Fans & Other appliances", image: fansImg, route: '/categories/homeappliances/fans-other' },
];

const bannerImage = [
    { id: 1, mobile_image_url: banner1 },
    { id: 2, mobile_image_url: banner2 },
    { id: 3, mobile_image_url: banner3 },
    { id: 4, mobile_image_url: banner4 },
    { id: 5, mobile_image_url: banner5 },
    { id: 6, mobile_image_url: banner6 },
    // Add more banners if available
];

function HomeAppliances() {

    const navigate = useNavigate();



    return (
        <div className='min-h-screen'>
            <Header />
            <div className='mt-24 mb-28 pb-20 px-4'>
                {/* Search */}
                <div className="flex justify-center mt-4 ">
                    <div className="relative w-full ">
                        <img src={search} alt="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-7" />
                        <input
                            type="text"
                            placeholder="What do you want.."
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF]"
                        />
                        <img src={mic} alt="mic" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-7" />
                    </div>
                </div>

                {/* Banners */}
                <div className="w-full">
                    <Swiper
                        spaceBetween={16}
                        slidesPerView="auto"
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        modules={[Autoplay]}
                        className="!py-4 w-full"
                    >
                        {bannerImage.map((banner) => (
                            <SwiperSlide key={banner.id} className="!w-full">
                                <div className="flex flex-col items-center w-full h-[200px] rounded-2xl shadow-md cursor-pointer overflow-hidden">
                                    <img
                                        src={banner.mobile_image_url}
                                        alt="banner"
                                        className="w-full h-full object-cover rounded-2xl"
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Categories */}
                <div className="mt-4 mb-2 flex items-center">
                    <span className="text-lg font-bold text-[#222]">Categories</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="relative w-full aspect-square rounded-lg overflow-hidden bg-white p-1 flex flex-col items-center justify-center shadow-sm"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(category.route)}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-20 h-20 object-contain mb-1"
                            />
                            <div className="text-[11px] font-semibold text-center leading-tight whitespace-normal w-full px-1">
                                {category.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Best Sellers Heading */}
                <div className="mt-6 mb-2 flex items-center">
                    <span className="text-lg font-bold text-[#222]">Best Sellers</span>
                </div>

            </div>
                <Footer/>
        </div>
    );
}

export default HomeAppliances;