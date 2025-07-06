import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from 'components/navbar';
import API_CONFIG from '../../../config/api.config';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../utils/apiUtils';
import { productService } from 'services/productService';

function Products() {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [rowIdToDelete, setRowIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [subCategories, setSubCategories] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand_id: '',
    category_id: '',
    photo: null
  });
  const [editProduct, setEditProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const productSchemaAdd = Yup.object().shape({
    brand_id: Yup.string().required("Brand is required"),
    category_id: Yup.string().required("Category is required"),
    sub_category_id: Yup.string().required("SubCategory is required"),
    name: Yup.string().required("Product Name is required"),
    purchase_price_type: Yup.string().required("Purchase Price Type is required"),
    purchase_price: Yup.number().required("Purchase Price is required").positive("Purchase Price must be positive"),
    sales_price: Yup.number().required("Sales Price is required").positive("Sales Price must be positive"),
    mrp: Yup.number().required("MRP is required").positive("MRP must be positive"),

    // File validation for primary_image (Required for Add)
    primary_image: Yup.mixed()
      .required("Primary Image is required")
      .test("", "Primary Image is required", (value) => {
        return value && value[0] && value[0].size <= 5000000;
      })
    // .test("fileType", "Unsupported file format", (value) => {
    //   return value && value[0] && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type); 
    // }),
  });

  const productSchemaEdit = Yup.object().shape({
    brand_id: Yup.string().required("Brand is required"),
    category_id: Yup.string().required("Category is required"),
    sub_category_id: Yup.string().required("SubCategory is required"),
    name: Yup.string().required("Product Name is required"),
    purchase_price_type: Yup.string().required("Purchase Price Type is required"),
    purchase_price: Yup.number()
      .required("Purchase Price is required")
      .positive("Purchase Price must be positive"),
    sales_price: Yup.number()
      .required("Sales Price is required")
      .positive("Sales Price must be positive"),
    mrp: Yup.number()
      .required("MRP is required")
      .positive("MRP must be positive"),
    tags: Yup.array().min(1, "At least one tag is required"),

  });

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(isEditMode ? productSchemaEdit : productSchemaAdd),
    defaultValues: {
      brand_id: selectedProduct?.brand_id || '',
      category_id: selectedProduct?.category_id || '',
      sub_category_id: selectedProduct?.sub_category_id || '',
      name: selectedProduct?.name || '',
      purchase_price_type: selectedProduct?.purchase_price_type || '',
      purchase_price: selectedProduct?.purchase_price || 0,
      sales_price: selectedProduct?.sales_price || 0,
      mrp: selectedProduct?.mrp || 0,
      discount_type: selectedProduct?.discount_type || '',
      discount_field: selectedProduct?.discount_field || 0,
      tag_id: selectedProduct?.tag_id || '',
      product_description: selectedProduct?.product_description || '',
      primary_image: selectedProduct?.primary_image || '',
      images: selectedProduct?.images || [],
    },
  });

  // Reset categories and subcategories when the brand changes
  useEffect(() => {
    if (!selectedBrand) {
      setCategories([]);
      setSubCategories([]);
      setValue('brand_id', '');
      setValue('category_id', '');
      setValue('sub_category_id', '');
    }
  }, [selectedBrand, setValue]);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await apiGet(API_CONFIG.ENDPOINTS.ADMIN.BRANDS);
        console.log('Brands fetched:', response.data);
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brand data:', error);
        setBrands([]);
      }
    };

    fetchBrandData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategoryData(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategoryData = async (brandId) => {
    if (!brandId) return;

    try {
      const response = await apiGet(API_CONFIG.ENDPOINTS.ADMIN.CATEGORIES);
      console.log('Categories fetched:', response.data);
      setCategories(response.data);
      setValue('category_id', '');
      setValue('sub_category_id', '');
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchSubCategoryData = async (categoryId) => {
    if (!categoryId) return;

    try {
      const response = await apiGet(API_CONFIG.ENDPOINTS.ADMIN.SUBCATEGORIES);
      console.log('Subcategories fetched:', response.data);
      setSubCategories(response.data);

    } catch (error) {
      console.error('Error fetching subcategory data:', error);
      setSubCategories([]);
    }
  };

  const [productId, setProductId] = useState('');

  const filteredProducts = tableData.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.brand?.brand_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.sub_category?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Fetch Products from API
  const fetchProducts = async () => {
    try {
      const productResponse = await productService.getAllProducts();
      setTableData(productResponse.data);
      setTotalItems(productResponse.data.length);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await apiGet(API_CONFIG.ENDPOINTS.ADMIN.TAGS);
        setTags(response.data); 
        console.log('Tags fetched:', response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [setTags]);

  const handleCloseModal = () => {
    setOpenAddModal(false);
    fetchSubCategoryData();
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
  
     const ProductName = data.name;
            const existingProduct = getPaginatedData().find(product => product.name.toLowerCase() === ProductName.toLowerCase());
    
            if (existingProduct) {
                toast.error("This Product already exists. Provide different name.", {
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return; // Prevent form submission if the brand name already exists
            }
  
    const formData = new FormData();
  
    // Append form data
    formData.append("brand_id", data.brand_id);
    formData.append("category_id", data.category_id);
    formData.append("sub_category_id", data.sub_category_id);
    formData.append("name", data.name);
    formData.append("purchase_price_type", data.purchase_price_type);
    formData.append("purchase_price", data.purchase_price);
    formData.append("sales_price", data.sales_price);
    formData.append("mrp", data.mrp);
    formData.append("discount_type", data.discount_type);
    formData.append("discount_field", data.discount_field);
    formData.append("tag_id", data.tag_id);
    formData.append("product_description", data.product_description);
  
    if (data.primary_image && data.primary_image[0]) {
      formData.append("primary_image", data.primary_image[0]);
    }
  
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("images[]", image);
      });
    }
  
    try {
      const accessToken = localStorage.getItem("OnlineShop-accessToken");
  
      if (!accessToken) {
        console.error("Access token is missing. Please login.");
        return;
      }
  
      const response = await apiPost(API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS, formData);
  
      console.log("Product created successfully:", response.data);
  
      // Success toast
      toast.success("Product added successfully!", {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      reset();
      setOpenAddModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error submitting form:", error);
  
      // Error toast
      toast.error("Error while adding product!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedBrand) {
      fetchCategoryData(selectedBrand);
    }
  }, [selectedBrand]);

  const handleFormUpdate = async (data) => {
    if (!selectedProduct) {
      console.error('Product ID is not set!');
      toast.error('Product ID is not set!', {
        autoClose: 3000,
        hideProgressBar: true,  // Hide the progress bar for error toast
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,  // Optional to disable progress
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('brand_id', data.brand_id);
    formData.append('category_id', data.category_id);
    formData.append('sub_category_id', data.sub_category_id);
    formData.append('name', data.name);
    formData.append('quantity', data.quantity);
    formData.append('purchase_price_type', data.purchase_price_type);
    formData.append('purchase_price', data.purchase_price);
    formData.append('sales_price', data.sales_price);
    formData.append('mrp', data.mrp);
    formData.append('discount_type', data.discount_type);
    formData.append('discount_field', data.discount_field);
    formData.append('tag_id', data.tag_id);
    formData.append('product_description', data.product_description);

    // If a new image is provided, append it to the form data
    if (data.primary_image && data.primary_image[0] instanceof File) {
      console.log('New Image Selected:', data.primary_image[0]);
      formData.append('primary_image', data.primary_image[0]);
    } else if (data.primary_image && !(data.primary_image instanceof File)) {
      console.warn('No valid image selected, skipping image update');
    } else {
      console.log('Using existing image, no new image selected');
    }

    try {
      const accessToken = localStorage.getItem('OnlineShop-accessToken');
      if (!accessToken) {
        console.error('Authorization token not found');
        toast.error('Authorization token not found', {
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, // Optional to disable progress bar
        });
        return;
      }

      const url = API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS + '/' + selectedProduct.id;
      formData.append('_method', 'put'); // To force a PUT request

      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await apiPut(url, formData);

      // Handle the response
      if (response.status === 200) {
        console.log('Product updated successfully');
        toast.success('Product updated successfully!', {
          autoClose: 3000,
          hideProgressBar: true,  // Hide the progress bar for success toast
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,  // Optional to disable progress bar
        });
        setOpenEditModal(false);  // Close the modal
        setCategoryImage(null);  // Clear the category image if necessary
        reset();  // Reset the form
      } else {
        console.error('Error updating product:', response.data);
        toast.error('Error updating product', {
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, // Optional to disable progress bar
        });
      }
    } catch (error) {
      console.error('Error updating product:', error.message || error);
      toast.error(`Error updating product: ${error.message || error}`, {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,  // Optional to disable progress bar
      });
    } finally {
      setLoading(false);  // Set loading to false after request completes
    }
  };

  const handleAddCategory = () => {
    reset();
    setOpenAddModal(true);
    setSelectedProduct(null);
    setCategories([]);
    setValue('brand_id', '');
    setValue('category_id', '');
    setValue('sub_category_id', '');
    setValue('name', '');
    // setValue('quantity', '');
    setValue('purchase_price', '');
    setValue('sales_price', '');
    setValue('mrp', '');
    setValue('discount_type', '');
    setValue('discount_field', '');
    setValue('tag_id', '');
    setValue('product_description', '');
    setValue('primary_image', '');
    setValue('images', []);
    setValue('purchase_price_type', '');
  };

  const handleEditRow = (product) => {
    setSelectedProduct(product);
    reset({
      brand_id: product.brand_id,
      category_id: product.category_id,
      sub_category_id: product.sub_category_id,
      name: product.name,
      // quantity: product.quantity,
      purchase_price: product.purchase_price,
      sales_price: product.sales_price,
      mrp: product.mrp,
      discount_type: product.discount_type,
      discount_field: product.discount_field,
      tag_id: product.tag_id,
      product_description: product.product_description,
      purchase_price_type: product.purchase_price_type,
    });
    setOpenEditModal(true);
  };

  useEffect(() => {
    if (selectedProduct) {
      reset({
        brand_id: selectedProduct.brand_id || '',
        category_id: selectedProduct.category_id || '',
        sub_category_id: selectedProduct.sub_category_id || '',
        name: selectedProduct.name || '',
        purchase_price_type: selectedProduct.purchase_price_type || '',
        purchase_price: selectedProduct.purchase_price || 0,
        sales_price: selectedProduct.sales_price || 0,
        mrp: selectedProduct.mrp || 0,
        discount_type: selectedProduct.discount_type || '',
        discount_field: selectedProduct.discount_field || 0,
        tag_id: selectedProduct.tag_id || '',
        product_description: selectedProduct.product_description || '',
        primary_image: selectedProduct.primary_image || '',
        images: selectedProduct.images || [],
      });
    }
  }, [selectedProduct]);

  const handleRowSelection = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(filteredProducts.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchProducts();
  }, [itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle search input change
  useEffect(() => {
    if (searchQuery) {
      const filtered = tableData.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by name
      );
      setFilteredData(filtered);
      setTotalItems(filtered.length);
      setCurrentPage(1); // Reset to first page when search query changes
    } else {
      setFilteredData(tableData); // If no search query, show all users
      setTotalItems(tableData.length);
    }
  }, [searchQuery, tableData]);

  // Get paginated data
  const getPaginatedData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      setSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  const handleDeleteRow = (id) => {
    setRowIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmation = async () => {
    setIsDeleting(true);
    try {
      const accessToken = localStorage.getItem('OnlineShop-accessToken');
      if (!accessToken) {
        console.error('Authorization token not found');
        toast.error('Authorization token not found', {
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      await apiDelete(API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS + '/' + rowIdToDelete);

      // Show success toast
      toast.success('Product deleted successfully!', {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      fetchProducts();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      // Show error toast
      toast.error('Error deleting product', {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('OnlineShop-accessToken');
      if (!accessToken) {
        toast.error('Authorization token not found', {
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      // Loop through selected rows and delete each product
      for (let id of selectedRows) {
        await apiDelete(API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS + '/' + id);
      }

      // Success toaster for successful deletion of selected products
      toast.success('Selected products deleted successfully!', {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Re-fetch products and reset selection
      await fetchProducts();
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected products:', error);
      // Error toaster if there is a failure in deletion
      toast.error('Error deleting selected products', {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);  // End the loading state
    }
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length + images.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }

    const newImages = [...images];
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i]);
    }
    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (isEditMode) {
        await apiPut(API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS + '/' + editProduct.id, formDataToSend);
        toast.success('Product updated successfully');
      } else {
        await apiPost(API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS, formDataToSend);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      fetchProducts();
      reset();
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      brand_id: '',
      category_id: '',
      photo: null
    });
    setEditProduct(null);
    setIsEditMode(false);
  };

  return (
    <div className=" min-h-screen pt-6">
      {/* <TokenExpiration /> */}
      <Navbar brandText={"Product"} />
      <ToastContainer />
      <div className="w-full mx-auto">
        <span className="flex mt-4 items-center w-full gap-6">
          {/* Search bar */}
          <div className="relative flex flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
            <div className="flex h-full w-full items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white">
              <p className="pl-3 pr-2 text-xl">
                <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
              </p>
              <input
                type="text"
                placeholder="Search by Product Name..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
              />
            </div>
          </div>

          <button
            onClick={handleAddCategory}
            className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
          >
            <FaPlus className="mr-2" /> Add Products
          </button>
        </span>

        {openAddModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
            onClick={() => setOpenAddModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl p-12  max-w-[85%]  max-h-[80%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Product</h2>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* Scrollable Content Area */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <Controller
                      name="brand_id"
                      control={control}
                      rules={{ required: "Brand is required" }}
                      render={({ field }) => (
                        <div className="mb-4">
                          <label className="block text-lg text-gray-600 font-medium mb-2">
                            Brand<span className="text-red-500">*</span>
                          </label>
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            onChange={(e) => {
                              const brandId = e.target.value;
                              setSelectedBrand(brandId);
                              field.onChange(e);
                            }}
                          >
                            <option value="">Select a Brand</option>
                            {brands.filter(brand => brand.status).map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.brand_name}
                              </option>
                            ))}
                          </select>
                          {errors.brand_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.brand_id.message}</p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name="category_id"
                      control={control}
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <div className="mb-4">
                          <label className="block text-lg text-gray-600 font-medium mb-2">
                            Category<span className="text-red-500">*</span>
                          </label>
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            disabled={!selectedBrand}
                            onChange={(e) => {
                              const categoryId = e.target.value;
                              setSelectedCategory(categoryId);
                              field.onChange(e);
                            }}
                          >
                            <option value="">Select a Category</option>
                            {categories.filter(cat => cat.status).map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          {errors.category_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
                          )}
                        </div>
                      )}
                    />

                    {/* SubCategory Dropdown */}
                    <Controller
                      name="sub_category_id"
                      control={control}
                      rules={{ required: "SubCategory is required" }}
                      render={({ field }) => (
                        <div className="mb-4">
                          <label className="block text-lg text-gray-600 font-medium mb-2">SubCategory<span className="text-red-500 ">*</span></label>
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            disabled={!selectedCategory} // Disable if no category selected
                          >
                            <option value="">Select a SubCategory</option>
                            {subCategories.map((subCategory) => (
                              <option key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                              </option>
                            ))}
                          </select>
                          {errors.sub_category_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.sub_category_id.message}</p>
                          )}
                        </div>
                      )}
                    />

                    {/* Product Name */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Product Name<span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            placeholder="Enter Product Name"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Purchase With Dropdown */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">Purchase With<span className="text-red-500 ">*</span></label>
                      <Controller
                        name="purchase_price_type"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                          >
                            <option value="">Select Price Type</option>
                            <option value="with_gst">With GST</option>
                            <option value="without_gst">Without GST</option>
                          </select>
                        )}
                      />
                      {errors.purchase_price_type && <p className="text-red-500 text-sm">{errors.purchase_price_type.message}</p>}
                    </div>

                    {/* Purchase Price */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">Purchase Price<span className="text-red-500 ">*</span></label>
                      <Controller
                        name="purchase_price"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            placeholder="Enter Purchase Price"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.purchase_price && <p className="text-red-500 text-sm">{errors.purchase_price.message}</p>}
                    </div>

                    {/* Sales Price */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">Sales Price<span className="text-red-500 ">*</span></label>
                      <Controller
                        name="sales_price"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            placeholder="Enter Sales Price"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.sales_price && <p className="text-red-500 text-sm">{errors.sales_price.message}</p>}
                    </div>

                    {/* MRP */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">MRP<span className="text-red-500 ">*</span></label>
                      <Controller
                        name="mrp"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            placeholder="Enter MRP"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.mrp && <p className="text-red-500 text-sm">{errors.mrp.message}</p>}
                    </div>

                    {/* Discount Type Dropdown */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">Discount Type</label>
                      <Controller
                        name="discount_type"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                          >
                            <option value="">Select Discount Type</option>
                            <option value="percentage">Percentage</option>
                            <option value="value">Value</option>
                          </select>
                        )}
                      />
                      {errors.discount_type && <p className="text-red-500 text-sm mt-1">{errors.discount_type.message}</p>}
                    </div>

                    {/* Discount Value */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Discount Value
                      </label>
                      <Controller
                        name="discount_field"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            placeholder="Enter Discount Value"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.discount_field && (
                        <p className="text-red-500 text-sm mt-1">{errors.discount_field.message}</p>
                      )}
                    </div>

                    {/* Tags Dropdown */}
                    <div className="mb-4">
                      <label className="block text-lg text-gray-600 font-medium mb-2">Tags</label>
                      <Controller
                        name="tag_id"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            onChange={(e) => {
                              setSelectedTag(e.target.value);
                              field.onChange(e);
                            }}
                          >
                            <option value="">Select a Tag</option>
                            {tags.length > 0 ? (
                              tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                  {tag.tag_name}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>Loading tags...</option>
                            )}
                          </select>
                        )}
                      />
                      {errors?.tag_id && <p className="text-red-500 text-sm">{errors.tag_id.message}</p>}
                    </div>

                    {/* Primary Image */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Primary Image<span className="text-red-500 ">*</span>
                      </label>
                      <Controller
                        name="primary_image"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            onChange={(e) => {
                              field.onChange(e.target.files); // Pass the selected file to form state
                            }}
                          />
                        )}
                      />
                      {errors.primary_image && (
                        <p className="text-red-500 text-sm">{errors.primary_image.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <label className="block text-lg text-gray-600 font-medium mb-2">
                    Detailed Description
                  </label>
                  <Controller
                    name="product_description"
                    control={control}
                    render={({ field }) => (
                      <ReactQuill
                        {...field}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Enter a detailed description of the product"
                        className="w-full h-[140px] rounded-md px-0 py-0 text-gray-800 focus:outline-none"
                      />
                    )}
                  />
                  {errors.product_description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.product_description.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-16">
                  <button
                    onClick={() => setOpenAddModal(false)}
                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(handleFormSubmit)}
                    disabled={loading}
                    className="relative bg-[#4318ff] text-white px-6 py-3 rounded-lg hover:bg-[#322bbf] transition-all"
                  >
                    {loading ? (
                      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                        <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {openEditModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
            onClick={() => setOpenEditModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl p-12 max-w-[85%] max-h-[80%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Product</h2>
              <form onSubmit={handleSubmit(handleFormUpdate)}>
                {/* Scrollable Content Area */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Brand Dropdown */}
                    <Controller
                      name="brand_id"
                      control={control}
                      rules={{ required: "Brand is required" }}
                      defaultValue={selectedProduct?.brand_id} // Pre-fill the value
                      render={({ field }) => (
                        <div className="mb-4">
                          <label className="block text-lg text-gray-600 font-medium mb-2">
                            Brand<span className="text-red-500">*</span>
                          </label>
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            onChange={(e) => {
                              const brandId = e.target.value;
                              setSelectedBrand(brandId);
                              field.onChange(e);
                            }}
                          >
                            <option value="">Select a Brand</option>
                            {brands.filter(brand => brand.status).map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.brand_name}
                              </option>
                            ))}
                          </select>
                          {errors.brand_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.brand_id.message}</p>
                          )}
                        </div>
                      )}
                    />

                    {/* Category Dropdown */}
                    <Controller
                      name="category_id"
                      control={control}
                      rules={{ required: "Category is required" }}
                      defaultValue={selectedProduct?.category_id} // Pre-fill the value
                      render={({ field }) => (
                        <div className="mb-4">
                          <label className="block text-lg text-gray-600 font-medium mb-2">
                            Category<span className="text-red-500">*</span>
                          </label>
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            onChange={(e) => {
                              const categoryId = e.target.value;
                              setSelectedCategory(categoryId);
                              field.onChange(e);
                            }}
                          >
                            <option value="">Select a Category</option>
                            {categories.filter(cat => cat.status).map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          {/* {errors.category_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
                          )} */}
                        </div>
                      )}
                    />

                    {/* SubCategory Dropdown */}
                    <Controller
                      name="sub_category_id"
                      control={control}
                      rules={{ required: "SubCategory is required" }}
                      defaultValue={selectedProduct?.sub_category_id} // Pre-fill the value
                      render={({ field }) => (
                        <div className="mb-4">
                          <label className="block text-lg text-gray-600 font-medium mb-2">
                            SubCategory<span className="text-red-500">*</span>
                          </label>
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            onChange={(e) => {
                              const subCategoryId = e.target.value;
                              field.onChange(e);
                            }}
                          >
                            <option value="">Select a SubCategory</option>
                            {subCategories
                              .filter((subCategory) => subCategory.category_id === selectedCategory) // Filter subcategories by category
                              .map((subCategory) => (
                                <option key={subCategory.id} value={subCategory.id}>
                                  {subCategory.name}
                                </option>
                              ))}
                          </select>
                          {/* {errors.sub_category_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.sub_category_id.message}</p>
                          )} */}
                        </div>
                      )}
                    />

                    {/* Product Name */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Product Name<span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue={selectedProduct?.name} // Pre-fill the value
                        render={({ field }) => (
                          <input
                            type="text"
                            placeholder="Enter Product Name"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Purchase Price Type */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Purchase With<span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="purchase_price_type"
                        control={control}
                        defaultValue={selectedProduct?.purchase_price_type} // Pre-fill the value
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                          >
                            <option value="">Select Price Type</option>
                            <option value="with_gst">With GST</option>
                            <option value="without_gst">Without GST</option>
                          </select>
                        )}
                      />
                      {errors.purchase_price_type && <p className="text-red-500 text-sm">{errors.purchase_price_type.message}</p>}
                    </div>

                    {/* Purchase Price */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Purchase Price<span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="purchase_price"
                        control={control}
                        defaultValue={selectedProduct?.purchase_price} // Pre-fill the value
                        render={({ field }) => (
                          <input
                            type="number"
                            placeholder="Enter Purchase Price"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.purchase_price && <p className="text-red-500 text-sm">{errors.purchase_price.message}</p>}
                    </div>

                    {/* Sales Price */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Sales Price<span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="sales_price"
                        control={control}
                        defaultValue={selectedProduct?.sales_price} // Pre-fill the value
                        render={({ field }) => (
                          <input
                            type="number"
                            placeholder="Enter Sales Price"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.sales_price && <p className="text-red-500 text-sm">{errors.sales_price.message}</p>}
                    </div>

                    {/* MRP */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        MRP<span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="mrp"
                        control={control}
                        defaultValue={selectedProduct?.mrp} // Pre-fill the value
                        render={({ field }) => (
                          <input
                            type="number"
                            placeholder="Enter MRP"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.mrp && <p className="text-red-500 text-sm">{errors.mrp.message}</p>}
                    </div>

                    {/* Discount Type */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">Discount Type</label>
                      <Controller
                        name="discount_type"
                        control={control}
                        defaultValue={selectedProduct?.discount_type}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                          >
                            <option value="">Select Discount Type</option>
                            <option value="percentage">Percentage</option>
                            <option value="value">Value</option>
                          </select>
                        )}
                      />
                      {errors.discount_type && <p className="text-red-500 text-sm">{errors.discount_type.message}</p>}
                    </div>
                    {/* Discount Value */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Discount Value
                      </label>
                      <Controller
                        name="discount_field"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            placeholder="Enter Discount Value"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            {...field}
                          />
                        )}
                      />
                      {errors.discount_field && (
                        <p className="text-red-500 text-sm mt-1">{errors.discount_field.message}</p>
                      )}
                    </div>

                    {/* Tags Dropdown */}
                    <div className="mb-4">
                      <label className="block text-lg text-gray-600 font-medium mb-2">Tags</label>
                      <Controller
                        name="tag_id"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            onChange={(e) => {
                              setSelectedTag(e.target.value);
                              field.onChange(e);
                            }}
                          >
                            <option value="">Select a Tag</option>
                            {tags.length > 0 ? (
                              tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                  {tag.tag_name}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>Loading tags...</option>
                            )}
                          </select>
                        )}
                      />
                      {errors?.tag_id && <p className="text-red-500 text-sm">{errors.tag_id.message}</p>}
                    </div>
                    {/* Primary Image */}
                    <div>
                      <label className="block text-lg text-gray-600 font-medium mb-2">
                        Primary Image<span className="text-red-500 ">*</span>
                      </label>
                      <Controller
                        name="primary_image"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                            onChange={(e) => {
                              field.onChange(e.target.files);
                            }}
                          />
                        )}
                      />
                      {/* {errors.primary_image && (
                        <p className="text-red-500 text-sm">{errors.primary_image.message}</p>
                      )} */}
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="col-span-4">
                  <label className="block text-lg text-gray-600 font-medium mb-2">
                    Detailed Description
                  </label>
                  <Controller
                    name="product_description"
                    control={control}
                    render={({ field }) => (
                      <ReactQuill
                        {...field}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Enter a detailed description of the product"
                        className="w-full h-[140px] rounded-md px-0 py-0 text-gray-800 focus:outline-none"
                      />
                    )}
                  />
                  {errors.product_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.product_description.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-16">
                  <button
                    onClick={() => setOpenEditModal(false)}
                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative bg-[#4318ff] text-white px-6 py-3 rounded-lg hover:bg-[#322bbf] transition-all"
                  >
                    {loading ? (
                      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                        <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-gray-600">
                <th className="px-6 py-4 text-left">
                  <div className="flex justify-between items-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === getPaginatedData().length && getPaginatedData().length > 0}
                      onChange={() => {
                        if (selectedRows.length === getPaginatedData().length) {
                          setSelectedRows([]); // Deselect all rows
                        } else {
                          setSelectedRows(getPaginatedData().map((row) => row.id)); // Select all rows
                        }
                      }}
                      disabled={getPaginatedData().length === 0}  // Disable checkbox when no data is available
                    />
                  </div>
                </th>
                <th className="px-6 py-4 text-left">Image</th>
                <th className="px-6 py-4 text-left">Brand Name</th>
                <th className="px-6 py-4 text-left">Category Name</th>
                <th className="px-6 py-4 text-left">SubCategory Name</th>
                <th className="px-6 py-4 text-left">Product Name</th>
                <th className="text-right">
                  {selectedRows.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className={`text-gray-600 hover:text-red-600 text-xl flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="relative">
                          <div className="w-6 h-6 border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <FaTrashAlt />
                      )}
                    </button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData().length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No Products found
                  </td>
                </tr>
              ) : (
                getPaginatedData().map((product) => (
                  <tr key={product.id} className="border-t group">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(product.id)}
                        onChange={() => handleRowSelection(product.id)} // Handle selection on row level
                      />
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4">{product.brand?.brand_name || product.brand || ''}</td>
                    <td className="px-6 py-4">{product.category?.name || product.category || ''}</td>
                    <td className="px-6 py-4">{product.sub_category?.name || product.sub_category || ''}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/productvariation?product_id=${product.id}&brand_id=${product.brand_id}&category_id=${product.category_id}&sub_category_id=${product.sub_category_id}`)
                        }
                        className="bg-transparent text-[#4318ff] border-2 border-[#4318ff] px-4 py-2 text-sm rounded-md cursor-pointer transition-all duration-300 hover:bg-[#4318ff1a] mt-4"
                      >
                        {product.name}
                      </button>
                    </td>
                    <td className="text-right">
                      <div className="relative inline-flex items-center space-x-2">
                        {/* Three dots button */}
                        <button className="text-gray-600 hover:text-gray-900">
                          <FaEllipsisV />
                        </button>

                        {/* Edit and Delete buttons */}
                        <div className="absolute right-0 flex space-x-2 opacity-0 group-hover:opacity-100 group-hover:flex transition-all duration-200">
                          <button
                            onClick={() => handleEditRow(product)}
                            className="text-navy-700 hover:bg-gray-200 p-2 rounded-md hidden group-hover:inline-flex"
                          >
                            <FaEdit className="mr-2 text-black" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(product.id)}
                            className="text-red-600 hover:bg-gray-200 p-2 rounded-md hidden group-hover:inline-flex"
                          >
                            <FaTrashAlt className="mr-2" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="mr-2">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              {[10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>

          <div className="flex space-x-4">
            {/* Showing Item Range */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${currentPage === 1
                ? 'bg-[#4318ff] text-white opacity-50 cursor-not-allowed'
                : 'bg-[#4318ff] text-white hover:bg-[#3700b3]'} px-6 py-2 rounded-[20px]`}
            >
              Back
            </button>
            <span className="text-gray-600 mt-2">
              {` ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredProducts.length)} of ${filteredProducts.length} items`}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || filteredProducts.length === 0}
              className={`${currentPage === totalPages || filteredProducts.length === 0
                ? 'bg-[#4318ff] text-white opacity-50 cursor-not-allowed'
                : 'bg-[#4318ff] text-white hover:bg-[#3700b3]'} px-6 py-2 rounded-[20px]`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {openDeleteDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-20 bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this Product?</h2>
              <div className="flex justify-end">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 mr-4 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmation}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center justify-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    'Delete'
                  )}
                  {isDeleting ? 'Deleting...' : ''}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
