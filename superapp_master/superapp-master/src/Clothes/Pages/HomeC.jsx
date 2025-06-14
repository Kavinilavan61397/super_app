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
import banner1 from "../../Images/HomeScreen/banner1.svg";
import banner2 from "../../Images/HomeScreen/banner2.svg";
import banner3 from "../../Images/HomeScreen/banner3.svg";
import "swiper/css/free-mode";
import shirt from "../Images/shirt.svg";
import arrow from "../../Icons/rigtharrowbutton.svg";
import Deals from '../SubPages/Home/Deals';
import Footer from '../../Utility/Footer';
import BestSeller from './BestSeller/BestSeller';
import cosmeticImage from '../Images/cosmetic.jpg'; 
import HomeappliancesImage from '../Images/homeappliances.jpg';

const categories = [
    { name: "Men ", image: shirt, route: '/categories/men-uniforms' },
    { name: "Women ", image: shirt, route: '/categories/women-uniforms' },
    { name: "Cosmetics", image: cosmeticImage, route: "/categories/cosmetics" },
    { name: "Home Appliances",image: HomeappliancesImage,route:'/categories/homeappliances'}
    // { name: "Kurta", image: shirt, route: "/kurta" },
];

const bannerImage = [
    { id: 1, mobile_image_url: banner1 },
    { id: 2, mobile_image_url: banner2 },
    { id: 3, mobile_image_url: banner3 },
];

const products = [
    {
        id: 1,
        name: "Men Uniforms",
        image: shirt,
        price: 4000,
        originalPrice: 5000,
        discount: "30% Off",
        rating: 4.2,
        bestSeller: true,
    },
    {
        id: 2,
        name: "Men Uniforms",
        image: shirt,
        price: 4000,
        originalPrice: 5000,
        discount: "30% Off",
        rating: 4.2,
        bestSeller: true,
    },
    {
        id: 3,
        name: "Men Uniforms",
        image: shirt,
        price: 4000,
        originalPrice: 5000,
        discount: "30% Off",
        rating: 4.2,
        bestSeller: true,
    },
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
                                <div className="flex flex-col items-center w-full h-[400px] rounded-2xl shadow-md cursor-pointer overflow-hidden">
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

                <div className="bg-white relative z-10">
                    <Swiper
                        spaceBetween={16}
                        slidesPerView="auto"
                        onSwiper={(swiper) => (categorySwiperRef.current = swiper)}
                        className=" !pb-1"
                    >
                        {categories.map((category, index) => (
                            <SwiperSlide key={index} className="!w-[64px]">
                                <div
                                    className="flex flex-col items-center w-full cursor-pointer transition-transform transform hover:scale-105"
                                    onClick={() => navigate(category.route)} // ✅ Navigate on click
                                >
                                    <div className="w-16 h-16 bg-[#F7F5FF] flex items-center justify-center rounded-[16px] mt-4 border border-[#6315FF]">
                                        <img src={category.image} alt={category.name} className="w-10 h-10" />
                                    </div>
                                    <p className="py-2 text-center text-xs font-medium text-[#242424]">{category.name}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Festival Sales */}
                <div className="flex justify-between items-center w-full mt-2">
                    <div className="font-medium text-[16px]">Festival Sales</div>
                    <img src={arrow} alt="arrow" className="h-4 w-4" />
                </div>
                <Deals />

                {/* Repeat Banner */}
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
                                <div className="flex flex-col items-center w-full h-[400px] rounded-2xl shadow-md cursor-pointer overflow-hidden">
                                    <img
                                        src={banner.mobile_image_url}
                                        alt="banner"
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Bestsellers */}
                <div className="flex justify-between items-center w-full mt-2 mb-2">
                    <div className="font-medium text-[16px]">Bestseller Uniforms</div>
                    <img src={arrow} alt="arrow" className="h-4 w-4" />
                </div>

                <div className="w-full pb-6">
                    <Slider {...settings} className="w-full">
                        {products.map((product, index) => (
                            <BestSeller key={index} product={product} />
                        ))}
                    </Slider>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HomeC;
