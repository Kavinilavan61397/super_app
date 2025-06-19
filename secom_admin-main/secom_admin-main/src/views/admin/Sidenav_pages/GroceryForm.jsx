import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import groceryService from '../../../services/groceryService';

const GroceryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, setValue, watch, reset } = useForm();

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      groceryService.getGroceryById(id)
        .then((res) => {
          const data = res.data;
          reset(data);
          setImagePreview(data.image || null);
        })
        .catch(() => setError('Failed to load grocery'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'grocery_image' && formData[key][0]) {
          data.append('grocery_image', formData[key][0]);
        } else {
          data.append(key, formData[key]);
        }
      });
      if (isEdit) {
        await groceryService.updateGrocery(id, data);
      } else {
        await groceryService.createGrocery(data);
      }
      navigate('/admin/groceries');
    } catch (err) {
      setError('Failed to save grocery');
    } finally {
      setLoading(false);
    }
  };

  const imageFile = watch('grocery_image');
  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Grocery' : 'Add Grocery'}</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input {...register('name', { required: true })} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea {...register('description')} className="input input-bordered w-full" />
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block font-medium">Original Price</label>
            <input type="number" step="0.01" {...register('original_price', { required: true })} className="input input-bordered w-full" />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Discounted Price</label>
            <input type="number" step="0.01" {...register('discounted_price', { required: true })} className="input input-bordered w-full" />
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block font-medium">Rating</label>
            <input type="number" step="0.01" {...register('rating')} className="input input-bordered w-full" />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Quantity</label>
            <input type="number" {...register('quantity', { required: true })} className="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label className="block font-medium">Category</label>
          <input {...register('category')} className="input input-bordered w-full" />
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input type="checkbox" {...register('is_best_seller')} className="mr-2" />
            Best Seller
          </label>
          <label className="flex items-center">
            <input type="checkbox" {...register('status')} className="mr-2" />
            Active
          </label>
        </div>
        <div>
          <label className="block font-medium">Image</label>
          <input type="file" accept="image/*" {...register('grocery_image')} className="input input-bordered w-full" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Grocery' : 'Add Grocery'}
        </button>
      </form>
    </div>
  );
};

export default GroceryForm; 