import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Switch,
} from '@material-tailwind/react';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { restaurantCategoryService } from '../../../services/restaurantService';
import API_CONFIG from '../../../config/api.config';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import classNames from 'classnames';

// Validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  slug: yup.string().required('Slug is required').matches(/^[-a-z0-9]+$/, 'Slug must be URL-friendly (lowercase, hyphens, no spaces)'),
  description: yup.string().optional(),
  status: yup.boolean(),
});

// Slug generator function
const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

const RestoCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch category data for editing
  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id, isEditMode]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const category = await restaurantCategoryService.getById(id);
      setFormData({
        name: category.name || '',
        slug: category.slug || generateSlug(category.name || ''),
        description: category.description || '',
        status: category.status !== undefined ? category.status : true,
      });
      if (category.image) {
        setImagePreview(`${API_CONFIG.BASE_URL}${category.image}`);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to fetch category details');
      navigate('/admin/restocategory');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: prev.slug ? prev.slug : generateSlug(value),
      }));
    } else if (field === 'slug') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Validate form
  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', formData.slug); // Add slug
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (isEditMode) {
        await restaurantCategoryService.update(id, formDataToSend);
        toast.success('Category updated successfully');
      } else {
        await restaurantCategoryService.create(formDataToSend);
        toast.success('Category created successfully');
      }
      
      navigate('/admin/restocategory');
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading category...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-2xl shadow-lg p-2">
        <CardHeader variant="filled" color="blue" className="mb-4 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="white">
              {isEditMode ? 'Edit Restaurant Category' : 'Add Restaurant Category'}
            </Typography>
            <Button
              variant="text"
              color="white"
              className="flex items-center gap-2"
              onClick={() => navigate('/admin/restocategory')}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {/* Back */}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="category-name" className="block text-sm font-medium text-blue-gray-700 mb-1">Category Name *</label>
              <Input
                id="category-name"
                type="text"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                labelProps={{ className: "hidden" }}
                containerProps={{ className: "min-w-[100px]" }}
              />
              {errors.name && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.name}
                </Typography>
              )}
            </div>

            {/* Slug Field */}
            <div>
              <label htmlFor="category-slug" className="block text-sm font-medium text-blue-gray-700 mb-1">Slug *</label>
              <Input
                id="category-slug"
                type="text"
                placeholder="Auto-generated from name, or edit manually"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                error={!!errors.slug}
                className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                labelProps={{ className: "hidden" }}
                containerProps={{ className: "min-w-[100px]" }}
              />
              {errors.slug && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.slug}
                </Typography>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="category-description" className="block text-sm font-medium text-blue-gray-700 mb-1">Description</label>
              <Textarea
                id="category-description"
                placeholder="Enter a short description (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                labelProps={{ className: "hidden" }}
                containerProps={{ className: "min-w-[100px]" }}
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Category Image</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <PhotoIcon className="h-4 w-4" />
                    {imageFile || imagePreview ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
                {(imageFile || imagePreview) && (
                  <Button
                    variant="text"
                    color="red"
                    onClick={removeImage}
                    className="flex items-center gap-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Status Field */}
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                aria-pressed={!!formData.status}
                onClick={() => handleInputChange('status', !formData.status)}
                className={classNames(
                  'relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none',
                  formData.status ? 'bg-blue-600' : 'bg-gray-300'
                )}
                style={{ minWidth: 48 }}
              >
                <span
                  className={classNames(
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                    formData.status ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
              <Typography variant="small" color="gray" className="font-normal">
                {formData.status ? 'Active: Category will be visible to users' : 'Inactive: Category will be hidden from users'}
              </Typography>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4 justify-end">
              <Button
                type="submit"
                color="blue"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? 'Saving...' : (isEditMode ? 'Update Category' : 'Create Category')}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="gray"
                onClick={() => navigate('/admin/restocategory')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default RestoCategoryForm; 