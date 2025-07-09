import React from "react";
import banner1 from "../Images/HomeScreen/banner1.svg";
import banner2 from "../Images/HomeScreen/banner2.svg";
import banner3 from "../Images/HomeScreen/banner3.svg";
import banner4 from "../Images/HomeScreen/banner4.svg";
import banner5 from "../Images/HomeScreen/bannerGroceries.jpg";
import EcommerceGroceryHeader from "../Components/EcommerceGroceryHeader";
import { useNavigate } from "react-router-dom";
import HomeFooter from "../Utility/HomeFooter";

const HomeScreen = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
            <EcommerceGroceryHeader />
            <div className="w-full max-w-md mt-24 mb-28 space-y-4 px-4">
                <img src={banner1} alt="Banner 1" className="w-full rounded-lg" onClick={() => navigate('/home-clothes')} />
                <img src={banner5} alt="Banner 5" className="w-full rounded-3xl" onClick={() => navigate('/home-grocery')} />
                <img src={banner3} alt="Banner 3" className="w-full rounded-lg" onClick={() => navigate('/home-food')} />
                <img src={banner2} alt="Banner 2" className="w-full rounded-lg" onClick={() => navigate('/home-hotel')} />
                <img src={banner4} alt="Banner 4" className="w-full rounded-lg" onClick={() => navigate('/home-taxi')} />
                <img src="https://dom-website-prod-cdn-cms.porter.in/Desktop_2_5fd0d00dd3.webp" alt="Porter Banner" className="w-full rounded-lg" onClick={() => navigate('/porter')} />
                {/* <img src={banner2} alt="Banner 2" className="w-full rounded-lg" /> */}
            </div>
            <HomeFooter />
        </div>
    );
};

export default HomeScreen;
