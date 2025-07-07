import React, { useEffect, useState } from 'react';
import taxiService from '../../../services/taxiService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const TaxiDriverTable = () => {
  const [taxiDrivers, setTaxiDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaxiDrivers = async () => {
      try {
        const response = await taxiService.getAllTaxiDrivers();
        if (response.success) {
          setTaxiDrivers(response.data);
        } else {
          setError(response.message || 'Failed to fetch taxi drivers');
          toast.error(response.message || 'Failed to fetch taxi drivers');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch taxi drivers';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxiDrivers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this taxi driver?')) {
      try {
        const response = await taxiService.deleteTaxiDriver(id);
        if (response.success) {
          setTaxiDrivers(taxiDrivers.filter(driver => driver.id !== id));
          toast.success('Taxi driver deleted successfully');
        } else {
          toast.error(response.message || 'Failed to delete taxi driver');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete taxi driver');
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'inactive': return 'Inactive';
      case 'active': return 'Active';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
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
        <h2 className="text-2xl font-bold">Taxi Drivers</h2>
        <Link to="/admin/taxi-drivers/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Taxi Driver
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">License No</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxiDrivers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No taxi drivers found</td>
              </tr>
            ) : (
              taxiDrivers.map((driver) => (
                <tr key={driver.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">{driver.name}</td>
                  <td className="px-4 py-2 border">{driver.phone}</td>
                  <td className="px-4 py-2 border">{driver.license_number}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                      {getStatusText(driver.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{formatDate(driver.createdAt || driver.created_at)}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <Link 
                      to={`/admin/taxi-drivers/edit/${driver.id}`} 
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(driver.id)}
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

export default TaxiDriverTable; 