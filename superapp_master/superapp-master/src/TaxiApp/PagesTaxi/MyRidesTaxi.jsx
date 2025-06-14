import React from 'react';
import HeaderInsideTaxi from '../ComponentsTaxi/HeaderInsideTaxi';
import FooterTaxi from '../ComponentsTaxi/FooterTaxi';
import greenLocation from "../ImagesTaxi/gpsgreen.svg";
import stepper from "../../FoodDilvery/ImagesF/stepperfortrackorderfood.svg";

function MyRidesTaxi() {
    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <HeaderInsideTaxi />
            <div className='px-4 pt-24 pb-28'>
                <div className='font-medium text-base'>My Rides</div>
                <div className='bg-white border border-[#E1E1E1] rounded-[20px] p-4 mt-2' >
                    <div className='font-medium text-base'>06 Mar 2024, 11:99</div>
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center space-x-3">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Driver"
                                className="rounded-full"
                                style={{ width: '56px', height: '56px' }}
                            />
                            <div>
                                <h3 className="text-lg font-semibold">Jenny Wilson</h3>
                                <div className='text-[#94A3B8] text-xs font-normal'>At company: 1 year
                                    <br />
                                    Rride: 1000</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                        <img src={stepper} alt="track" className="w-5 h-[97px]" />
                        <div className="h-[97px] flex flex-col justify-between">
                            <div className="">
                                <div className="text-sm font-normal text-[#94A3B8]">Pick-up</div>
                                <div className="text-sm font-medium text-[#475569]">My current location</div>
                            </div>
                            <hr />
                            <div className="">
                                <div className="text-sm font-normal text-[#94A3B8]">Drop off (optional)</div>
                                <div className="text-sm font-medium text-[#475569]">3517 W. Gray St. Utica, Pennsylvania 57867</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "20px" }}>
                        <div className='text-base text-[#1E293B] font-bold'>$7.00</div>
                        <div className="bg-[#5C3FFF] text-white rounded-full px-4 py-2 text-xs font-medium flex items-center justify-center">
                            completed
                        </div>
                    </div>


                </div>

                <div className='bg-white border border-[#E1E1E1] rounded-[20px] p-4 mt-2' >
                    <div className='font-medium text-base'>06 Mar 2024, 11:99</div>
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center space-x-3">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Driver"
                                className="rounded-full"
                                style={{ width: '56px', height: '56px' }}
                            />
                            <div>
                                <h3 className="text-lg font-semibold">Jenny Wilson</h3>
                                <div className='text-[#94A3B8] text-xs font-normal'>At company: 1 year
                                    <br />
                                    Rride: 1000</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                        <img src={stepper} alt="track" className="w-5 h-[97px]" />
                        <div className="h-[97px] flex flex-col justify-between">
                            <div className="">
                                <div className="text-sm font-normal text-[#94A3B8]">Pick-up</div>
                                <div className="text-sm font-medium text-[#475569]">My current location</div>
                            </div>
                            <hr />
                            <div className="">
                                <div className="text-sm font-normal text-[#94A3B8]">Drop off (optional)</div>
                                <div className="text-sm font-medium text-[#475569]">3517 W. Gray St. Utica, Pennsylvania 57867</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "20px" }}>
                        <div className='text-base text-[#1E293B] font-bold'>$7.00</div>
                        <div className="bg-[#FB3E3E] text-white rounded-full px-4 py-2 text-xs font-medium flex items-center justify-center">
                            cancelled
                        </div>
                    </div>


                </div>

            </div>
            <FooterTaxi />
        </div>
    );
}
export default MyRidesTaxi