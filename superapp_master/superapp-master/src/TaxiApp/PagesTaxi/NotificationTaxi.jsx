import React from 'react'
import banner2 from "../../Images/HomeScreen/banner2.svg";
import FooterTaxi from '../ComponentsTaxi/FooterTaxi';
import HeaderInsideTaxi from '../ComponentsTaxi/HeaderInsideTaxi';

function NotificationTaxi() {
    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <HeaderInsideTaxi />
            <div className='px-4 pt-24 pb-28'>
                <div className='font-medium text-base'>Notification</div>

                <div className="pt-4 flex flex-col items-center w-full h-[120px] rounded-2xl shadow-md cursor-pointer overflow-hidden">
                    <img
                        src={banner2}
                        alt="banner_image"
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>
            </div>
            <FooterTaxi />
        </div>
    )
}
export default NotificationTaxi;