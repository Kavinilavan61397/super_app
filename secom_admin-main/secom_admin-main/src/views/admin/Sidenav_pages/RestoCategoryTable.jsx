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
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { restaurantCategoryService } from '../../../services/restaurantService';
import API_CONFIG from '../../../config/api.config';
import { toast } from 'react-toastify';

const RestoCategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await restaurantCategoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteDialog.category) return;
    try {
      await restaurantCategoryService.delete(deleteDialog.category.id);
      toast.success('Category deleted successfully');
      fetchCategories();
      setDeleteDialog({ open: false, category: null });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && category.status) ||
                         (statusFilter === 'inactive' && !category.status);
    return matchesSearch && matchesStatus;
  });

  // Navigate to add/edit form
  const navigateToForm = (category = null) => {
    const path = category ? `/admin/restocategory/edit/${category.id}` : '/admin/restocategory/new';
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading categories...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-5xl shadow-lg p-2">
        <CardHeader variant="gradient" color="blue" className="mb-4 p-4 rounded-t-lg">
          <Typography variant="h5" color="white">
            Restaurant Categories
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-blue-gray-50 bg-blue-gray-50/30 rounded-t-lg">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-gray-400" />
                <Input
                  type="text"
                  placeholder="Search categories..."
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
                Add Category
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-b-lg shadow-inner">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Image
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Description
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Status
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, key) => (
                  <tr key={key} className="hover:bg-blue-gray-50 transition-colors">
                    <td className="py-3 px-6">
                      {category.image ? (
                        <img
                          src={`${API_CONFIG.BASE_URL}${category.image}`}
                          alt={category.name}
                          className="h-10 w-10 rounded-lg object-cover border border-blue-gray-100"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-blue-gray-100 flex items-center justify-center border border-blue-gray-100">
                          <Typography variant="small" className="text-blue-gray-400">
                            No Image
                          </Typography>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {category.name}
                      </Typography>
                    </td>
                    <td className="py-3 px-6">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {category.description || 'No description'}
                      </Typography>
                    </td>
                    <td className="py-3 px-6">
                      <Chip
                        variant="ghost"
                        size="sm"
                        value={category.status ? 'Active' : 'Inactive'}
                        color={category.status ? 'green' : 'red'}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-2">
                        <Tooltip content="Edit Category">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => navigateToForm(category)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete Category">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => setDeleteDialog({ open: true, category })}
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

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 bg-blue-gray-50 rounded-b-lg">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                No categories found
              </Typography>
              <Typography variant="small" color="blue-gray">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first category'}
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} handler={() => setDeleteDialog({ open: false, category: null })}>
        <DialogHeader>Delete Category</DialogHeader>
        <DialogBody>
          Are you sure you want to delete "{deleteDialog.category?.name}"? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setDeleteDialog({ open: false, category: null })}
            className="mr-1"
          >
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

export default RestoCategoryTable; 