import React from 'react';
import HomeHeaderHotel from '../ComponentsHotel/HomeHeaderHotel';
import FooterHotel from '../ComponentsHotel/FooterHotel';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlidingCaurosel from '../ComponentsHotel/SlidingCaurosel';
import hotel1 from "../ImagesHotel/HotelImage1.svg";
import arrow from "../../Icons/rigtharrowbutton.svg";
import NearByHotel from '../ComponentsHotel/NearByHotel';
import search from "../../Icons/search.svg";
import mic from "../../Icons/Mic.svg";

const products = [
    {
        id: 1,
        name: "Hotel Galaxy",
        image: hotel1,
        price: 4000,
        originalPrice: 5000,
        discount: "10% Off",
        rating: 4.2,
        deliveryTime: "20-25 mins",
    },
    {
        id: 2,
        name: "Hotel Galaxy",
        image: hotel1,
        price: 4000,
        originalPrice: 5000,
        discount: "10% Off",
        rating: 4.2,
        deliveryTime: "20-25 mins",
    },
    {
        id: 3,
        name: "Hotel Galaxy",
        image: hotel1,
        price: 4000,
        originalPrice: 5000,
        discount: "10% Off",
        rating: 4.2,
        deliveryTime: "20-25 mins",
    },

];

function HomeH() {
   
    const settings = {
        dots: false, // ✅ Enable navigation dots
        infinite: true,
        speed: 500,
        slidesToShow: 2, // ✅ Show 2 products at a time
        slidesToScroll: 1,
        arrows: false, // Hide default arrows
      };
    return (
        <div>
            <HomeHeaderHotel />
            <div className='mt-24 mb-28'>

                <div className="flex justify-center mt-4 px-4">
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
                <div className="flex justify-between items-center w-full mt-3 mb-2 px-4">
                    <div className="font-medium text-[16px]">Recommended Hotel </div>
                    <img src={arrow} alt="arrow" className="h-4 w-4" />
                </div>


                <div className="w-full pb-4 px-2">
                    <Slider {...settings} className="w-full">
                        {products.map((product, index) => (
                            <SlidingCaurosel key={index} product={product} />
                        ))}
                    </Slider>
                </div>
               

                <div className="flex justify-between items-center w-full mt-3 mb-2 px-4">
                    <div className="font-medium text-[16px]">Nearby Hotel </div>
                    <img src={arrow} alt="arrow" className="h-4 w-4" />
                </div>

                <div className="px-4">

                    {products.map((product, index) => (
                        <div key={index} className="py-2">
                            <NearByHotel product={product} />
                        </div>
                    ))}


                </div>

                
            </div>
            <FooterHotel />
        </div>
    );
}
export default HomeH;