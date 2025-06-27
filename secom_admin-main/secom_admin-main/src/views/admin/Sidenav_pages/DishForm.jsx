import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
} from '@material-tailwind/react';
import { useParams, useNavigate } from 'react-router-dom';
import { dishService, restaurantService } from '../../../services/restaurantService';
import API_CONFIG from '../../../config/api.config';
import { toast } from 'react-toastify';

const DishForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    restaurantId: '',
    status: true,
  });
  const [restaurants, setRestaurants] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAll();
        setRestaurants(data);
      } catch (error) {
        toast.error('Failed to fetch restaurants');
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch dish if edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchDish = async () => {
        try {
          setLoading(true);
          const dish = await dishService.getById(id);
          setFormData({
            name: dish.name || '',
            description: dish.description || '',
            price: dish.price ? String(dish.price) : '',
            restaurantId: dish.restaurantId ? String(dish.restaurantId) : '',
            status: dish.status !== undefined ? dish.status : true,
          });
          if (dish.image) {
            setImagePreview(`${API_CONFIG.BASE_URL}${dish.image}`);
          }
        } catch (error) {
          toast.error('Failed to fetch dish details');
          navigate('/admin/dish');
        } finally {
          setLoading(false);
        }
      };
      fetchDish();
    }
  }, [isEditMode, id, navigate]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field === 'restaurantId') {
      setFormData(prev => ({ ...prev, [field]: value ? String(value) : '' }));
    } else if (field === 'status') {
      setFormData(prev => ({ ...prev, [field]: !!value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.restaurantId) newErrors.restaurantId = 'Restaurant is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('restaurantId', Number(formData.restaurantId));
      formDataToSend.append('status', formData.status);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      // DEBUG LOGS
      console.log('Submitting dish with name:', formData.name);
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }
      if (isEditMode) {
        await dishService.update(id, formDataToSend);
        toast.success('Dish updated successfully');
      } else {
        await dishService.create(formDataToSend);
        toast.success('Dish created successfully');
      }
      navigate('/admin/dish');
    } catch (error) {
      toast.error(error.message || 'Failed to save dish');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading dish...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-2xl shadow-lg p-2">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-6 font-bold">
            {isEditMode ? 'Edit Dish' : 'Add Dish'}
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                placeholder="Enter dish name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                placeholder="Enter dish description"
                rows={4}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={e => handleInputChange('price', e.target.value)}
                error={!!errors.price}
                placeholder="Enter price"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant *</label>
              <select
                className="block w-full rounded border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.restaurantId}
                onChange={e => handleInputChange('restaurantId', e.target.value)}
              >
                <option value="">Select restaurant</option>
                {restaurants.filter(rest => rest.status).map(restaurant => (
                  <option key={restaurant.id} value={String(restaurant.id)}>{restaurant.name}</option>
                ))}
              </select>
              {errors.restaurantId && <p className="mt-1 text-sm text-red-600">{errors.restaurantId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              {imagePreview ? (
                <div className="relative w-32 h-32 mb-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border" />
                  <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700">Remove</button>
                </div>
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="status-toggle"
                checked={!!formData.status}
                onChange={e => handleInputChange('status', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="status-toggle" className="ml-2 text-sm text-gray-700 select-none">
                {formData.status ? 'Active' : 'Inactive'}
              </label>
              <span className="ml-2 text-sm text-gray-600">Active: Dish will be visible</span>
            </div>
            <div className="flex gap-4 pt-4 justify-end">
              <Button
                type="submit"
                color="blue"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? 'Saving...' : (isEditMode ? 'Update Dish' : 'Create Dish')}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="gray"
                onClick={() => navigate('/admin/dish')}
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

export default DishForm; 