import React, { useState, useEffect } from 'react';
import ClothesHeader from '../Header/ClothesHeader';
import profilepic from '../Images/profilepic.svg';
import plus from "../../Icons/plus.svg";
import { useNavigate } from 'react-router-dom';
import Footer from '../../Utility/Footer';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const {
          name, phone, email, address_line1, address_line2,
          city, state, country, pincode, profile_picture
        } = response.data.data;

        setProfile({
          name, phone, email, address_line1, address_line2,
          city, state, country, pincode
        });

        if (profile_picture) {
          setPreviewUrl(`http://localhost:5000/${profile_picture}`);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in profile) {
        formData.append(key, profile[key]);
      }
      if (selectedFile) {
        formData.append('profile_picture', selectedFile);
      }

      await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Profile updated successfully');
      navigate('/home');
    } catch (error) {
      console.error('Failed to update profile:', error.response?.data || error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className='bg-[#F8F8F8] min-h-screen'>
      <ClothesHeader />
      <div className='pt-20 pb-28 px-4'>
        <div className='font-medium text-base pt-4'>Your Profile</div>

        {/* Profile Image and Name */}
        <div className="mt-2 bg-white rounded-full p-2 border border-[#E1E1E1] flex items-center gap-3 relative w-fit">
          <div className="relative w-[50px] h-[50px]">
            <img
              src={previewUrl || profilepic}
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
            <label htmlFor="file-upload">
              <img
                src={plus}
                alt="Plus"
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full p-0.5 cursor-pointer"
                style={{ height: '18px', width: '18px' }}
              />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div>
            <div className='text-xs font-medium'>Your Account</div>
            <div className='text-base font-semibold'>{profile.name}</div>
          </div>
        </div>

        {/* Input Fields */}
        <label className="mt-4 block text-sm text-gray-600">Full name</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
        />

        <label className="mt-4 block text-sm text-gray-600">Phone number</label>
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
        />

        <label className="mt-4 block text-sm text-gray-600">Email ID</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
        />

        <label className="mt-4 block text-sm text-gray-600">Address Line 1</label>
        <input
          type="text"
          name="address_line1"
          value={profile.address_line1}
          onChange={handleChange}
          className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
        />

        <label className="mt-4 block text-sm text-gray-600">Address Line 2</label>
        <input
          type="text"
          name="address_line2"
          value={profile.address_line2}
          onChange={handleChange}
          className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
        />

        <div className="flex gap-x-4 mt-4">
          <div className="w-1/2">
            <label className="block text-sm text-gray-600">City</label>
            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm text-gray-600">State</label>
            <input
              type="text"
              name="state"
              value={profile.state}
              onChange={handleChange}
              className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
            />
          </div>
        </div>

        <label className="mt-4 block text-sm text-gray-600">Country</label>
        <input
          type="text"
          name="country"
          value={profile.country}
          onChange={handleChange}
          className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
        />

        <label className="mt-4 block text-sm text-gray-600">Pincode</label>
        <input
          type="text"
          name="pincode"
          value={profile.pincode}
          onChange={handleChange}
          className="bg-white w-full p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#5C3FFF] mt-1"
        />

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-[#5C3FFF] text-white rounded-[50px] mt-6"
        >
          Submit
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
