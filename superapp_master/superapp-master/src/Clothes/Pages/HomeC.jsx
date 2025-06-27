import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Added
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import search from "../../Icons/search.svg";
import mic from "../../Icons/Mic.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from "../Images/mens_wear_banner.jpg";
import banner2 from "../Images/womens_wear_banner.jpg";
import banner3 from "../Images/cosmetics_banner.jpg";
import banner4 from "../Images/home_appliances_banner.jpeg";
import "swiper/css/free-mode";
import mensWear from "../Images/mensWear.jpg";
import womensWear from "../Images/womensWear.jpeg";
import arrow from "../../Icons/rigtharrowbutton.svg";
import Footer from '../../Utility/Footer';
import cosmetics from '../Images/cosmetics.jpg'; 
import homeAppliances from '../Images/homeAppliance.jpg';

const categories = [
    { name: "Men ", image: mensWear, route: '/categories/mens-wear' },
    { name: "Women ", image: womensWear, route: '/categories/women-uniforms' },
    { name: "Cosmetics", image: cosmetics, route: "/categories/cosmetics" },
    { name: "Home Appliances",image: homeAppliances,route:'/categories/homeappliances'}
    // { name: "Kurta", image: shirt, route: "/kurta" },
];

const bannerImage = [
    { id: 1, mobile_image_url: banner1 },
    { id: 2, mobile_image_url: banner2 },
    { id: 3, mobile_image_url: banner3 },
    { id: 4, mobile_image_url: banner4 }
    
];



function HomeC() {
    const categorySwiperRef = useRef(null);
    const navigate = useNavigate(); // ✅ Initialize navigate

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
    };

    return (
        <div className='min-h-screen'>
            <EcommerceGroceryHeader />
            <div className='mt-24 mb-28 px-4'>
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
                <div className="flex justify-between items-center w-full mt-2">
                    <div className="font-medium text-[16px]">Categories</div>
                    <img src={arrow} alt="arrow" className="h-4 w-4" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="relative w-full aspect-square rounded-xl overflow-hidden bg-white"
                            onClick={() => navigate(category.route)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-white bg-opacity-90 px-3 py-1 rounded font-bold uppercase text-xs tracking-wide shadow-sm">
                                {category.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
                <Footer/>
        </div>
    );
}

export default HomeC;
