import React, { useEffect, useState } from "react";
import FooterNav from '../Porter/Footer';
const Booking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Retrieve bookings from localStorage
    const stored = localStorage.getItem("porter_bookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">
          🚚 Porter Booking History
        </h1>
        {bookings.length === 0 ? (
          <div className="text-center text-gray-500">No bookings found.</div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, idx) => (
              <div key={idx} className="border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
                <div className="font-semibold text-sm text-gray-700 mb-1">
                  {booking.bookedAt}
                </div>
                <div className="text-sm text-gray-700">
                  <div><span className="font-semibold">Pickup:</span> {booking.pickup}</div>
                  <div><span className="font-semibold">Drop:</span> {booking.drop}</div>
                  <div><span className="font-semibold">Vehicle:</span> {booking.vehicleType}</div>
                  <div><span className="font-semibold">Distance:</span> {booking.distance} km</div>
                  <div><span className="font-semibold">Fare:</span> ₹{booking.fare}</div>
                  <div><span className="font-semibold">Status:</span> {booking.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FooterNav/>
    </div>
  );
};

export default Booking;
