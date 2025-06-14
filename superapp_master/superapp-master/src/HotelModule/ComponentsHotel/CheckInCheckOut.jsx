import React from 'react';
import star from "../../Icons/Star.svg";
import { useState } from 'react';

const dates = [
    { day: "Today", date: "10 Nov" },
    { day: "Mon", date: "11 Nov" },
    { day: "Tue", date: "12 Nov" },
    { day: "Wed", date: "13 Nov" },
];

const checkoutDates = [
    { day: "Sun", date: "4 Dec" },
    { day: "Mon", date: "5 Dec" },
    { day: "Tue", date: "6 Dec" },
    { day: "Wed", date: "7 Dec" },
];

function CheckInCheckOut({openGuests}) {
    const [checkIn, setCheckIn] = useState(dates[0].date);
    const [checkOut, setCheckOut] = useState(checkoutDates[0].date);
    return (
        <div>
            <div className="pb-32 px-4 mt-4">
                <div className="flex justify-between items-center pt-4">
                    <span className="text-sm text-[#1FA300] font-medium">20% off</span>
                    <div className="flex items-center">
                        <img src={star} alt="star" className="w-3 h-3" />
                        <span className="text-xs font-medium ml-1 ">4.8<span className="text-sm font-medium text-[#AEACAC]">(107 reviews)</span></span>
                    </div>
                </div>
                {/* Hotel Info */}
                <div className=" pt-2 flex justify-between items-center pb-4">
                    <div>
                        <h2 className="text-xl font-medium">Hotel Galaxy</h2>
                        <p className="text-[#AEACAC] text-[15px] font-medium">New York, USA</p>
                    </div>

                </div>
                <hr />

                {/* Check-in and Check-out */}
                <h2 className="text-[#AEACAC] text-lg mb-1 mt-2 font-medium">Book Hotel</h2>

                {/* Check-In Section */}
                <h3 className="text-lg font-medium">Check in</h3>
                <div className="flex gap-2 mt-2">
                    {dates.map(({ day, date }) => (
                        <button
                            key={date}
                            className={`w-[76px] h-[43px] text-sm rounded-full ${checkIn === date ? "bg-[#5C3FFF]" : "bg-[#E4E2E26B]"
                                }`}
                            onClick={() => setCheckIn(date)}
                        >
                            <span className={`block font-medium text-xs ${checkIn === date ? "text-white" : "text-[#AEACAC]"
                                }`}>{day}</span>
                            <span className={`font-medium text-sm ${checkIn === date ? "text-white" : "text-black"
                                }`}>{date}</span>
                        </button>
                    ))}
                </div>

                {/* Check-Out Section */}
                <h3 className="text-black font-semibold mt-4">Check out</h3>
                <div className="flex gap-2 mt-2">
                    {checkoutDates.map(({ day, date }) => (
                        <button
                            key={date}
                            className={`w-[76px] h-[43px] text-sm rounded-full ${checkOut === date ? "bg-[#5C3FFF]" : "bg-[#E4E2E26B]"
                                }`}
                            onClick={() => setCheckOut(date)}
                        >
                            <span className={`block font-medium text-xs ${checkOut === date ? "text-white" : "text-[#AEACAC]"
                                }`}>{day}</span>
                            <span className={`font-medium text-sm ${checkOut === date ? "text-white" : "text-black"
                                }`}>{date}</span>
                        </button>
                    ))}
                </div>

                {/* Review Input */}
                <p className="mt-6 font-medium text-base">Note to Owner</p>
                <textarea
                    className="w-full h-[103px] pl-2 bg-[#F1EDFF] rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-[#5C3FFF]"
                    placeholder="Enter here"
                ></textarea>




            </div>
            <div className="fixed bottom-0 w-full bg-white border-t px-4 pb-12">
                <button
                    onClick={openGuests}
                    className="w-full mt-4 bg-[#5C3FFF] text-white py-2 rounded-full text-lg font-medium">
                    Continue
                </button>


            </div>
        </div>
    )
}
export default CheckInCheckOut;