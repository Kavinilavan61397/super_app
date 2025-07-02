import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import HotelService from './HotelService';
import API_CONFIG from '../../../config/api.config';
import { toast } from 'react-toastify';

const HotelTable = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, hotel: null });

  // Fetch hotels
  const fetchHotels = async () => {
    try {
      setLoading(true);
      console.log('Fetching hotels...');
      const response = await HotelService.getAllHotels();
      console.log('Hotels fetched successfully:', response);
      setHotels(response.data.data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteDialog.hotel) return;
    try {
      await HotelService.deleteHotel(deleteDialog.hotel.id);
      toast.success('Hotel deleted successfully');
      fetchHotels();
      setDeleteDialog({ open: false, hotel: null });
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  };

  // Filter hotels
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && hotel.status) ||
                         (statusFilter === 'inactive' && !hotel.status);
    return matchesSearch && matchesStatus;
  });

  // Navigate to add/edit form
  const navigateToForm = (hotel = null) => {
    const path = hotel ? `/admin/hotel/edit/${hotel.id}` : '/admin/hotel/new';
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading hotels...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-7xl shadow-lg p-2">
        <CardHeader variant="text" color="blue" className="mb-4 p-4 rounded-t-lg">
          <Typography variant="h5" color="white">
            Hotels
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-blue-gray-50 bg-blue-gray-50/30 rounded-t-lg">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-gray-400" />
                <Input
                  type="text"
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  labelProps={{ className: "hidden" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-blue-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button
                color="blue"
                className="flex items-center gap-2"
                onClick={() => navigateToForm()}
              >
                <PlusIcon className="h-4 w-4" />
                Add Hotel
              </Button>
            </div>
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
                      City/State
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-28">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Status
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-32">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Policies
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-32">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Locations
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left w-24">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.map((hotel, key) => (
                  <tr key={key} className="hover:bg-blue-gray-50 transition-colors">
                    <td className="py-3 px-6 w-20">
                      {hotel.main_image ? (
                        <img
                          src={`${API_CONFIG.BASE_URL}${hotel.main_image}`}
                          alt={hotel.name}
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
                        {hotel.name}
                      </Typography>
                    </td>
                    <td className="py-3 px-6 w-56">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {hotel.address || 'No address'}
                      </Typography>
                    </td>
                    <td className="py-3 px-6 w-40">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {hotel.city}, {hotel.state}
                      </Typography>
                    </td>
                    <td className="py-3 px-6 w-28 align-middle">
                      <span className={
                        `inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full
                        ${hotel.status === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        leading-tight min-w-[56px] h-6`
                      }>
                        {hotel.status === true ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-6 w-32">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {hotel.policies && hotel.policies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {hotel.policies.slice(0, 2).map(policy => (
                              <span key={policy.id} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {policy.title}
                              </span>
                            ))}
                            {hotel.policies.length > 2 && (
                              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                +{hotel.policies.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </Typography>
                    </td>
                    <td className="py-3 px-6 w-32">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {hotel.locations && hotel.locations.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {hotel.locations.slice(0, 2).map(location => (
                              <span key={location.id} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                {location.name}
                              </span>
                            ))}
                            {hotel.locations.length > 2 && (
                              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                +{hotel.locations.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </Typography>
                    </td>
                    <td className="py-3 px-6 w-24">
                      <div className="flex gap-2">
                        <Tooltip content="Edit Hotel">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => navigateToForm(hotel)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete Hotel">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => setDeleteDialog({ open: true, hotel })}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} handler={() => setDeleteDialog({ open: false, hotel: null })}>
        <DialogHeader className="flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
          <Typography variant="h5">Delete Hotel</Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="gray">
            Are you sure you want to delete "{deleteDialog.hotel?.name}"? This action cannot be undone.
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={() => setDeleteDialog({ open: false, hotel: null })}>
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default HotelTable; 