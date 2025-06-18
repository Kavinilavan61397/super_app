import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { TokenExpiration } from 'views/auth/TokenExpiration ';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from 'components/navbar';
import API_CONFIG from '../../../config/api.config';
import { authService } from '../../../services/authService';
import { brandService } from '../../../services/brandService';

function BrandTable() {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [brandName, setBrandName] = useState('');
    const [brandImage, setBrandImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [rowIdToDelete, setRowIdToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);

    // Create an axios instance with auth token
    const api = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    // Add request interceptor to add auth token
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Add response interceptor to handle auth errors
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Clear auth data and redirect to login
                authService.logout();
                navigate(API_CONFIG.ROUTES.LOGIN);
            }
            return Promise.reject(error);
        }
    );

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const validationSchemaAdd = Yup.object({
        brandName: Yup.string().required('Brand Name is required'),
        brandImage: Yup.mixed()
            .required('Brand Image is required')
            .test('fileType', 'Only image files are allowed', (value) => {
                return value && value instanceof File && value.type.startsWith('image/');
            }),
    });

    const validationSchemaEdit = Yup.object({
        brandName: Yup.string().required('Brand Name is required'),
        // No image validation in edit modal
    });

    const { reset, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(openAddModal ? validationSchemaAdd : validationSchemaEdit),
        defaultValues: {
            brandName: selectedBrand?.brand_name || '',
            brandImage: selectedBrand?.photo || null,
        },
    });

    const fetchBrandsData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/get_all_brand');
            setTableData(response.data);
            setTotalItems(response.data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching brands');
            if (error.response?.status === 401) {
                navigate(API_CONFIG.ROUTES.LOGIN);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrandsData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredData(tableData); // Reset to full data if no search query
            setTotalItems(tableData.length); // Reset total items
        } else {
            const filtered = tableData.filter(brand =>
                brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered); // Apply filtering
            setTotalItems(filtered.length); // Update the number of filtered items
            setCurrentPage(1); // Reset to page 1 when the search query changes
        }
    }, [searchQuery, tableData]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, searchQuery]);

    const getPaginatedData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);  // Paginate after filtering
    };

    const handleImageSaveChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setValue('brandImage', file);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setValue('brandImage', file);
        } else {
            setImagePreview(selectedBrand?.photo || null);
            setValue('brandImage', null);
        }
    };

    const [error, setError] = useState(null);

    const handleAddBrand = () => {
        // Get brand name from the form value (or any other logic you use to get the input data)
        const brandName = getValues('brandName');  // Assuming you're using react-hook-form

        // Dismiss any active toasts before showing a new one
        toast.dismiss();

        // Proceed with opening the modal if the brand doesn't exist
        setSelectedBrand(null);
        setImagePreview(null);
        setValue('brandName', '');
        reset({
            brandName: '',
            brandImage: null,
        });
        setOpenAddModal(true);
    };

    const handleCreateBrand = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('brand_name', brandName);
            if (brandImage) {
                formData.append('brand_image', brandImage);
            }

            const url = `${API_CONFIG.BASE_URL}/api/admin/save_brand`;
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success('Brand created successfully');
                setOpenAddModal(false);
                fetchBrandsData();
                reset();
            }
        } catch (error) {
            console.error('Error creating brand:', error);
            toast.error(error.response?.data?.message || 'Error creating brand');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditRow = (brand) => {
        setSelectedBrand(brand);
        setValue('brandName', brand.brand_name);
        setImagePreview(brand.photo || null);
        setOpenEditModal(true);
    };

    const handleUpdateBrand = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('brand_name', brandName);
            if (brandImage) {
                formData.append('brand_image', brandImage);
            }

            const url = `${API_CONFIG.BASE_URL}/api/admin/update_brand_by_id/${selectedBrand.id}`;
            const response = await axios.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success('Brand updated successfully');
                setOpenEditModal(false);
                fetchBrandsData();
                reset();
            }
        } catch (error) {
            console.error('Error updating brand:', error);
            toast.error(error.response?.data?.message || 'Error updating brand');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRow = (brand) => {
        setBrandToDelete(brand);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirmation = async () => {
        setIsDeleting(true);
        try {
            const response = await axios.delete(`${API_CONFIG.BASE_URL}/api/admin/delete_brand_by_id/${brandToDelete.id}`);
            if (response.data.success) {
                toast.success('Brand deleted successfully');
                fetchBrandsData();
                setOpenDeleteDialog(false);
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
            toast.error(error.response?.data?.message || 'Error deleting brand');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const handleBulkDelete = async () => {
        try {
            const response = await axios.delete(`${API_CONFIG.BASE_URL}/api/admin/delete_brands`, {
                data: { ids: selectedRows }
            });
            if (response.data.success) {
                toast.success('Selected brands deleted successfully');
                setSelectedRows([]);
                fetchBrandsData();
            }
        } catch (error) {
            console.error('Error deleting brands:', error);
            toast.error(error.response?.data?.message || 'Error deleting brands');
        }
    };

    const handleRowSelection = (id) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
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

    // When closing or opening the modal, reset the form errors
    // Functions to open and close modals
    const closeCreateModal = () => {
        setOpenAddModal(false);
        reset(); // Reset the form data and errors
    };

    const handleOpenEditModal = () => {
        setOpenEditModal(true);
        reset(); // Reset the form data and errors
    };

    const closeEditModal = () => {
        setOpenEditModal(false);
        reset(); // Reset the form data and errors
    };

    return (
        <div className="min-h-screen pt-6">
          <Navbar brandText={"Brand"} />
          <ToastContainer />
          <div className="w-full mx-auto">
            <span className="flex items-center mt-4 w-full gap-6">
              {/* Search bar */}
              <div className="relative flex flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl shadow-shadow-500">
                <div className="flex h-full w-full items-center rounded-full text-navy-700">
                  <p className="pl-3 pr-2 text-xl">
                    <FiSearch className="h-4 w-4 text-gray-400" />
                  </p>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Brand Name.."
                    className="block w-full rounded-full font-medium text-navy-700 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
              <button
                onClick={handleAddBrand}
                className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
              >
                <FaPlus className="mr-2" /> Add Brand
              </button>
            </span>
      
            {/* Table */}
            <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-gray-600">
                    <th className="px-6 py-4 text-left">Image</th>
                    <th className="px-6 py-4 text-left">Brand Name</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">No Brand data found</td>
                    </tr>
                  ) : (
                    getPaginatedData().map((brand) => (
                      <tr key={brand.id} className="border-t group">
                        <td className="px-6 py-4">
                          <img
                            src={brand.photo || '/default-image.png'}
                            alt={brand.brand_name}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4">{brand.brand_name}</td>
                        <td className="text-right px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditRow(brand)}
                              className="text-navy-700 hover:bg-gray-200"
                            >
                              <FaEdit className="mr-2 text-black" />
                            </button>
                            <button
                              onClick={() => handleDeleteRow(brand)}
                              className="text-red-600 hover:bg-gray-200"
                            >
                              <FaTrashAlt className="mr-2" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
      
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <span className="mr-2">Show</span>
              <select
                className="border border-gray-300 rounded px-2 py-1"
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
              >
                {[10, 20, 50].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <span className="ml-2">entries</span>
            </div>
            <div>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 mr-2 disabled:opacity-50"
              >Back</button>
              <span>{currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2 disabled:opacity-50"
              >Next</button>
            </div>
          </div>
      
          {/* Add/Edit/Delete modals go here (reuse your existing modal logic, but ensure styling matches Category) */}
        </div>
      );
}

export default BrandTable;