import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaCog } from 'react-icons/fa';
import { Tooltip, IconButton } from '@material-tailwind/react';
import HotelService from './HotelService';
import API_CONFIG from '../../../config/api.config';

function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.BASE_URL}${path}`;
}

function HotelList() {
  console.log('HotelList mounted');
  const [hotels, setHotels] = useState([]);
  const [roomPrices, setRoomPrices] = useState({}); // { hotelId: minPrice }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching hotels...');
    setLoading(true);
    setError(null);
    HotelService.getAllHotels()
      .then(async (data) => {
        setHotels(data);
        // Fetch room prices for each hotel
        const prices = {};
        await Promise.all(
          data.map(async (hotel) => {
            try {
              const rooms = await HotelService.getRoomsForHotel(hotel._id || hotel.id);
              if (rooms && rooms.length > 0) {
                const minPrice = Math.min(...rooms.map(r => r.price_per_night || 0));
                prices[hotel._id || hotel.id] = minPrice;
              } else {
                prices[hotel._id || hotel.id] = null;
              }
            } catch {
              prices[hotel._id || hotel.id] = null;
            }
          })
        );
        setRoomPrices(prices);
      })
      .catch((err) => {
        console.log('Error fetching hotels:', err);
        setError('Failed to fetch hotels');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hotel Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/admin/hotels/new')}
        >
          + Add Hotel
        </button>
      </div>
      {loading && <div>Loading hotels...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && hotels.length === 0 && (
        <div>No hotels found.</div>
      )}
      {!loading && !error && hotels.length > 0 && (
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Amenities</th>
              <th className="py-2 px-4 border-b">Policies</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => {
              const hotelId = hotel._id || hotel.id;
              const price = roomPrices[hotelId];
              return (
                <tr key={hotelId} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {hotel.main_image ? (
                      <img
                        src={getImageUrl(hotel.main_image)}
                        alt={hotel.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-4">{hotel.name}</td>
                  <td className="py-2 px-4">{hotel.address?.city || hotel.address || '-'}</td>
                  <td className="py-2 px-4">
                    {hotel.amenities && hotel.amenities.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={amenity._id || index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {amenity.name}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No amenities</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {hotel.policies && hotel.policies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {hotel.policies.slice(0, 3).map((policy, index) => (
                          <span
                            key={policy._id || index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {policy.title}
                          </span>
                        ))}
                        {hotel.policies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{hotel.policies.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No policies</span>
                    )}
                  </td>
                  <td className="py-2 px-4 font-semibold">
                    {price === undefined ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : price === null ? (
                      <span className="text-gray-400">No rooms</span>
                    ) : (
                      <span>From ₹{price}/night</span>
                    )}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <Tooltip content="Edit Hotel">
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={() => navigate(`/admin/hotels/edit/${hotelId}`)}
                      >
                        <FaEdit className="text-lg" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Manage Rooms">
                      <IconButton
                        variant="text"
                        color="indigo"
                        onClick={() => navigate(`/admin/hotels/${hotelId}/rooms`)}
                      >
                        <FaCog className="text-lg" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HotelList; 