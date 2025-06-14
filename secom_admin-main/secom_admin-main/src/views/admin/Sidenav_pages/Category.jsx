import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiSearch } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { TokenExpiration } from 'views/auth/TokenExpiration ';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from 'components/navbar';

function Category() {
    const [tableData, setTableData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [rowIdToDelete, setRowIdToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [brands, setBrands] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const validationSchemaAdd = Yup.object({
        brand_id: Yup.string().required('Brand is required'),
        categoryName: Yup.string().required('Category Name is required'),
        // categoryImage: Yup.mixed()
        //     .required('Category Image is required')
        //     .test('fileType', 'Only image files are allowed', (value) => {
        //         return value && value instanceof File && value.type.startsWith('image/');
        //     }),
    });

    const validationSchemaEdit = Yup.object({
        categoryName: Yup.string().required('Category Name is required'),
        brand_id: Yup.string().required('Brand is required'),
    });

    const { reset, control, handleSubmit, setValue, trigger, formState: { errors } } = useForm({
        resolver: yupResolver(openAddModal ? validationSchemaAdd : validationSchemaEdit),
        defaultValues: {
            brandName: selectedCategory?.name || '',
            brandImage: selectedCategory?.photo || null,
        },
    });


    // Fetch brand data from the API
    const fetchBrandData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/admin/get_all_brand');
            setBrands(response.data);
        } catch (error) {
            console.error('Error fetching brand data:', error);
        }
    };

    // Fetch category data from the API
    const fetchCategoryData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/admin/get_all_category');
            setTableData(response.data);  // Store the data
            setFilteredData(response.data);  // Show all data initially
            setTotalItems(response.data.length);  // Set the total number of items
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };

    useEffect(() => {
        fetchCategoryData();
        fetchBrandData();  // Fetch category data when the component mounts
    }, []);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Calculate total pages based on filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Reset current page when itemsPerPage or searchQuery changes
    useEffect(() => {
        setCurrentPage(1);  // Reset to page 1 when search or itemsPerPage changes
    }, [searchQuery, itemsPerPage]);

    // Filter categories based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((category) =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (category.brand && category.brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredData(filtered);
            setTotalItems(filtered.length);  // Update total items based on filtered data
        } else {
            setFilteredData(tableData);  // Reset to all data if no search query
            setTotalItems(tableData.length);
        }
    }, [searchQuery, tableData]);

    // Get paginated data
    const getPaginatedData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);  // Paginate after filtering
    };
    useEffect(() => {
        if (selectedCategory) {
            setCategoryData(selectedCategory);
            setValue('categoryName', selectedCategory.name);
            setImagePreview(selectedCategory.photo);
            setValue('brand_id', selectedCategory.brand_id);
        }
    }, [selectedCategory, setValue]);

    // Handle Image Change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setValue('categoryImage', file);
        }
    };

    // const handleFormSubmit = async (data) => {
    //     setLoading(true);

    //     const formData = new FormData();
    //     formData.append('brand_id', data.brand_id);
    //     formData.append('name', data.categoryName);
    //     if (data.categoryImage instanceof File) formData.append('photo', data.categoryImage);

    //     try {
    //         const accessToken = localStorage.getItem('OnlineShop-accessToken');
    //         const url = 'https://yrpitsolutions.com/ecom_backend/api/admin/save_category'; // For new category

    //         await axios.post(url, formData, {
    //             headers: { Authorization: `Bearer ${accessToken}` },
    //         });

    //         fetchCategoryData();
    //         setOpenAddModal(false);
    //         setCategoryImage(null);
    //         reset();
    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleFormUpdate = async (data) => {
    //     setLoading(true);

    //     const formData = new FormData();
    //     formData.append('brand_id', data.brand_id);
    //     formData.append('name', data.categoryName);
    //     if (data.categoryImage instanceof File) formData.append('photo', data.categoryImage);

    //     try {
    //         const accessToken = localStorage.getItem('OnlineShop-accessToken');
    //         const url = `https://yrpitsolutions.com/ecom_backend/api/admin/update_category_by_id/${selectedCategory.id}`;
    //         formData.append('_method', 'put');

    //         await axios.post(url, formData, {
    //             headers: { Authorization: `Bearer ${accessToken}` },
    //         });

    //         fetchCategoryData();
    //         setOpenEditModal(false);
    //         setCategoryImage(null);
    //         reset();
    //     } catch (error) {
    //         console.error('Error updating category:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleFormSubmit = async (data) => {
        setLoading(true);

        // Prevent form submission if category name already exists in the table
        const categoryName = data.categoryName;
        const existingCategory = getPaginatedData().find(category => category.name.toLowerCase() === categoryName.toLowerCase());
    
        if (existingCategory) {
            toast.error("This category already exists.Provide a different name.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false); // Ensure loading state is stopped
            return; // Prevent form submission if the category name already exists
        }
    
        const formData = new FormData();
        formData.append('brand_id', data.brand_id);
        formData.append('category_id', data.category_id);
        formData.append('name', data.categoryName);
        if (data.categoryImage instanceof File) formData.append('photo', data.categoryImage);
    
        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            const url = 'https://yrpitsolutions.com/ecom_backend/api/admin/save_category'; // For new category
    
            await axios.post(url, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
    
            // Success Toast for category creation
            toast.success("Category added successfully!", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    
            fetchCategoryData();
            setOpenAddModal(false);
            setCategoryImage(null);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
    
            // Error Toast if submission fails
            toast.error("Failed to add category. Please try again.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFormUpdate = async (data) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('brand_id', data.brand_id);
        formData.append('name', data.categoryName);
        if (data.categoryImage instanceof File) formData.append('photo', data.categoryImage);

        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            const url = `https://yrpitsolutions.com/ecom_backend/api/admin/update_category_by_id/${selectedCategory.id}`;
            formData.append('_method', 'put');

            await axios.post(url, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Success Toast for category update
            toast.success("Category updated successfully!", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            fetchCategoryData();
            setOpenEditModal(false);
            setCategoryImage(null);
            reset();
        } catch (error) {
            console.error('Error updating category:', error);

            // Error Toast if update fails
            toast.error("Failed to update category. Please try again.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setValue('BarndName', '');
        setValue('categoryName', '');
        setImagePreview(null);
        setOpenAddModal(true);
        reset();
    };

    const handleEditRow = (category) => {
        setSelectedCategory(category);
        trigger();
        setOpenEditModal(true);
    };


    const handleDeleteRow = (id) => {
        setRowIdToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirmation = async () => {
        setIsDeleting(true);
        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            const response = await axios.delete(`https://yrpitsolutions.com/ecom_backend/api/admin/delete_category_by_id/${rowIdToDelete}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                // Show success toast after successful delete
                toast.success("Category deleted successfully!", {
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                fetchCategoryData();  // Refresh the data after successful delete
                setOpenDeleteDialog(false); // Close the delete confirmation dialog
            } else {
                throw new Error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            // Show error toast if the delete operation fails
            toast.error("Failed to delete the category. Please try again.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setIsDeleting(false);  // Reset the loading state
        }
    };


    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };
    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            for (let id of selectedRows) {
                await axios.delete(`https://yrpitsolutions.com/ecom_backend/api/admin/delete_category_by_id/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }

            // Show success toast after bulk delete
            toast.success("Selected categories deleted successfully!", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            window.location.reload();  // Reload the page to reflect changes
            await fetchCategoryData(); // Refresh the data
            setSelectedRows([]); // Clear selection after bulk delete
        } catch (error) {
            console.error('Error deleting selected categories:', error);

            // Show error toast if bulk deletion fails
            toast.error("Failed to delete selected categories. Please try again.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };


    const handleRowSelection = (id) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((rowId) => rowId !== id)
                : [...prevSelected, id]
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
    return (
        <div className=" min-h-screen pt-6">
                <Navbar brandText={"Category"} />
            <TokenExpiration />
            <ToastContainer />
            <div className="w-full mx-auto">
                <span className="flex items-center mt-4 w-full gap-6">
                    {/* Search bar */}
                    <div className="relative flex flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
                        <div className="flex h-full w-full items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white">
                            <p className="pl-3 pr-2 text-xl">
                                <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                            </p>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by Category Name.."
                                className="block w-full rounded-full text-case font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                            />
                        </div>
                    </div>


                    <button
                        onClick={handleAddCategory}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
                    >
                        <FaPlus className="mr-2" /> Add Category
                    </button>
                </span>

                {openAddModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={() => setOpenAddModal(false)} // Close modal on background click
                    >
                        <div
                            className="bg-white rounded-lg shadow-2xl p-8 "
                            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner content click
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add Category</h2>


                            {/* Brand Dropdown */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Brand<span className="text-red-500 ">*</span></label>
                                <Controller
                                    name="brand_id"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                        >
                                            <option value="">Select a Brand</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.brand_name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.brand_id && <p className="text-red-500 text-sm">{errors.brand_id.message}</p>} {/* Error message for brand dropdown */}
                            </div>


                            {/* Category Name Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Category Name <span className="text-red-500 ">*</span></label>
                                <Controller
                                    name="categoryName"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            placeholder="Enter Category Name"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName.message}</p>}
                            </div>

                            {/* Category Image Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Category Image (151x135)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange} // Calls the function to handle image change
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                />
                                {/* {errors.categoryImage && <p className="text-red-500 text-sm">{errors.categoryImage.message}</p>} */}
                                {/* {imagePreview && <img src={imagePreview} alt="Image Preview" className="mt-4 w-24 h-24 object-cover" />} */}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={() => setOpenAddModal(false)} // Close the modal
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit(handleFormSubmit)} // Handle form submission
                                    disabled={loading} // Disable if loading
                                    className="relative bg-[#4318ff] text-white px-6 py-3 rounded-lg flex items-center ml-auto max-w-xs"
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
                        </div>
                    </div>
                )}

                {openEditModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={() => {
                            setOpenAddModal(false);  // Close the modal
                            reset();  // Reset the form
                        }}>
                        <div className="bg-white rounded-lg shadow-2xl p-8" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Edit Category</h2>

                            {/* Brand Dropdown */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Brand<span className="text-red-500 ">*</span></label>
                                <Controller
                                    name="brand_id"
                                    control={control}
                                    defaultValue={categoryData?.brand_id || ''}  // Autofill with the selected category's brand ID
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                        >
                                            <option value="">Select a Brand</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.brand_name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.brand_id && !categoryData?.brand_id && <p className="text-red-500 text-sm">{errors.brand_id.message}</p>}
                            </div>

                            {/* Category Name Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Category Name<span className="text-red-500 ">*</span></label>
                                <Controller
                                    name="categoryName"
                                    control={control}
                                    defaultValue={categoryData?.name || ''}  // Autofill with the selected category's name
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            placeholder="Enter Category Name"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.categoryName && !categoryData?.name && <p className="text-red-500 text-sm">{errors.categoryName.message}</p>}
                            </div>

                            {/* Category Image Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Category Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                />
                                {errors.categoryImage && <p className="text-red-500 text-sm">{errors.categoryImage.message}</p>}
                                {/* {categoryData?.photo && (
                                    <div className="mt-4">
                                        <img
                                            src={categoryData.photo} // Show the existing image for the selected category
                                            alt="Current Category"
                                            className="w-24 h-24 object-cover"
                                        />
                                    </div>
                                )} */}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={() => setOpenEditModal(false)} // Close the modal
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit(handleFormUpdate)} // Handle form submission
                                    disabled={loading} // Disable if loading
                                    className="relative bg-[#4318ff] text-white px-6 py-3 rounded-lg flex items-center ml-auto max-w-xs"
                                >
                                    {loading ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Table */}
                {/* <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-gray-600">
                                <th className="px-6 py-4 text-left">
                                    <div className="flex justify-between items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.length === getPaginatedData().length && getPaginatedData().length > 0}  // Ensure checkbox is checked only when there's data
                                            onChange={() => {
                                                if (selectedRows.length === getPaginatedData().length) {
                                                    setSelectedRows([]);  // Deselect all rows
                                                } else {
                                                    setSelectedRows(getPaginatedData().map((row) => row.id));  // Select all rows
                                                }
                                            }}
                                            disabled={getPaginatedData().length === 0}  // Disable checkbox when no data
                                        />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">Image</th>
                                <th className="px-6 py-4 text-left">Brand Name</th>
                                <th className="px-6 py-4 text-left">Category Name</th>
                                <th className="px-6 py-4 text-left">
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
                                    <td colSpan="5" className="text-center py-4">No data available</td>
                                </tr>
                            ) : (
                                getPaginatedData().map((category) => (
                                    <tr key={category.id} className="border-t">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(category.id)}
                                                onChange={() => handleRowSelection(category.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <img
                                                src={category.photo || '/default-image.png'}
                                                alt={category.name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{category.brand ? category.brand.brand_name : ''}</td>
                                        <td className="px-6 py-4">{category.name}</td>
                                        <td className="text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === category.id ? null : category.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {openDropdown === category.id && (
                                                    <div
                                                        ref={dropdownRef}
                                                        className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-40 z-10"
                                                    >
                                                        <div
                                                            onClick={() => {
                                                                handleEditRow(category);
                                                                setOpenDropdown(null);
                                                            }}
                                                            className="flex items-center px-4 py-2 text-navy-700 hover:bg-gray-200 cursor-pointer"
                                                        >
                                                            <FaEdit className="mr-2 text-black" />
                                                            Edit
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                handleDeleteRow(category.id);
                                                                setOpenDropdown(null);
                                                            }}
                                                            className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-200 cursor-pointer"
                                                        >
                                                            <FaTrashAlt className="mr-2" />
                                                            Delete
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div> */}

                <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-gray-600">
                                <th className="px-6 py-4 text-left">
                                    <div className="flex justify-between items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.length === getPaginatedData().length && getPaginatedData().length > 0}  // Ensure checkbox is checked only when there's data
                                            onChange={() => {
                                                if (selectedRows.length === getPaginatedData().length) {
                                                    setSelectedRows([]);  // Deselect all rows
                                                } else {
                                                    setSelectedRows(getPaginatedData().map((row) => row.id));  // Select all rows
                                                }
                                            }}
                                            disabled={getPaginatedData().length === 0}  // Disable checkbox when no data
                                        />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">Image</th>
                                <th className="px-6 py-4 text-left">Brand Name</th>
                                <th className="px-6 py-4 text-left">Category Name</th>
                                <th className="px-6 py-4 text-left">
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
                                    <td colSpan="5" className="text-center py-4">No data available</td>
                                </tr>
                            ) : (
                                getPaginatedData().map((category) => (
                                    <tr key={category.id} className="border-t group">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(category.id)}
                                                onChange={() => handleRowSelection(category.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <img
                                                src={category.photo || '/default-image.png'}
                                                alt={category.name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{category.brand ? category.brand.brand_name : ''}</td>
                                        <td className="px-6 py-4">{category.name}</td>
                                        <td className="text-right">
                                            <div className="flex items-center space-x-2">
                                                {/* Ellipsis icon */}
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === category.id ? null : category.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <FaEllipsisV />
                                                </button>

                                                {/* Icons visible when hovered */}
                                                <div className="absolute right-40 flex space-x-2 opacity-0 group-hover:opacity-100 group-hover:flex transition-all duration-200">
                                                    <button
                                                        onClick={() => {
                                                            handleEditRow(category);
                                                        }}
                                                        className="text-navy-700 hover:bg-gray-200"
                                                    >
                                                        <FaEdit className="mr-2 text-black" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteRow(category.id);
                                                        }}
                                                        className="text-red-600 hover:bg-gray-200"
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
                        {[ 10, 20, 50, 100].map((option) => (
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
                            : 'bg-[#4318ff] text-white hover:bg-[#3700b3]'
                            } px-6 py-2 rounded-[20px]`}
                    >
                        Back
                    </button>
                    <span className="text-gray-600 mt-2">
                        {` ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${currentPage === totalPages || totalItems === 0
                            ? 'bg-[#4318ff] text-white opacity-50 cursor-not-allowed'
                            : 'bg-[#4318ff] text-white hover:bg-[#3700b3]'
                            } px-6 py-2 rounded-[20px]`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {openDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-20 bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this Category?</h2>
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

    );
}

export default Category;
