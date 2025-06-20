import React, { useEffect, useState } from 'react';
import groceryService from '../../../services/groceryService';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import API_CONFIG from '../../../config/api.config';

const GroceryTable = () => {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    setLoading(true);
    try {
      const response = await groceryService.getAllGroceries();
      if (response.success) {
        setGroceries(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch groceries');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grocery item?')) {
      try {
        await groceryService.deleteGrocery(id);
        toast.success('Grocery deleted successfully');
        fetchGroceries(); // Re-fetch to update the list
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete grocery');
      }
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Grocery Management</h1>
        <Link to="/admin/groceries/new" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FaPlus className="mr-2" /> Add New Grocery
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-8">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groceries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No groceries found.</td>
                </tr>
              ) : (
                groceries.map((grocery) => (
                  <tr key={grocery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={grocery.image ? `${API_CONFIG.BASE_URL}${grocery.image}` : 'https://via.placeholder.com/64'}
                        alt={grocery.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{grocery.name}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <div>Original: ${grocery.original_price}</div>
                      <div>Discount: ${grocery.discounted_price}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{grocery.category}</td>
                    <td className="px-6 py-4">
                      {grocery.status ? (
                        <FaCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <FaTimesCircle className="text-red-500 text-xl" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <Link to={`/admin/groceries/edit/${grocery.id}`} className="text-blue-600 hover:text-blue-900">
                          <FaEdit className="text-lg" />
                        </Link>
                        <button onClick={() => handleDelete(grocery.id)} className="text-red-600 hover:text-red-900">
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GroceryTable; 