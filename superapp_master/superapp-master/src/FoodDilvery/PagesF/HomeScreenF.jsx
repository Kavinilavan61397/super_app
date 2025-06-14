import React, { useRef, useState, useEffect } from 'react';
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
import noodels from "../ImagesF/noodles.svg";
import arrow from "../../Icons/rigtharrowbutton.svg";
import HeaderF from '../ComponentsF/HeaderF';
import BestSellerF from '../SeasonsF/BestSellerF';
import TopRestaurents from '../SeasonsF/TopRestaurents';
import FooterFood from '../ComponentsF/FooterFood';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const bannerImage = [
    { id: 1, mobile_image_url: banner3 },
    { id: 2, mobile_image_url: banner2 },
    { id: 3, mobile_image_url: banner1 },
];

const products = [
    {
        id: 1,
        name: "Chinese Wok",
        image: noodels, // Replace with actual image URL
        price: 4000,
        originalPrice: 5000,
        discount: "40% Off Upto ₹120",
        rating: 4.2,
        deliveryTime: "20-25 mins",
    },
    {
        id: 2,
        name: "Chinese Wok",
        image: noodels,
        price: 4000,
        originalPrice: 5000,
        discount: "40% Off Upto ₹120",
        rating: 4.2,
        deliveryTime: "20-25 mins",
    },
    {
        id: 3,
        name: "Chinese Wok",
        image: noodels,
        price: 4000,
        originalPrice: 5000,
        discount: "40% Off Upto ₹120",
        rating: 4.2,
        deliveryTime: "20-25 mins",
    },

];

function HomeScreenF() {
    const navigate = useNavigate();
    const categorySwiperRef = useRef(null);
    const settings = {
        dots: true, // ✅ Enable navigation dots
        infinite: true,
        speed: 500,
        slidesToShow: 2, // ✅ Show 2 products at a time
        slidesToScroll: 1,
        arrows: false, // Hide default arrows
    };

    const [loading, setLoading] = useState(true);   

    const [category, setCategory] = useState([]);
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get("https://yrpitsolutions.com/ecom_backend/api/get_unique_category_names");
                setCategory(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        getCategories();
    }, []);
    return (
        <div className='min-h-screen'>
            <HeaderF />
            <div className='mt-24 mb-28 px-4'>
                <div className="flex justify-center mt-4 ">
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
                </div>

                <div className="w-full">
                    <Swiper
                        spaceBetween={16}
                        slidesPerView="auto"
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                        className="!py-4 w-full"
                    >
                        {bannerImage.map((banner) => (
                            <SwiperSlide key={banner.id} className="!w-full">
                                <div className="flex flex-col items-center w-full h-[140px] rounded-2xl shadow-md cursor-pointer overflow-hidden">
                                    <img
                                        src={banner?.mobile_image_url}
                                        alt="banner_image"
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="flex justify-between items-center w-full">
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
                        {category.map((category, index) => (
                            <SwiperSlide key={index} className="!w-[64px]">
                                <div className="flex flex-col items-center w-full cursor-pointer transition-transform transform hover:scale-105" >
                                    <div className="w-16 h-16 bg-[#F7F5FF] flex items-center justify-center rounded-[16px] mt-4 border border-[#6315FF]" onClick={() => navigate(`/home-food/restaurent-list-based-on-category/${category.category_name}`)}>
                                        <img
                                            src={category.category_image}
                                            alt={category.category_name}
                                            className="w-10 h-10 object-cover"
                                            
                                        />
                                    </div>
                                    <p className="py-2 text-center text-xs font-medium text-[#242424]">
                                        {category.category_name}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="flex justify-between items-center w-full mt-2">
                    <div className="font-medium text-[16px]">Top Restauants</div>
                    <img src={arrow} alt="arrow" className="h-4 w-4" />
                </div>
                <TopRestaurents />

                <div className="w-full">
                    <Swiper
                        spaceBetween={16}
                        slidesPerView="auto"
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                        className="!py-4 w-full"
                    >
                        {bannerImage.map((banner) => (
                            <SwiperSlide key={banner.id} className="!w-full">
                                <div className="flex flex-col items-center w-full h-[140px] rounded-2xl shadow-md cursor-pointer overflow-hidden">
                                    <img
                                        src={banner?.mobile_image_url}
                                        alt="banner_image"
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="flex justify-between items-center w-full mt-2 mb-2">
                    <div className="font-medium text-[16px]">Bestseller </div>
                    <img src={arrow} alt="arrow" className="h-4 w-4" />
                </div>


                <div className="w-full pb-6">
                    <Slider {...settings} className="w-full">
                        {products.map((product, index) => (
                            <BestSellerF key={index} product={product} />
                        ))}
                    </Slider>
                </div>
            </div>
            <FooterFood />
        </div>
    );
}

export default HomeScreenF;
