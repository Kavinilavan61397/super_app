import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaUpload, FaSpinner } from 'react-icons/fa';
import groceryService from 'services/groceryService';
import API_CONFIG from 'config/api.config';

const GroceryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    original_price: Yup.number().typeError('Must be a number').required('Original price is required'),
    discounted_price: Yup.number().typeError('Must be a number'),
    rating: Yup.number().typeError('Must be a number').min(0).max(5),
    is_best_seller: Yup.boolean(),
    quantity: Yup.number().integer().typeError('Must be an integer'),
    category: Yup.string(),
    status: Yup.boolean().required('Status is required'),
    image: Yup.mixed().test('fileSize', 'File size too large', (value) => {
      if (!value || !value.length) return true; // attachment is optional
      return value[0].size <= 5000000;
    }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      status: true,
      is_best_seller: false,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      groceryService.getGroceryById(id).then(response => {
        const grocery = response.data;
        Object.keys(grocery).forEach(key => {
          setValue(key, grocery[key]);
        });
        if (grocery.image) {
          const imageUrl = `${API_CONFIG.BASE_URL}${grocery.image}`;
          setExistingImage(imageUrl);
          setImagePreview(imageUrl);
        }
      });
    }
  }, [id, setValue, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image' && data.image instanceof File) {
        formData.append('image', data.image);
      } else if (key !== 'image') {
        formData.append(key, data[key]);
      }
    });

    setLoading(true);
    try {
      if (isEditMode) {
        await groceryService.updateGrocery(id, formData);
        toast.success('Grocery updated successfully');
      } else {
        await groceryService.createGrocery(formData);
        toast.success('Grocery created successfully');
      }
      navigate('/admin/groceries');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save grocery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/admin/groceries')} className="mr-4 p-2 text-gray-600 hover:text-gray-800">
          <FaArrowLeft className="text-lg" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Grocery' : 'Add New Grocery'}</h1>
      </div>
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="text" {...register('name')} placeholder="Name" className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          
          <textarea {...register('description')} placeholder="Description" className="w-full p-2 border rounded"></textarea>

          <input type="text" {...register('original_price')} placeholder="Original Price" className="w-full p-2 border rounded" />
          {errors.original_price && <p className="text-red-500">{errors.original_price.message}</p>}

          <input type="text" {...register('discounted_price')} placeholder="Discounted Price" className="w-full p-2 border rounded" />
          {errors.discounted_price && <p className="text-red-500">{errors.discounted_price.message}</p>}

          <input type="text" {...register('rating')} placeholder="Rating (0-5)" className="w-full p-2 border rounded" />
          {errors.rating && <p className="text-red-500">{errors.rating.message}</p>}

          <input type="text" {...register('quantity')} placeholder="Quantity" className="w-full p-2 border rounded" />
          {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}

          <input type="text" {...register('category')} placeholder="Category" className="w-full p-2 border rounded" />
          
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                {...register('status')}
                value={watch('status')}
                onChange={(e) => setValue('status', e.target.value === 'true')}
                className="w-full p-2 border rounded"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div className="pt-7">
                <label className="flex items-center space-x-2">
                    <input type="checkbox" {...register('is_best_seller')} className="h-5 w-5 rounded" />
                    <span className="text-sm font-medium text-gray-700">Best Seller</span>
                </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            {(imagePreview || existingImage) && (
              <div className="my-2">
                <img src={imagePreview || existingImage} alt="Preview" className="h-20 w-20 rounded-lg object-cover border" />
              </div>
            )}
            <input type="file" onChange={handleImageChange} />
          </div>

          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? <FaSpinner className="animate-spin" /> : (isEditMode ? 'Update' : 'Create')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroceryForm; 