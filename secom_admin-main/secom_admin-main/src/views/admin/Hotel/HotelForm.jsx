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
import AmenityService from '../../../services/amenityService';

// Validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required('Hotel name is required').min(2, 'Hotel name must be at least 2 characters'),
  address: yup.object().shape({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    postal_code: yup.string().optional(),
  }),
  phone: yup.string().optional(),
  email: yup.string().email('Invalid email format').optional(),
  website: yup.string().url('Invalid website URL').optional(),
  description: yup.string().optional(),
  star_rating: yup.number().min(1).max(5).optional(),
  check_in_time: yup.string().optional(),
  check_out_time: yup.string().optional(),
  status: yup.string().oneOf(['active', 'inactive', 'maintenance']),
});

const HotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
    },
    phone: '',
    email: '',
    website: '',
    description: '',
    star_rating: '',
    check_in_time: '14:00',
    check_out_time: '12:00',
    status: 'active',
    policies: [],
    amenities: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [policies, setPolicies] = useState([]);
  const [amenities, setAmenities] = useState([]);

  // Fetch hotel data for editing
  useEffect(() => {
    if (isEditMode) {
      fetchHotel();
    }
    fetchDropdownData();
  }, [id, isEditMode]);

  const fetchDropdownData = async () => {
    try {
      console.log('Calling PolicyService.getActivePolicies');
      const [policiesRes, amenitiesRes] = await Promise.all([
        PolicyService.getActivePolicies(),
        AmenityService.getActiveAmenities()
      ]);
      console.log('Raw policiesRes:', policiesRes);
      console.log('Raw amenitiesRes:', amenitiesRes);

      setPolicies(
        Array.isArray(policiesRes)
          ? policiesRes
          : []
      );
      setAmenities(
        Array.isArray(amenitiesRes.data?.data)
          ? amenitiesRes.data.data
          : Array.isArray(amenitiesRes.data)
          ? amenitiesRes.data
          : []
      );
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast.error('Failed to fetch dropdown data');
    }
  };

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await HotelService.getHotelById(id);
      const hotel = response.data || response;
      
      setFormData({
        name: hotel.name || '',
        address: {
          street: hotel.address?.street || '',
          city: hotel.address?.city || '',
          state: hotel.address?.state || '',
          country: hotel.address?.country || '',
          postal_code: hotel.address?.postal_code || '',
        },
        phone: hotel.phone || '',
        email: hotel.email || '',
        website: hotel.website || '',
        description: hotel.description || '',
        star_rating: hotel.star_rating || '',
        check_in_time: hotel.check_in_time || '14:00',
        check_out_time: hotel.check_out_time || '12:00',
        status: hotel.status || 'active',
        policies: hotel.policies?.map(p => p._id || p.id) || [],
        amenities: hotel.amenities?.map(a => a._id || a.id) || [],
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
    if (field === 'address') {
      setFormData(prev => ({ 
        ...prev, 
        address: { ...prev.address, ...value } 
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle address field changes
  const handleAddressChange = (field, value) => {
    console.log('HotelForm: Address change:', field, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        address: { ...prev.address, [field]: value }
      };
      console.log('HotelForm: Updated form data:', newData);
      return newData;
    });
    // Clear error when user starts typing
    if (errors.address?.[field]) {
      setErrors(prev => ({
        ...prev,
        address: { ...prev.address, [field]: '' }
      }));
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
        if (error.path.includes('.')) {
          const [parent, child] = error.path.split('.');
          if (!newErrors[parent]) newErrors[parent] = {};
          newErrors[parent][child] = error.message;
        } else {
          newErrors[error.path] = error.message;
        }
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
      formDataToSend.append('address[street]', formData.address.street);
      formDataToSend.append('address[city]', formData.address.city);
      formDataToSend.append('address[state]', formData.address.state);
      formDataToSend.append('address[country]', formData.address.country);
      formDataToSend.append('address[postal_code]', formData.address.postal_code);
      
      // Debug logging
      console.log('HotelForm: Form data being sent:');
      console.log('Name:', formData.name);
      console.log('Address:', formData.address);
      console.log('Address street:', formData.address.street);
      console.log('Address city:', formData.address.city);
      console.log('Address state:', formData.address.state);
      console.log('Address country:', formData.address.country);
      console.log('Address postal_code:', formData.address.postal_code);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('star_rating', formData.star_rating);
      formDataToSend.append('check_in_time', formData.check_in_time);
      formDataToSend.append('check_out_time', formData.check_out_time);
      formDataToSend.append('status', formData.status);
      
      // Append arrays
      formData.policies.forEach(policyId => {
        formDataToSend.append('policies[]', policyId);
      });
      formData.amenities.forEach(amenityId => {
        formDataToSend.append('amenities[]', amenityId);
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
      toast.error(error.response?.data?.message || error.message || 'Failed to save hotel');
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log policies and amenities before rendering
  console.log('Policies for dropdown:', policies);
  console.log('Amenities for dropdown:', amenities);

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

              {/* Phone Field */}
              <div>
                <label htmlFor="hotel-phone" className="block text-sm font-medium text-blue-gray-700 mb-1">Phone</label>
                <Input
                  id="hotel-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="hotel-email" className="block text-sm font-medium text-blue-gray-700 mb-1">Email</label>
                <Input
                  id="hotel-email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.email && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.email}
                  </Typography>
                )}
              </div>

              {/* Website Field */}
              <div>
                <label htmlFor="hotel-website" className="block text-sm font-medium text-blue-gray-700 mb-1">Website</label>
                <Input
                  id="hotel-website"
                  type="url"
                  placeholder="Enter website URL"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  error={!!errors.website}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.website && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.website}
                  </Typography>
                )}
              </div>

              {/* Star Rating Field */}
              <div>
                <label htmlFor="hotel-star-rating" className="block text-sm font-medium text-blue-gray-700 mb-1">Star Rating</label>
                <select
                  id="hotel-star-rating"
                  value={formData.star_rating}
                  onChange={(e) => handleInputChange('star_rating', e.target.value)}
                  className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select star rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* Check-in Time Field */}
              <div>
                <label htmlFor="hotel-check-in" className="block text-sm font-medium text-blue-gray-700 mb-1">Check-in Time</label>
                <Input
                  id="hotel-check-in"
                  type="time"
                  value={formData.check_in_time}
                  onChange={(e) => handleInputChange('check_in_time', e.target.value)}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>

              {/* Check-out Time Field */}
              <div>
                <label htmlFor="hotel-check-out" className="block text-sm font-medium text-blue-gray-700 mb-1">Check-out Time</label>
                <Input
                  id="hotel-check-out"
                  type="time"
                  value={formData.check_out_time}
                  onChange={(e) => handleInputChange('check_out_time', e.target.value)}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Street Address Field */}
              <div>
                <label htmlFor="hotel-street" className="block text-sm font-medium text-blue-gray-700 mb-1">Street Address *</label>
                <Input
                  id="hotel-street"
                  type="text"
                  placeholder="Enter street address"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  error={!!errors.address?.street}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.address?.street && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.address.street}
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
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  error={!!errors.address?.city}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.address?.city && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.address.city}
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
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  error={!!errors.address?.state}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.address?.state && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.address.state}
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
                  value={formData.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  error={!!errors.address?.country}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                {errors.address?.country && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.address.country}
                  </Typography>
                )}
              </div>

              {/* Postal Code Field */}
              <div>
                <label htmlFor="hotel-postal" className="block text-sm font-medium text-blue-gray-700 mb-1">Postal Code</label>
                <Input
                  id="hotel-postal"
                  type="text"
                  placeholder="Enter postal code"
                  value={formData.address.postal_code}
                  onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                  className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
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
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Hotel Image *</label>
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
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  handleInputChange('policies', selectedOptions);
                }}
              >
                {policies.map(policy => (
                  <option key={policy._id || policy.id} value={policy._id || policy.id}>
                    {policy.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple policies</p>
            </div>

            {/* Amenities Selection */}
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Amenities</label>
              <select 
                multiple 
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                value={formData.amenities}
                onChange={e => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  handleInputChange('amenities', selectedOptions);
                }}
              >
                {amenities.map(amenity => (
                  <option key={amenity._id || amenity.id} value={amenity._id || amenity.id}>
                    {amenity.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple amenities</p>
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
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