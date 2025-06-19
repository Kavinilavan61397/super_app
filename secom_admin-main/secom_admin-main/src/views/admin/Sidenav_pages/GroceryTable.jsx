import React, { useEffect, useState } from 'react';
import groceryService from '../../../services/groceryService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const GroceryTable = () => {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const response = await groceryService.getAllGroceries();
        if (response.success) {
          setGroceries(response.data);
        } else {
          setError(response.message || 'Failed to fetch groceries');
          toast.error(response.message || 'Failed to fetch groceries');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch groceries';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchGroceries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grocery item?')) {
      try {
        const response = await groceryService.deleteGrocery(id);
        if (response.success) {
          setGroceries(groceries.filter(grocery => grocery.id !== id));
          toast.success('Grocery deleted successfully');
        } else {
          toast.error(response.message || 'Failed to delete grocery');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete grocery');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Grocery List</h2>
        <Link to="/admin/groceries/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Grocery</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Original Price</th>
              <th className="px-4 py-2 border">Discounted Price</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groceries.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-2 text-center text-gray-500">No groceries found</td>
              </tr>
            ) : (
              groceries.map((grocery) => (
                <tr key={grocery.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {grocery.image ? (
                      <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${grocery.image}`} 
                        alt={grocery.name} 
                        className="w-16 h-16 object-cover rounded" 
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">{grocery.name}</td>
                  <td className="px-4 py-2 border">{grocery.description}</td>
                  <td className="px-4 py-2 border">{grocery.original_price}</td>
                  <td className="px-4 py-2 border">{grocery.discounted_price}</td>
                  <td className="px-4 py-2 border">{grocery.quantity}</td>
                  <td className="px-4 py-2 border">{grocery.category}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <Link 
                      to={`/admin/groceries/edit/${grocery.id}`} 
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(grocery.id)}
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

export default GroceryTable; 