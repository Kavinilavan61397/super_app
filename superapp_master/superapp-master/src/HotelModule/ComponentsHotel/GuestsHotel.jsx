import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuestsHotel = ({ closeGuests }) => {
    const navigate = useNavigate();
    const [guests, setGuests] = useState({
        adults: 1,
        children: 1,
        infants: 1,
    });

    const handleIncrement = (type) => {
        setGuests((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    };

    const handleDecrement = (type) => {
        setGuests((prev) => ({
            ...prev,
            [type]: prev[type] > 0 ? prev[type] - 1 : 0,
        }));
    };

    return (

        <div className="bg-white rounded-2xl p-4 ">
            <h2 className="text-center text-base font-semibold mb-4">Select Guest</h2>

            {[
                { label: "Adults", sub: "Ages 18 or Above", key: "adults" },
                { label: "Children", sub: "Ages 2-17", key: "children" },
                { label: "Infants", sub: "Under Ages 2", key: "infants" },
            ].map(({ label, sub, key }) => (
                <div key={key} className="flex justify-between items-center mb-4">
                    <div>
                        <div className="text-base font-semibold">{label}</div>
                        <div className="text-sm text-[#999999] font-semibold">{sub}</div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => handleDecrement(key)}
                            className="h-[23px] w-[23px] bg-gray-200 rounded text-lg flex items-center justify-center"
                        >
                            –
                        </button>

                        <span className="mx-3">{guests[key]}</span>
                        <button
                            onClick={() => handleIncrement(key)}
                            className="h-[23px] w-[23px] bg-[#5C3FFF] text-white rounded text-lg flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={()=> navigate("/home-hotel/total-rooms")}
                className="w-full bg-[#5C3FFF] text-white py-2 rounded-full mt-4">
                Continue
            </button>
        </div>

    );
};

export default GuestsHotel;
