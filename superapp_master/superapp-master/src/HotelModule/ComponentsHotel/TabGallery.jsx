import React from 'react';
import { useState } from 'react';
import hotel1 from "../ImagesHotel/HotelImage1.svg";
import hotel2 from "../ImagesHotel/hotel2.svg";
import hotel3 from "../ImagesHotel/hotel3.svg";
import { FaPlusSquare } from "react-icons/fa";

function TabGallery() {
    const [images, setImages] = useState([
        hotel1,
        hotel2,
        hotel3
    ]);

    return (
        <div className="">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 mt-1">
                <h2 className="text-base font-medium">
                    Gallery <span className="text-[#5C3FFF]">({images.length})</span>
                </h2>
                <button className="flex items-center text-[#5C3FFF] text-base font-medium">
                    <FaPlusSquare className="mr-1" /> add photo
                </button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Gallery ${index}`}
                        className="rounded-lg object-cover w-full h-40" // Ensures uniform size
                    />
                ))}
            </div>

        </div>
    )
}
export default TabGallery;