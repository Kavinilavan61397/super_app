import React from 'react'
import { FaBed, FaBath, FaRulerCombined, FaSnowflake, FaWifi, FaCoffee } from "react-icons/fa";

function TabAbout() {
    const iconColor = "#5C3FFF";
    return (
        <div>
            <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                    <FaBed color={iconColor} size={24} />
                    <span>2 Beds</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaBath color={iconColor} size={24} />
                    <span className="text-xs font-medium">1 Bath</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaRulerCombined color={iconColor} size={24} />
                    <span className="text-xs font-medium">2000 sqft</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaSnowflake color={iconColor} size={24} />
                    <span className="text-xs font-medium">AC</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaWifi color={iconColor} size={24} />
                    <span className="text-xs font-medium">Wi fi</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaCoffee color={iconColor} size={24} />
                    <span className="text-xs font-medium">Breakfast</span>
                </div>
            </div>
            <div className="text-base font-medium pt-4">Description</div>
            <div className="text-xs font-normal pt-1">Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. to demonstrate the visual form of a document or a typeface without relying on meaningful content.</div>
        </div>
    )
}
export default TabAbout;