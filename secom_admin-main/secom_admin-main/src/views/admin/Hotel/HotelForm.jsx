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
import HotelService from './HotelService';
import API_CONFIG from '../../../config/api.config';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import classNames from 'classnames';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PolicyService from '../../../services/policyService';
import LocationService from '../../../services/locationService';

// Validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required('Hotel name is required').min(2, 'Hotel name must be at least 2 characters'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().required('Country is required'),
  description: yup.string().optional(),
  status: yup.boolean(),
});

const HotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    description: '',
    status: true,
    policies: [],
    locations: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [policies, setPolicies] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch hotel data for editing
  useEffect(() => {
    if (isEditMode) {
      fetchHotel();
    }
    fetchDropdownData();
  }, [id, isEditMode]);

  const fetchDropdownData = async () => {
    try {
      const [policiesRes, locationsRes] = await Promise.all([
        PolicyService.getActivePolicies(),
        LocationService.getActiveLocations()
      ]);
      
      setPolicies(policiesRes.data.data || []);
      setLocations(locationsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast.error('Failed to fetch dropdown data');
    }
  };

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await HotelService.getHotelById(id);
      const hotel = response.data.data; // Backend returns { success: true, data: hotel }
      setFormData({
        name: hotel.name || '',
        address: hotel.address || '',
        city: hotel.city || '',
        state: hotel.state || '',
        country: hotel.country || '',
        description: hotel.description || '',
        status: hotel.status !== undefined ? hotel.status : true,
        policies: hotel.policies?.map(p => p.id) || [],
        locations: hotel.locations?.map(l => l.id) || [],
      });
      if (hotel.main_image) {
        setImagePreview(`${API_CONFIG.BASE_URL}${hotel.main_image}`);
      }
    } catch (error) {
      console.error('Error fetching hotel:', error);
      toast.error('Failed to fetch hotel details');
      navigate('/admin/hotel');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      
      // Append arrays
      formData.policies.forEach(policyId => {
        formDataToSend.append('policies[]', policyId);
      });
      formData.locations.forEach(locationId => {
        formDataToSend.append('locations[]', locationId);
      });
      
      if (imageFile) {
        formDataToSend.append('main_image', imageFile);
      }

      if (isEditMode) {
        await HotelService.updateHotel(id, formDataToSend);
        toast.success('Hotel updated successfully');
      } else {
        await HotelService.createHotel(formDataToSend);
        toast.success('Hotel created successfully');
      }
      
      navigate('/admin/hotel');
    } catch (error) {
      console.error('Error saving hotel:', error);
      toast.error(error.message || 'Failed to save hotel');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading hotel...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-4xl shadow-lg p-2">
        <CardHeader variant="filled" color="blue" className="mb-4 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="white">
              {isEditMode ? 'Edit Hotel' : 'Add Hotel'}
            </Typography>
            <Button
              variant="text"
              color="white"
              className="flex items-center gap-2"
              onClick={() => navigate('/admin/hotel')}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="hotel-name" className="block text-sm font-medium text-blue-gray-700 mb-1">Hotel Name *</label>
                <Input
                  id="hotel-name"
                  type="text"
                  placeholder="Enter hotel name"
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

              {/* Address Field */}
              <div>
                <label htmlFor="hotel-address" className="block text-sm font-medium text-blue-gray-700 mb-1">Address *</label>
                <Input
                  id="hotel-address"
                  type="text"
                  placeholder="Enter hotel address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={!!errors.address}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.address && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.address}
                  </Typography>
                )}
              </div>

              {/* City Field */}
              <div>
                <label htmlFor="hotel-city" className="block text-sm font-medium text-blue-gray-700 mb-1">City *</label>
                <Input
                  id="hotel-city"
                  type="text"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={!!errors.city}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.city && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.city}
                  </Typography>
                )}
              </div>

              {/* State Field */}
              <div>
                <label htmlFor="hotel-state" className="block text-sm font-medium text-blue-gray-700 mb-1">State *</label>
                <Input
                  id="hotel-state"
                  type="text"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  error={!!errors.state}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.state && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.state}
                  </Typography>
                )}
              </div>

              {/* Country Field */}
              <div>
                <label htmlFor="hotel-country" className="block text-sm font-medium text-blue-gray-700 mb-1">Country *</label>
                <Input
                  id="hotel-country"
                  type="text"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  error={!!errors.country}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.country && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.country}
                  </Typography>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="hotel-description" className="block text-sm font-medium text-blue-gray-700 mb-1">Description</label>
              <div className="border border-gray-300 rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Enter hotel description..."
                  className="h-32"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Hotel Image</label>
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

            {/* Policies Selection */}
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Policies</label>
              <select 
                multiple 
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                value={formData.policies}
                onChange={e => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                  handleInputChange('policies', selectedOptions);
                }}
              >
                {policies.map(policy => (
                  <option key={policy.id} value={policy.id}>
                    {policy.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple policies</p>
            </div>

            {/* Locations Selection */}
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Locations</label>
              <select 
                multiple 
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                value={formData.locations}
                onChange={e => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                  handleInputChange('locations', selectedOptions);
                }}
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple locations</p>
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
                {formData.status ? 'Active: Hotel will be visible to users' : 'Inactive: Hotel will be hidden from users'}
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
                {loading ? 'Saving...' : (isEditMode ? 'Update Hotel' : 'Create Hotel')}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="gray"
                onClick={() => navigate('/admin/hotel')}
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

export default HotelForm; 