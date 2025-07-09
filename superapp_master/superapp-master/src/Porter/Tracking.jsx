import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FooterNav from '../Porter/Footer';
import { useNavigate } from "react-router-dom";

const Tracking = () => {
  const location = useLocation();
  const booking = location.state;
  const navigate = useNavigate();

  // Save booking to localStorage on mount
  useEffect(() => {
    if (booking) {
      const stored = localStorage.getItem("porter_bookings");
      let bookings = stored ? JSON.parse(stored) : [];
      // Avoid duplicate if user refreshes
      if (!bookings.some(b => b.bookedAt === booking.bookedAt && b.pickup === booking.pickup && b.drop === booking.drop)) {
        bookings.push(booking);
        localStorage.setItem("porter_bookings", JSON.stringify(bookings));
      }
    }
  }, [booking]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500 text-lg">No booking details found.</div>
      </div>
    );
  }

  function handleSubmit() {
    const id = booking.bookingId || booking.id;
    if (id) {
      navigate(`/porter/live-tracking/${id}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
        <h1 className="text-2xl font-bold text-green-600 text-center mb-2">
          🎉 Booking Confirmed!
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4">
          Your booking has been successfully placed.
        </p>

        <div className="space-y-3 text-gray-700 text-sm">
          <div>
            <span className="font-semibold">📍 Pickup:</span>{" "}
            {booking.pickup}
          </div>
          <div>
            <span className="font-semibold">📍 Drop:</span> {booking.drop}
          </div>
          <div>
            <span className="font-semibold">🚚 Vehicle Type:</span>{" "}
            {booking.vehicleType}
          </div>
          <div>
            <span className="font-semibold">📏 Distance:</span>{" "}
            {booking.distance} km
          </div>
          <div>
            <span className="font-semibold">💰 Fare:</span> ₹{booking.fare}
          </div>
          <div>
            <span className="font-semibold">⏱️ Status:</span>{" "}
            <span
              className={`font-semibold ${
                booking.status === "Pending"
                  ? "text-yellow-500"
                  : booking.status === "Completed"
                  ? "text-green-600"
                  : "text-blue-500"
              }`}
            >
              {booking.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">📅 Booked At:</span>{" "}
            {booking.bookedAt}
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
            disabled={!booking.bookingId && !booking.id}
          >
            🔄 Live Tracking
          </button>
        </div>
      </div>
      <FooterNav/>
    </div>
  );
};

export default Tracking;
