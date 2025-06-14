import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Home, LayoutGrid, ShoppingCart } from "lucide-react";
import back from "../Icons/backiconhome.svg";

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: "/home-clothes", icon: Home, label: "Home" },
        { id: "/home-clothes/categories", icon: LayoutGrid, label: "Categories" },
        { id: "/home-clothes/cart", icon: ShoppingCart, label: "Cart" },
        { id: "/home-clothes/account", icon: User, label: "Profile" },
    ];

    return (
        <div className="fixed bottom-0 w-full bg-white shadow-md flex items-center py-1 border-t pb-12 rounded-t-[3rem] z-50">
            {/* Back Button */}
            <button onClick={() => navigate("/home")} className="flex items-center justify-center w-12 h-12 ml-2">
                <img src={back} alt="Back" style={{ width: "24px", height: "24px" }} />
            </button>
           
            {/* Divider */}
            <div className="w-[1px] h-6 bg-gray-300 ml-3"></div>

            {/* Navigation Items */}
            <div className="flex justify-around flex-1">
                {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location.pathname === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.id)}
                            className={`flex flex-col items-center transition-all ${isActive ? "text-[#5C3FFF]" : "text-gray-400"}`}
                        >
                            <IconComponent
                                size={24}
                                className={`transition-all ${isActive ? "text-[#5C3FFF]" : "text-gray-400"}`}
                            />
                            <div className={`h-1 w-6 rounded-full mt-1 ${isActive ? "bg-[#5C3FFF]" : "bg-transparent"}`}></div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default Footer;