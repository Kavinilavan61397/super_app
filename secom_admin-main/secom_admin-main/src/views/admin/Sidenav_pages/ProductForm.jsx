import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaUpload, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import API_CONFIG from '../../../config/api.config';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const fileInputRef = useRef(null);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Product name is required')
      .min(2, 'Product name must be at least 2 characters')
      .max(100, 'Product name must not exceed 100 characters'),
    description: Yup.string()
      .max(1000, 'Description must not exceed 1000 characters'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive')
      .min(0, 'Price cannot be negative'),
    sale_price: Yup.number()
      .positive('Sale price must be positive')
      .min(0, 'Sale price cannot be negative'),
    stock: Yup.number()
      .required('Stock is required')
      .integer('Stock must be a whole number')
      .min(0, 'Stock cannot be negative'),
    sku: Yup.string()
      .required('SKU is required')
      .min(2, 'SKU must be at least 2 characters')
      .max(50, 'SKU must not exceed 50 characters'),
    slug: Yup.string()
      .required('Slug is required')
      .min(2, 'Slug must be at least 2 characters')
      .max(100, 'Slug must not exceed 100 characters'),
    brand_id: Yup.string().required('Brand is required'),
    category_id: Yup.string().required('Category is required'),
    sub_category_id: Yup.string(),
    status: Yup.boolean().required('Status is required'),
    meta_title: Yup.string().max(60, 'Meta title must not exceed 60 characters'),
    meta_description: Yup.string().max(160, 'Meta description must not exceed 160 characters'),
    photo: Yup.mixed()
      .test('fileType', 'Only image files are allowed', (value) => {
        if (!value) return true; // Allow empty for edit mode
        return value instanceof File && value.type.startsWith('image/');
      })
      .test('fileSize', 'File size must be less than 5MB', (value) => {
        if (!value) return true; // Allow empty for edit mode
        return value instanceof File && value.size <= 5 * 1024 * 1024;
      }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      sale_price: '',
      stock: 0,
      sku: '',
      slug: '',
      brand_id: '',
      category_id: '',
      sub_category_id: '',
      status: true,
      meta_title: '',
      meta_description: '',
    },
  });

  const selectedBrand = watch('brand_id');
  const selectedCategory = watch('category_id');

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/api/admin/get_all_brand`);
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('Failed to load brands');
      }
    };
    fetchBrands();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Filter subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filteredSubCategories = categories.filter(cat => 
        cat.parent_id === selectedCategory
      );
      setSubCategories(filteredSubCategories);
      // Reset subcategory selection when category changes
      setValue('sub_category_id', '');
    } else {
      setSubCategories([]);
      setValue('sub_category_id', '');
    }
  }, [selectedCategory, categories, setValue]);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.BASE_URL}/api/products/${id}`);
      const product = response.data;
      
      setValue('name', product.name);
      setValue('description', product.description || '');
      setValue('price', product.price);
      setValue('sale_price', product.sale_price || '');
      setValue('stock', product.stock);
      setValue('sku', product.sku);
      setValue('slug', product.slug);
      setValue('brand_id', product.brand_id);
      setValue('category_id', product.category_id);
      setValue('sub_category_id', product.sub_category_id || '');
      setValue('status', product.status);
      setValue('meta_title', product.meta_title || '');
      setValue('meta_description', product.meta_description || '');
      
      if (product.photo) {
        const imageUrl = `${API_CONFIG.BASE_URL}${product.photo}`;
        setExistingImage(imageUrl);
        setImagePreview(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product data');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue('photo', file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', data.price);
      formData.append('sale_price', data.sale_price || '');
      formData.append('stock', data.stock);
      formData.append('sku', data.sku);
      formData.append('slug', data.slug);
      formData.append('brand_id', data.brand_id);
      formData.append('category_id', data.category_id);
      if (data.sub_category_id) {
        formData.append('sub_category_id', data.sub_category_id);
      }
      formData.append('status', data.status);
      formData.append('meta_title', data.meta_title || '');
      formData.append('meta_description', data.meta_description || '');
      
      if (data.photo) {
        formData.append('product_image', data.photo);
      }

      const accessToken = localStorage.getItem('OnlineShop-accessToken');
      if (isEditMode) {
        await axios.put(`${API_CONFIG.BASE_URL}/api/products/update_product_by_id/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`
          },
        });
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API_CONFIG.BASE_URL}/api/products/save_product`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`
          },
        });
        toast.success('Product created successfully');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/products');
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="text-lg" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                {...register('name')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                {...register('sku')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sku ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter SKU"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Sale Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register('sale_price')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sale_price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.sale_price && (
                <p className="mt-1 text-sm text-red-600">{errors.sale_price.message}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                {...register('stock')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                {...register('slug')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="product-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                {...register('brand_id')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.brand_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>
              {errors.brand_id && (
                <p className="mt-1 text-sm text-red-600">{errors.brand_id.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category_id')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.filter(cat => !cat.parent_id).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
              )}
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                {...register('sub_category_id')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sub_category_id ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!selectedCategory}
              >
                <option value="">Select a subcategory</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
              {errors.sub_category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.sub_category_id.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register('status')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              {...register('meta_title')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.meta_title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter meta title"
            />
            {errors.meta_title && (
              <p className="mt-1 text-sm text-red-600">{errors.meta_title.message}</p>
            )}
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              {...register('meta_description')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.meta_description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter meta description"
            />
            {errors.meta_description && (
              <p className="mt-1 text-sm text-red-600">{errors.meta_description.message}</p>
            )}
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="space-y-4">
              {/* Image Preview */}
              {(imagePreview || existingImage) && (
                <div className="flex items-center space-x-4">
                  <img
                    src={imagePreview || existingImage}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setExistingImage(null);
                      setValue('photo', null);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <FaUpload className="inline mr-2" />
                  {isEditMode ? 'Change Image' : 'Upload Image'}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <span className="text-sm text-gray-500">
                  {isEditMode ? 'Leave empty to keep current image' : 'Select an image file (max 5MB)'}
                </span>
              </div>
              {errors.photo && (
                <p className="mt-1 text-sm text-red-600">{errors.photo.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 