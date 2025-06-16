import React, { useState, useEffect } from 'react';
import Header from '../SubPages/Header';
import profilepic from '../Images/profilepic.svg';
import plus from "../../Icons/plus.svg";
import { useNavigate } from 'react-router-dom';
import Footer from '../SubPages/Footer';

function Profile() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState("Home");
    const buttons = ["Home", "Office", "Others"];

    // State variables for form fields
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailId, setEmailId] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [profileImage, setProfileImage] = useState(null); // New state for profile image

    // Load profile data from localStorage on component mount
    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (storedProfile) {
            setFullName(storedProfile.fullName || '');
            setPhoneNumber(storedProfile.phoneNumber || '');
            setEmailId(storedProfile.emailId || '');
            setCity(storedProfile.city || '');
            setState(storedProfile.state || '');
            setPincode(storedProfile.pincode || '');
            setProfileImage(storedProfile.profileImage || null); // Load profile image
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const MAX_WIDTH = 200; // Max width/height for the image
                    const MAX_HEIGHT = 200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert canvas to a compressed JPEG Data URL
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 is quality (70%)
                    setProfileImage(dataUrl);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        const profileData = {
            fullName,
            phoneNumber,
            emailId,
            city,
            state,
            pincode,
            profileImage, // Include profile image in saved data
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        console.log('Profile saved to local storage:', profileData);
        navigate('/home-grocery/account', { replace: true });
    };

    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <Header />
            <div className='pt-20 pb-28 px-4'>
                <div className='font-medium text-base pt-4'>Your Profile</div>
                <div className="mt-2 bg-white rounded-full p-2 border border-[#E1E1E1] flex items-center gap-3">

                    <div className="relative w-[50px] h-[50px]">
                        <img src={profileImage || profilepic} alt="Profile" className="rounded-full w-full h-full object-cover" />
                        <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#5C3FFF] flex items-center justify-center cursor-pointer"
                            style={{ height: '18px', width: '18px' }}>
                            <img src={plus} alt="Plus" className="w-3 h-3" />
                            <input
                                id="profile-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div>
                        <div className='text-xs font-medium'>Your Account</div>
                        <div className='text-base font-semibold'>{fullName}</div>
                    </div>
                </div>
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

                <label className="mt-4 block text-sm text-gray-600 w-full">Email ID</label>
                <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
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
                        <label className="block text-sm text-gray-600">State</label>
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
                {/* <div className='font-medium text-base  pt-4'>Select Type</div>
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
                </div> */}
                <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 bg-[#5C3FFF] text-white rounded-[50px] mt-6" >
                   Submit
                </button>
            </div>
            <Footer/>
        </div>
    );
}

export default Profile;
