import React, { useState, useEffect } from 'react';
import Header from "../SubPages/Header";
import step1 from "../Images/step1.svg";
import gps from "../Images/gps.svg";
import { useNavigate } from 'react-router-dom';
import plus from "../../Icons/plus.svg";
import edit from "../../Icons/editicon.svg";
import del from "../../Icons/delete.svg";

function EditAllAddress() {
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();

    const loadAddresses = () => {
        const storedAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        setAddresses(storedAddresses);
        console.log('Addresses loaded in EditAllAddress:', storedAddresses);
    };

    useEffect(() => {
        loadAddresses(); // Load addresses on initial mount
        window.addEventListener('focus', loadAddresses); // Reload on focus
        return () => {
            window.removeEventListener('focus', loadAddresses);
        };
    }, []);

    const handleDeleteAddress = (indexToDelete) => {
        const updatedAddresses = addresses.filter((_, index) => index !== indexToDelete);
        localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
        setAddresses(updatedAddresses);
    };

    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <Header />
            <div className='border border-[#E1E1E1] py-4'>
                <img src={step1} alt="" className='w-96 mt-20 mx-auto' />
            </div >
            <div className="flex justify-between items-center px-4 pt-24">
                <h2 className="text-base font-medium">Delivery address</h2>
                <div className="flex items-center gap-2">
                    <img src={plus} alt="plus" className="cursor-pointer w-8 h-8" onClick={() => navigate('/home-grocery/address', { replace: true })} />
                </div>
            </div>
            <div className=' mt-2 px-4 pb-16'>
                {addresses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No addresses added yet. Click the + icon to add a new address.
                    </div>
                ) : (
                    addresses.map((address, index) => (
                        <div key={index} className="mt-3 bg-white border border-gray-300 rounded-[20px] p-1 flex flex-col justify-between h-full">
                            <div className=" mt-2 p-2 rounded-lg" >
                                <div className="flex justify-between items-center w-full">
                                    <div>
                                        {address.fullName},
                                        <span className="bg-[#544C4A] px-2 py-1 rounded-full text-white font-normal text-sm ml-2">
                                            {address.selectedAddressType}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => navigate('/home-grocery/edit-address-values', { state: { address, index }, replace: true })}>
                                            <img src={edit} alt="edit" className="w-4 h-4" />
                                            <span className='text-[#5C3FFF] font-semibold text-sm'>Edit</span>
                                        </div>
                                        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleDeleteAddress(index)}>
                                            <img src={del} alt="delete" className="w-4 h-4" />
                                            <span className='text-red-500 font-semibold text-sm'>Delete</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {address.houseNo}, {address.roadName},<br />
                                    {address.city}, {address.state},<br />
                                    {address.pincode}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default EditAllAddress;