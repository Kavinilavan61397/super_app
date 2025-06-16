import React from 'react';
import { useState } from "react";
import Header from "../SubPages/Header";
import step1 from "../Images/step1.svg";
import gps from "../Images/gps.svg";
import { useNavigate } from 'react-router-dom';

function Address() {
    const [selected, setSelected] = useState("Home");

    const buttons = ["Home", "Office", "Others"];
    const navigate = useNavigate();

    // State variables for form fields
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [altPhoneNumber, setAltPhoneNumber] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [roadName, setRoadName] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    const handleSubmit = () => {
        // Here you would typically send this data to a backend or save it
        console.log({
            fullName,
            phoneNumber,
            altPhoneNumber,
            houseNo,
            roadName,
            landmark,
            city,
            state,
            pincode,
            selectedAddressType: selected
        });
        
        const newAddress = {
            fullName,
            phoneNumber,
            altPhoneNumber,
            houseNo,
            roadName,
            landmark,
            city,
            state,
            pincode,
            selectedAddressType: selected
        };

        const existingAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        const updatedAddresses = [...existingAddresses, newAddress];
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        console.log('Saved addresses to local storage:', updatedAddresses);

        navigate('/home-grocery/edit-all-addresses', { replace: true });
    };

    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <Header />
            <div className='border border-[#E1E1E1] py-4'>
                <img src={step1} alt="" className='w-full mt-20 px-6' />
            </div >
            <div className="flex justify-between items-center px-4 pt-2">
                <h2 className="text-base font-medium">Add delivery address</h2>
                <div className="flex items-center gap-2"> {/* Added flex, items-center & gap */}
                    <span className='text-[#888888] text-xs font-normal'>Add Location</span>
                    <img src={gps} alt="Close" className="cursor-pointer w-8 h-8" />
                </div>

            </div>
            <div className='px-4 pb-16'>
                <div className='pt-2'>
                    <label className="mt-4 block text-sm text-gray-600 w-full">Full name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                    />

                    <label className="mt-4 block text-sm text-gray-600 w-full">Phone number</label>
                    <input
                        type="number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                    />

                    <label className="mt-4 block text-sm text-gray-600 w-full">Alternative phone number</label>
                    <input
                        type="number"
                        value={altPhoneNumber}
                        onChange={(e) => setAltPhoneNumber(e.target.value)}
                        className=" bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                    />

                    <label className="mt-4 block text-sm text-gray-600 w-full">House no, Building name*</label>
                    <input
                        type="text"
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                        className="bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                    />

                    <label className="mt-4 block text-sm text-gray-600 w-full">Road name, Area, Colony*</label>
                    <input
                        type="text"
                        value={roadName}
                        onChange={(e) => setRoadName(e.target.value)}
                        className="bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                    />

                    <label className="mt-4 block text-sm text-gray-600 w-full">Near by landmark*</label>
                    <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                    />

                    <div className="flex gap-x-4 mt-4">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-600">City*</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-600">State*</label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                            />
                        </div>
                    </div>

                    <label className="mt-4 block text-sm text-gray-600 w-full">Pincode*</label>
                    <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="bg-white w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                    />
                </div>

                <div className='font-medium text-base  pt-4'>Select Type</div>

                <div className="flex space-x-2  pt-2">
                    {buttons.map((btn) => (
                        <button
                            key={btn}
                            onClick={() => setSelected(btn)}
                            className={`px-4 py-1 rounded-full border ${selected === btn
                                ? "bg-[#5C3FFF] text-white"
                                : "bg-white text-black border-gray-300"
                                }`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 bg-[#5C3FFF] text-white rounded-[50px] mt-6" >
                    Dropping Place
                </button>
            </div>
        </div>
    )
}

export default Address;