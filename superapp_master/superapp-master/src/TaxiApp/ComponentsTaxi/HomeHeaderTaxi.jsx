import React from 'react';
import location from "../../Images/HomeScreen/location.svg";


function HomeHeaderTaxi() {
    return (

        <div className="fixed top-0 left-0 w-full bg-white shadow-md flex justify-between items-center pt-8 px-4 pb-2 z-50">            <h1 className="text-lg font-bold">E-STORE</h1>
            <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600 text-right">
                    <span>Delivery to </span><br />
                    <span className="font-semibold text-black">India - 501 642</span>
                </div>
                <img src={location} alt="Location" className="w-10 h-10" />
            </div>
        </div>
    )
}
export default HomeHeaderTaxi;  