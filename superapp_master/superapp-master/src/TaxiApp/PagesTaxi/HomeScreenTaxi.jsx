import React, { useState } from "react";
import HomeHeaderTaxi from "../ComponentsTaxi/HomeHeaderTaxi";
import FooterTaxi from "../ComponentsTaxi/FooterTaxi";
import search from "../../Icons/search.svg";
import mic from "../../Icons/Mic.svg";
import mapPlaceholder from "../../FoodDilvery/ImagesF/mapfromFigma.svg";
import location from "../ImagesTaxi/location-sugg-list.svg";
import greenLocation from "../ImagesTaxi/gpsgreen.svg";

function HomeScreenTaxi() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const locations = [
        "2972 Westheimer Rd. Santa Ana, Illinois 85486",
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

        // Filter suggestions based on input
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
        <div className="relative h-screen">
            <HomeHeaderTaxi />
            <div className="relative flex-1">
                {/* Map Placeholder */}
                <img src={mapPlaceholder} alt="map" className="w-full h-full object-cover" />

                {/* Search Bar on Map */}
                <div className="fixed top-[90px] left-4 right-4 p-[2px] bg-white rounded-full shadow-lg flex items-center">
                    <img src={search} alt="search" className="w-6 h-6 ml-3" />
                    <input
                        type="text"
                        placeholder="Search destinations"
                        value={query}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-none focus:outline-none bg-transparent"
                    />
                    <img src={mic} alt="mic" className="w-6 h-6 mr-3" />
                </div>
                <img src={greenLocation} alt="location" className="fixed bottom-24 right-0" style={{ width: '70px', height: '70px' }} />
                {/* Suggestions List */}
                {suggestions.length > 0 && (
                    <div className="absolute top-36 left-4 right-4 bg-white rounded-xl shadow-lg p-2">
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
            </div>
            <FooterTaxi />
        </div>
    );
}

export default HomeScreenTaxi;
