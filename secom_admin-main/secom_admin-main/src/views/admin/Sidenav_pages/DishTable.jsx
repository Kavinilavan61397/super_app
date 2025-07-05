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
import { dishService } from '../../../services/restaurantService';
import API_CONFIG from '../../../config/api.config';
import { toast } from 'react-toastify';

const DishTable = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, dish: null });
  const [statusFilter, setStatusFilter] = useState('active'); // 'all', 'active', 'inactive'

  // Fetch dishes
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const data = await dishService.getAll();
      console.log('Fetched dishes:', data); // DEBUG LOG
      setDishes(data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast.error('Failed to fetch dishes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteDialog.dish) return;
    try {
      await dishService.delete(deleteDialog.dish.id);
      toast.success('Dish deleted successfully');
      fetchDishes();
      setDeleteDialog({ open: false, dish: null });
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Failed to delete dish');
    }
  };

  // Filter and sort dishes
  const filteredDishes = (Array.isArray(dishes) ? dishes : [])
    .filter((dish) => {
      if (statusFilter === 'active') return dish.status === true;
      if (statusFilter === 'inactive') return dish.status === false;
      return true; // 'all'
    })
    .filter((dish) => {
      const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Navigate to add/edit form
  const navigateToForm = (dish = null) => {
    const path = dish ? `/admin/dish/edit/${dish.id}` : '/admin/dish/new';
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading dishes...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-6xl shadow-lg p-2">
        <CardHeader variant="filled" color="blue" className="mb-4 p-4 rounded-t-lg">
          <Typography variant="h5" color="white">
            Dishes
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
                  placeholder="Search dishes..."
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
              Add Dish
            </Button>
          </div>

          {/* Table with fixed header and scrollable tbody */}
          <div className="bg-white rounded-b-lg shadow-inner">
            <table className="w-full min-w-[900px] table-fixed">
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
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-48">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Description
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-32">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Price
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-40">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Restaurant
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
              <table className="w-full min-w-[900px] table-fixed">
                <tbody>
                  {filteredDishes.map((dish, key) => (
                    <tr key={key} className="hover:bg-blue-gray-50 transition-colors">
                      <td className="py-3 px-6 w-20">
                        {dish.image ? (
                          <img
                            src={`${API_CONFIG.BASE_URL}${dish.image}`}
                            alt={dish.name}
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
                          {dish.name}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 w-48">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {dish.description ? (dish.description.length > 50 ? `${dish.description.substring(0, 50)}...` : dish.description) : 'No description'}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 w-32">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          ${dish.price ? parseFloat(dish.price).toFixed(2) : '0.00'}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 w-40">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {dish.restaurant?.name || 'No restaurant'}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 w-28 align-middle">
                        <span className={
                          `inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full
                          ${dish.status === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          leading-tight min-w-[56px] h-6`
                        }>
                          {dish.status === true ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-6 w-28">
                        <div className="flex gap-2">
                          <Tooltip content="Edit Dish">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => navigateToForm(dish)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip content="Delete Dish">
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => setDeleteDialog({ open: true, dish })}
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

export default DishTable; 