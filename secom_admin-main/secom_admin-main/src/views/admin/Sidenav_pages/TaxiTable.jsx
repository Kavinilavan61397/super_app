import React, { useEffect, useState } from 'react';
import taxiService from '../../../services/taxiService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const TaxiTable = () => {
  const [taxiRides, setTaxiRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaxiRides = async () => {
      try {
        const response = await taxiService.getAllTaxiRides();
        if (response.success) {
          setTaxiRides(response.data);
        } else {
          setError(response.message || 'Failed to fetch taxi rides');
          toast.error(response.message || 'Failed to fetch taxi rides');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch taxi rides';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxiRides();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this taxi ride?')) {
      try {
        const response = await taxiService.deleteTaxiRide(id);
        if (response.success) {
          setTaxiRides(taxiRides.filter(ride => ride.id !== id));
          toast.success('Taxi ride deleted successfully');
        } else {
          toast.error(response.message || 'Failed to delete taxi ride');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete taxi ride');
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Requested';
      case 1: return 'Accepted';
      case 2: return 'Started';
      case 3: return 'Completed';
      case 4: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-gray-100 text-gray-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Taxi Rides</h2>
        <Link to="/admin/taxi-rides/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Taxi Ride
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Driver</th>
              <th className="px-4 py-2 border">Vehicle</th>
              <th className="px-4 py-2 border">Pickup Location</th>
              <th className="px-4 py-2 border">Dropoff Location</th>
              <th className="px-4 py-2 border">Fare</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Requested At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxiRides.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-4 py-2 text-center text-gray-500">No taxi rides found</td>
              </tr>
            ) : (
              taxiRides.map((ride) => (
                <tr key={ride.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">{ride.id}</td>
                  <td className="px-4 py-2 border">
                    {ride.user ? `${ride.user.first_name} ${ride.user.last_name}` : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    {ride.driver ? ride.driver.name : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">
                    {ride.vehicle ? `${ride.vehicle.make} ${ride.vehicle.model}` : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border">{ride.pickup_location}</td>
                  <td className="px-4 py-2 border">{ride.dropoff_location}</td>
                  <td className="px-4 py-2 border">${ride.fare}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                      {getStatusText(ride.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{formatDate(ride.requested_at)}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <Link 
                      to={`/admin/taxi-rides/edit/${ride.id}`} 
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(ride.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxiTable; 