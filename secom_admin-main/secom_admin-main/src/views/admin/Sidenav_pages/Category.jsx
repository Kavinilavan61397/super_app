import React, { useState, useEffect, useRef } from 'react';
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
import { categoryService } from '../../../services/categoryService';
import { authService } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

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
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [brands, setBrands] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const validationSchemaAdd = Yup.object({
        name: Yup.string().required('Category Name is required'),
        description: Yup.string(),
        status: Yup.boolean(),
        parent_id: Yup.number().nullable()
    });

    const validationSchemaEdit = Yup.object({
        name: Yup.string().required('Category Name is required'),
        description: Yup.string(),
        status: Yup.boolean(),
        parent_id: Yup.number().nullable()
    });

    const { reset, control, handleSubmit, setValue, trigger, formState: { errors } } = useForm({
        resolver: yupResolver(openAddModal ? validationSchemaAdd : validationSchemaEdit),
        defaultValues: {
            name: selectedCategory?.name || '',
            description: selectedCategory?.description || '',
            status: selectedCategory?.status || true,
            parent_id: selectedCategory?.parent_id || null
        },
    });

    useEffect(() => {
        const checkAuth = async () => {
            if (!authService.isAuthenticated()) {
                navigate("/auth/sign-in");
                return;
            }
            await fetchData();
        };

        checkAuth();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const categoriesResponse = await categoryService.getAllCategories();
            
            // Ensure we have an array, even if empty
            const categories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
            
            setTableData(categories);
            setFilteredData(categories);
            setTotalItems(categories.length);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message || "Failed to load data. Please try again later.");
            if (error.response?.status === 401) {
                navigate("/auth/sign-in");
            }
        } finally {
            setLoading(false);
        }
    };

    // Get paginated data
    const getPaginatedData = () => {
        if (!filteredData) return []; // Guard against undefined filteredData
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    };

    // Calculate total pages based on filtered data
    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

    // Reset current page when itemsPerPage or searchQuery changes
    useEffect(() => {
        setCurrentPage(1);  // Reset to page 1 when search or itemsPerPage changes
    }, [searchQuery, itemsPerPage]);

    // Filter categories based on search query
    useEffect(() => {
        if (!tableData) return; // Guard against undefined tableData
        
        if (searchQuery) {
            const filtered = tableData.filter((category) =>
                (category.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (category.brand?.brand_name || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
            setTotalItems(filtered.length);
        } else {
            setFilteredData(tableData);
            setTotalItems(tableData.length);
        }
    }, [searchQuery, tableData]);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            setCategoryData(selectedCategory);
            setValue('name', selectedCategory.name);
            setValue('description', selectedCategory.description || '');
            setValue('status', selectedCategory.status || true);
            setValue('parent_id', selectedCategory.parent_id || null);
            setImagePreview(selectedCategory.image);
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

    const handleFormSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description || '');
            formData.append('status', data.status);
            if (data.parent_id) {
                formData.append('parent_id', data.parent_id);
            }
            if (data.categoryImage instanceof File) {
                formData.append('category_image', data.categoryImage);
            }

            await categoryService.createCategory(formData);
            
            toast.success('Category added successfully!');
            await fetchData();
            setOpenAddModal(false);
            setCategoryImage(null);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add category. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFormUpdate = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description || '');
            formData.append('status', data.status);
            if (data.parent_id) {
                formData.append('parent_id', data.parent_id);
            }
            if (data.categoryImage instanceof File) {
                formData.append('category_image', data.categoryImage);
            }

            await categoryService.updateCategory(selectedCategory.id, formData);
            
            toast.success('Category updated successfully!');
            await fetchData();
            setOpenEditModal(false);
            setCategoryImage(null);
            reset();
        } catch (error) {
            console.error('Error updating category:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update category. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setValue('name', '');
        setValue('description', '');
        setValue('status', true);
        setValue('parent_id', null);
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
            await categoryService.deleteCategory(rowIdToDelete);
            toast.success('Category deleted successfully!');
            await fetchData();
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting category:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete category. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };
    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) {
            toast.warning('Please select categories to delete');
            return;
        }

        setIsDeleting(true);
        try {
            await categoryService.bulkDeleteCategories(selectedRows);
            toast.success('Selected categories deleted successfully!');
            fetchData();
            setSelectedRows([]);
        } catch (error) {
            console.error('Error deleting categories:', error);
            toast.error(error.response?.data?.message || 'Failed to delete categories. Please try again.');
        } finally {
            setIsDeleting(false);
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

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchData}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

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


                            {/* Category Name Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Category Name <span className="text-red-500">*</span></label>
                                <Controller
                                    name="name"
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
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            {/* Description Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Description</label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            placeholder="Enter Category Description"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>

                            {/* Parent Category Dropdown */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Parent Category</label>
                                <Controller
                                    name="parent_id"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                        >
                                            <option value="">None (Top Level Category)</option>
                                            {tableData.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </div>

                            {/* Status Toggle */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Status</label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                    )}
                                />
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
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-2 w-24 h-24 object-cover rounded"
                                    />
                                )}
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

                            {/* Category Name Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Category Name<span className="text-red-500 ">*</span></label>
                                <Controller
                                    name="name"
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
                                {errors.name && !categoryData?.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            {/* Description Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Description</label>
                                <Controller
                                    name="description"
                                    control={control}
                                    defaultValue={categoryData?.description || ''}  // Autofill with the selected category's description
                                    render={({ field }) => (
                                        <textarea
                                            placeholder="Enter Category Description"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>

                            {/* Status Toggle */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Status</label>
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue={categoryData?.status || true}  // Autofill with the selected category's status
                                    render={({ field }) => (
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                    )}
                                />
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
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Description</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedData().length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">No data available</td>
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
                                                src={category.image || '/default-image.png'}
                                                alt={category.name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{category.name}</td>
                                        <td className="px-6 py-4">{category.description || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {category.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
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
                        className="border rounded px-2 py-1"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="ml-2">entries</span>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 mr-2 disabled:opacity-50"
                    >
                        Back
                    </button>
                    <span>{`${currentPage} to ${totalPages} of ${totalItems} items`}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 ml-2 disabled:opacity-50"
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
