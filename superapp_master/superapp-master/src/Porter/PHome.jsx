import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterNav from '../Porter/Footer';
const vehicleOptions = [
  { type: "Bike", rate: 50 },
  { type: "Auto", rate: 100 },
  { type: "Mini-Truck", rate: 500 },
];

const ORS_API_KEY = "5b3ce3597851110001cf624868c9d5de5db640d48ffb6975cb64e142";

function LocationAutocomplete({ label, value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (text) => {
    if (!text) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=${ORS_API_KEY}&text=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (e) {
      setSuggestions([]);
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      <label className="block font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={e => {
          onChange(e.target.value);
          fetchSuggestions(e.target.value);
          setShowDropdown(true);
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder={label}
        autoComplete="off"
        required
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-20 bg-white border border-gray-200 w-full mt-1 rounded shadow max-h-48 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              onMouseDown={() => {
                onChange(s.properties.label);
                onSelect && onSelect(s);
                setShowDropdown(false);
              }}
            >
              {s.properties.label}
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="absolute right-2 top-2 text-xs text-gray-400">Loading...</div>}
    </div>
  );
}

const PHome = () => {
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [drop, setDrop] = useState("");
  const [dropCoords, setDropCoords] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [distance, setDistance] = useState(null); // in km
  const [fare, setFare] = useState(null);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const navigate = useNavigate();

  // Fetch distance when both pickup and drop coordinates are set
  React.useEffect(() => {
    const fetchDistance = async () => {
      if (!pickupCoords || !dropCoords) {
        setDistance(null);
        setFare(null);
        return;
      }
      setLoadingDistance(true);
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${pickupCoords[0]},${pickupCoords[1]}&end=${dropCoords[0]},${dropCoords[1]}`
        );
        const data = await res.json();
        const meters = data?.features?.[0]?.properties?.segments?.[0]?.distance || 0;
        const km = meters / 1000;
        setDistance(km);
      } catch (e) {
        setDistance(null);
      }
      setLoadingDistance(false);
    };
    fetchDistance();
  }, [pickupCoords, dropCoords]);

  // Calculate fare when distance or vehicle changes
  React.useEffect(() => {
    if (distance && vehicle) {
      setFare(Math.ceil(distance) * vehicle.rate);
    } else {
      setFare(null);
    }
  }, [distance, vehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const bookedAt = now.toLocaleString();
    const bookingId = Date.now(); // or use a better unique ID generator
    const bookingDetails = {
      bookingId, // <-- add this line
      pickup,
      drop,
      vehicleType: vehicle?.type,
      distance: distance ? Number(distance.toFixed(2)) : null,
      fare,
      status: "Pending",
      bookedAt,
    };
    navigate('/porter/tracking', { state: bookingDetails });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <img
        src="https://dom-website-prod-cdn-cms.porter.in/Desktop_2_5fd0d00dd3.webp"
        alt="Banner"
        className="w-full object-cover h-64"
      />

      <div className="max-w-md mx-auto p-4 bg-white mt-[-40px] rounded-2xl shadow-lg relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Book Your Delivery
        </h2>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pickup Location */}
          <LocationAutocomplete
            label="Pickup Location"
            value={pickup}
            onChange={setPickup}
            onSelect={feature => setPickupCoords(feature.geometry.coordinates)}
          />

          {/* Drop Location */}
          <LocationAutocomplete
            label="Drop Location"
            value={drop}
            onChange={setDrop}
            onSelect={feature => setDropCoords(feature.geometry.coordinates)}
          />

          {/* Vehicle Selection */}
          <div>
            <label className="block font-medium mb-1">Select Vehicle</label>
            <div className="flex gap-2">
              {vehicleOptions.map((v, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setVehicle(v)}
                  className={`px-4 py-2 border rounded transition-colors duration-150 ${
                    vehicle?.type === v.type
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 border-gray-300 text-gray-700"
                  }`}
                >
                  {v.type}
                </button>
              ))}
            </div>
          </div>

          {/* Distance & Fare Estimate */}
          <div>
            <label className="block font-medium mb-1">Distance & Estimated Fare</label>
            <div className="text-lg font-semibold">
              {loadingDistance && "Calculating..."}
              {!loadingDistance && distance && vehicle && (
                <>
                  {distance.toFixed(2)} km &nbsp;|&nbsp; ₹{fare}
                </>
              )}
              {!loadingDistance && (!distance || !vehicle) && "-"}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            disabled={!pickupCoords || !dropCoords || !vehicle || loadingDistance}
          >
            Continue Booking
          </button>
        </form>
      </div>
      <FooterNav />
    </div>
  );
};

export default PHome;