import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  IconButton,
  Tooltip,
} from '@material-tailwind/react';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { restaurantService } from '../../../services/restaurantService';
import API_CONFIG from '../../../config/api.config';
import { toast } from 'react-toastify';

const RestaurantTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, restaurant: null });
  const [statusFilter, setStatusFilter] = useState('active'); // 'all', 'active', 'inactive'

  // Fetch restaurants
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteDialog.restaurant) return;
    try {
      await restaurantService.delete(deleteDialog.restaurant.id);
      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
      setDeleteDialog({ open: false, restaurant: null });
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast.error('Failed to delete restaurant');
    }
  };

  // Filter and sort restaurants
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      if (statusFilter === 'active') return restaurant.status === true;
      if (statusFilter === 'inactive') return restaurant.status === false;
      return true; // 'all'
    })
    .filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Navigate to add/edit form
  const navigateToForm = (restaurant = null) => {
    const path = restaurant ? `/admin/restaurant/edit/${restaurant.id}` : '/admin/restaurant/new';
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading restaurants...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-5xl shadow-lg p-2">
        <CardHeader variant="filled" color="blue" className="mb-4 p-4 rounded-t-lg">
          <Typography variant="h5" color="white">
            Restaurants
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          {/* Search and Add Button */}
          <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-blue-gray-50 bg-blue-gray-50/30 rounded-t-lg">
            <div className="flex-1 flex gap-2 items-center">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-gray-400" />
                <Input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  labelProps={{ className: "hidden" }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-blue-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => navigateToForm()}
            >
              <PlusIcon className="h-4 w-4" />
              Add Restaurant
            </Button>
          </div>

          {/* Table with fixed header and scrollable tbody */}
          <div className="bg-white rounded-b-lg shadow-inner">
            <table className="w-full min-w-[800px] table-fixed">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-20">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Image
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-40">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-56">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Address
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-40">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Category
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-28">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Status
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-28">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
            </table>
            <div className="h-[400px] overflow-y-auto">
              <table className="w-full min-w-[800px] table-fixed">
                <tbody>
                  {filteredRestaurants.map((restaurant, key) => (
                    <tr key={key} className="hover:bg-blue-gray-50 transition-colors">
                      <td className="py-3 px-6 w-20">
                        {restaurant.image ? (
                          <img
                            src={`${API_CONFIG.BASE_URL}${restaurant.image}`}
                            alt={restaurant.name}
                            className="h-16 w-16 rounded-lg object-cover border border-blue-gray-100"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-blue-gray-100 flex items-center justify-center border border-blue-gray-100">
                            <Typography variant="small" className="text-blue-gray-400">
                              No Image
                            </Typography>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-6 w-40">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {restaurant.name}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 w-56">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {restaurant.address || 'No address'}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 w-40">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {restaurant.category?.name || 'No category'}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 w-28 align-middle">
                        <span className={
                          `inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full
                          ${restaurant.status === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          leading-tight min-w-[56px] h-6`
                        }>
                          {restaurant.status === true ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-6 w-28">
                        <div className="flex gap-2">
                          <Tooltip content="Edit Restaurant">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => navigateToForm(restaurant)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip content="Delete Restaurant">
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => setDeleteDialog({ open: true, restaurant })}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardBody>
      </Card>
      {/* Delete Confirmation Dialog (to be implemented) */}
    </div>
  );
};

export default RestaurantTable; 