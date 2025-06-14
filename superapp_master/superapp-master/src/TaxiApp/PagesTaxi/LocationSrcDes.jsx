import React, { useState } from "react";
import HomeHeaderTaxi from "../ComponentsTaxi/HomeHeaderTaxi";
import FooterTaxi from "../ComponentsTaxi/FooterTaxi";
import search from "../../Icons/search.svg";
import mic from "../../Icons/Mic.svg";
import mapPlaceholder from "../../FoodDilvery/ImagesF/mapfromFigma.svg";
// import location from "../ImagesTaxi/location-sugg-list.svg";
import greenLocation from "../ImagesTaxi/gpsgreen.svg";
import stepper from "../../FoodDilvery/ImagesF/stepperfortrackorderfood.svg";
import goNow from "../ImagesTaxi/goNow.svg";
import promoCode from "../ImagesTaxi/applypromo.svg";
import location from "../ImagesTaxi/location-sugg-list.svg";

function LocationSrcDes() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const locations = [
        "3517 W. Gray St. Utica, Pennsylvania 57867",
        "123 Main Street, Los Angeles, CA",
        "45 Broadway Ave, New York, NY",
        "Phnom Penh, Cambodia",
        "Bangkok, Thailand",
        "Ho Chi Minh City, Vietnam",
        "Jakarta, Indonesia"
    ];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value) {
            const filteredSuggestions = locations.filter((loc) =>
                loc.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setQuery(suggestion);
        setSuggestions([]);
    };

    return (
        <div className="relative h-screen bg-gray-100">
            <HomeHeaderTaxi />
            <div className="relative flex-1">
                <img src={mapPlaceholder} alt="map" className="w-full h-[50%] object-cover" />

                <div className="fixed top-24 left-4 right-4 bg-white rounded-full shadow-md flex items-center">
                    <img src={search} alt="search" className="w-5 h-5 ml-3" />
                    <input
                        type="text"
                        placeholder="Search destinations"
                        value={query}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-none focus:outline-none bg-transparent"
                    />
                    <img src={mic} alt="mic" className="w-5 h-5 mr-3" />
                </div>

                <div className="pb-28 fixed bottom-0 left-0 right-0 bg-white rounded-3xl shadow-md p-6">
                    <h2 className="text-[24px] font-semibold">Where are you going today?</h2>
                    <div className="flex items-center gap-2 mt-4">
                        <img src={stepper} alt="track" className="w-5 h-[97px]" />
                        <div className="h-[97px] flex flex-col justify-between">
                            <div className="">
                                <div className="text-sm font-normal text-[#94A3B8]">Pick-up</div>
                                <div className="text-sm font-medium text-[#475569]">My current location</div>
                            </div>
                            <hr />
                            <div className="">
                                <div className="text-sm font-normal text-[#94A3B8]">Drop off (optional)</div>
                                <div className="text-sm font-medium text-[#475569]">3517 W. Gray St. Utica, Pennsylvania 57867</div>
                            </div>                        </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                        <img src={goNow} alt="goNow" style={{ width: "125px", height: "50px" }} />
                        <img src={promoCode} alt="promoCode" style={{ width: "170px", height: "50px" }} />
                    </div>
                </div>

                {suggestions.length > 0 && (
                    <div className="fixed top-36 left-4 right-4 bg-white rounded-xl shadow-md p-2">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                <img src={location} alt="location" className="w-5 h-5 mr-3" />
                                <p className="text-sm font-medium">{suggestion}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* <img src={greenLocation} alt="location" className="fixed bottom-24 right-4 w-16 h-16" /> */}
            </div>
            <FooterTaxi />
        </div>
    );
}

export default LocationSrcDes;
