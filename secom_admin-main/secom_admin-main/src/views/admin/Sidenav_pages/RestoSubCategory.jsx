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

function RestoSubCategory() {
    const [tableData, setTableData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryImage, setCategoryImage] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [rowIdToDelete, setRowIdToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0); const [isDeleting, setIsDeleting] = useState(false);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    
    const validationSchemaAdd = Yup.object({
        // subCategoryName: Yup.string().required('SubCategory Name is required'),
        // brand_id: Yup.string().required('Brand is required'),
        // category_id: Yup.string().required('Category is required'),
    });
    
    const validationSchemaEdit = Yup.object({
        // subCategoryName: Yup.string().required('SubCategory Name is required'),
        // brand_id: Yup.string().required('Brand is required'),
        // category_id: Yup.string().required('Category is required'),
    });
    
    const { reset, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(openAddModal ? validationSchemaAdd : validationSchemaEdit),
        defaultValues: {
            // subCategoryName: selectedCategory ? selectedCategory.name : '',
            // category_id: selectedCategory ? selectedCategory.category_id : '',
            // brand_id: selectedCategory ? selectedCategory.brand_id : '',
        }
    });
    
    const [restocat, setRestoCat] = useState([]);
    const [vendorId, setVendorId] = useState(null); 

    useEffect(() => {
        const fetchRestoCatData = async () => {
          try {
            const response = await axios.get(
              'https://yrpitsolutions.com/ecom_backend/api/get_all_restaurant_categories'
            );
            console.log('Categories fetched:', response.data);
            const categories = response.data || [];
            setRestoCat(categories);
    
            // Assuming vendor_id is the same for all categories
            if (categories.length > 0) {
              setVendorId(categories[0].vendor_id);
            }
          } catch (error) {
            console.error('Error fetching categories:', error);
            setRestoCat([]);
          }
        };
    
        fetchRestoCatData();
      }, []);

      useEffect(() => {
        console.log('restocat updated:', restocat);
      }, [restocat]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); 
    };

    useEffect(() => {
        fetchSubCategoryData();
    }, [searchQuery, currentPage, itemsPerPage]);

    const fetchSubCategoryData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/get_all_restaurant_sub_categories');
            const filteredData = response.data.filter((subcategory) =>
                subcategory.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setTableData(filteredData);
            const filteredItemsCount = filteredData.length;
            setTotalItems(filteredItemsCount);

        } catch (error) {
            console.error('Error fetching subcategory data:', error);
        }
    };

    useEffect(() => {
        fetchSubCategoryData();
    }, [itemsPerPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((restocategory) =>
                restocategory.category_name.toLowerCase().includes(searchQuery.toLowerCase()) 
            );
            setFilteredData(filtered);
            setTotalItems(filtered.length);  // Update total items based on filtered data
        } else {
            setFilteredData(tableData);  // Reset to all data if no search query
            setTotalItems(tableData.length);
        }
    }, [searchQuery, tableData]);


    const getPaginatedData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);  // Paginate after filtering
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleCloseModal = () => {
        setOpenAddModal(false);
        fetchSubCategoryData();
    };


    const handleFormSubmit = async (data) => {
        setLoading(true);

        // Prevent form submission if subcategory name already exists in the table
        const subCategoryName = data.subCategoryName;
        const existingSubCategory = getPaginatedData().find(subCategory => subCategory.sub_category_name.toLowerCase() === subCategoryName.toLowerCase());

        if (existingSubCategory) {
            toast.error("This subcategory already exists. Provide a different name.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false); // Ensure loading state is stopped
            return; // Prevent form submission if the subcategory name already exists
        }

        const formData = new FormData();
        formData.append('restaurant_category_id', data.restaurant_category_id);
        formData.append('sub_category_name', data.subCategoryName);
        formData.append('vendor_id', vendorId);
        formData.append('status', 1);

        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            await axios.post('https://yrpitsolutions.com/ecom_backend/api/admin/save_restaurant_sub_categories', formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Success toast message
            toast.success('Subcategory added successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });

            // Reset form and fetch updated data
            reset();
            setOpenAddModal(false);
            fetchSubCategoryData();
        } catch (error) {
            console.error('Error submitting form:', error);

            // Error toast message
            toast.error('Something went wrong! Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFormUpdate = async (data) => {
        setLoading(true);

        const formData = new FormData();

        formData.append('restaurant_category_id', data.restaurant_category_id);
        formData.append('sub_category_name', data.subCategoryName);
        formData.append('vendor_id', data.vendorId);

        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            const url = `https://yrpitsolutions.com/ecom_backend/api/admin/update_restaurant_sub_categories_by_id/${selectedCategory.id}`;
            formData.append('_method', 'put');

            await axios.post(url, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Success toaster message
            toast.success('Subcategory updated successfully!', {
                position: "top-right",
                autoClose: 3000, hideProgressBar: true,
            });

            fetchSubCategoryData();
            setOpenEditModal(false);
            setCategoryImage(null);
            reset();
        } catch (error) {
            console.error('Error updating category:', error);

            // Error toaster message
            toast.error('Failed to update subcategory. Please try again.', {
                position: "top-right",
                autoClose: 3000, hideProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = () => {
        setOpenAddModal(true);
        setValue('vendor_id', '');
        setValue('restaurant_category_id', '');
        setValue('sub_category_name', '');
        setValue('status', '');
        reset();
    };

    const handleEditRow = (restocategory) => {
        setSelectedCategory(restocategory);
        setOpenEditModal(true);
        reset({
            restaurant_category_id: restocategory.restaurant_category_id || '',
            subCategoryName: restocategory.sub_category_name || '',
            vendorId: restocategory.vendor_id || vendorId, // fallback to default vendorId
          });
    };

    const handleRowSelection = (id) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
    };

    const handleDeleteRow = (id) => {
        setRowIdToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirmation = async () => {
        setIsDeleting(true);
        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            await axios.delete(`https://yrpitsolutions.com/ecom_backend/api/admin/delete_restaurant_sub_category_by_id/${rowIdToDelete}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Success toaster message
            toast.success('Subcategory deleted successfully!', {
                position: "top-right",
                autoClose: 3000, hideProgressBar: true,
            });

            fetchSubCategoryData();
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting category:', error);

            // Error toaster message
            toast.error('Failed to delete subcategory. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
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
            for (let id of selectedRows) {
                await axios.delete(`https://yrpitsolutions.com/ecom_backend/api/admin/delete_restaurant_sub_category_by_id/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }

            // Success toaster message
            toast.success('Selected subcategories deleted successfully!', {
                position: "top-right",
                autoClose: 3000, hideProgressBar: true,
            });

            await fetchSubCategoryData();
            setSelectedRows([]);
        } catch (error) {
            console.error('Error deleting selected categories:', error);

            // Error toaster message
            toast.error('Failed to delete selected subcategories. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
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

    return (
        <div className=" min-h-screen pt-6">
            <Navbar brandText={"Sub Category"} />
            <TokenExpiration />
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
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search by Sub Category Name..."
                                className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAddCategory}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
                    >
                        <FaPlus className="mr-2" /> Add Sub Category
                    </button>
                </span>

                {openAddModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={() => {
                            setOpenAddModal(false);
                            reset(); // Reset the form when closing the modal
                        }}
                    >
                        <div
                            className="bg-white rounded-lg shadow-2xl p-10 max-w-xl w-[35%]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add Sub Category</h2>

                            {/* Category Dropdown */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Category<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="restaurant_category_id"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                        >
                                            <option value="">Select a Category</option>
                                            {restocat.map((restocat) => (
                                                <option key={restocat.id} value={restocat.id}>
                                                    {restocat?.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.restaurant_category_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.restaurant_category_id.message}
                                    </p>
                                )}
                            </div>

                            {/* SubCategory Name Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Sub Category Name<span className="text-red-500">*</span></label>
                                <Controller
                                    name="subCategoryName"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            placeholder="Enter SubCategory Name"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.subCategoryName && <p className="text-red-500 text-sm">{errors.subCategoryName.message}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={() => {
                                        setOpenAddModal(false);
                                        reset(); // Reset the form when closing the modal
                                    }}
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit(handleFormSubmit)}
                                    disabled={loading}
                                    className="relative bg-[#4318ff] text-white px-6 py-3 rounded-lg"
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
                        onClick={() => setOpenEditModal(false)}>
                        <div className="bg-white rounded-lg shadow-2xl p-10 max-w-xl w-[35%]  " onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Edit Sub Category</h2>

                            {/* Category Dropdown */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">Category<span className="text-red-500 ">*</span></label>
                                <Controller
                                    name="restaurant_category_id"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                        >
                                            <option value="">Select a Category</option>
                                            {restocat.map((restocategory) => (
                                                <option key={restocategory.id} value={restocategory.id}>
                                                    {restocategory.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.restaurant_category_id && <p className="text-red-500 text-sm">{errors.restaurant_category_id.message}</p>}
                            </div>


                            {/* SubCategory Name Input */}
                            <div className="mb-2">
                                <label className="block text-lg text-gray-600 font-medium mb-2">SubCategory Name<span className="text-red-500 ">*</span></label>
                                <Controller
                                    name="subCategoryName"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            placeholder="Enter SubCategory Name"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.subCategoryName && <p className="text-red-500 text-sm">{errors.subCategoryName.message}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={() => setOpenEditModal(false)}
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
                                            checked={getPaginatedData().length > 0 && selectedRows.length === getPaginatedData().length}
                                            onChange={() => {
                                                if (selectedRows.length === getPaginatedData().length) {
                                                    setSelectedRows([]); // Deselect all rows
                                                } else {
                                                    setSelectedRows(getPaginatedData().map((row) => row.id)); // Select all rows
                                                }
                                            }}
                                            disabled={getPaginatedData().length === 0}  // Disable checkbox if no data
                                        />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">Image</th>
                                <th className="px-6 py-4 text-left">Category Name</th>
                                <th className="px-6 py-4 text-left">Sub-Category Name</th>
                                <th className="">
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
                                    <td colSpan="6" className="text-center py-4">No data available</td>
                                </tr>
                            ) : (
                                getPaginatedData().map((restosubcategory) => (
                                    <tr key={restosubcategory.id} className="border-t group">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(restosubcategory.id)}
                                                onChange={() => handleRowSelection(restosubcategory.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <img
                                                src={restosubcategory?.restaurant_category?.category_image}
                                                alt={restosubcategory.category_name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{restosubcategory.restaurant_category?.category_name || ''}</td>
                                        <td className="px-6 py-4">{restosubcategory.sub_category_name}</td>
                                        <td className="text-right">
                                            <div className="relative inline-block">
                                                <div className="flex items-center space-x-2">
                                                    {/* Ellipsis icon */}
                                                    <button
                                                        onClick={() => setOpenDropdown(openDropdown === restosubcategory.id ? null : restosubcategory.id)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        <FaEllipsisV />
                                                    </button>

                                                    {/* Edit and Delete buttons */}
                                                    <div className="absolute right-10 flex space-x-2 opacity-0 group-hover:opacity-100 group-hover:flex transition-all duration-200">
                                                        <button
                                                            onClick={() => {
                                                                handleEditRow(restosubcategory);
                                                            }}
                                                            className="text-navy-700 hover:bg-gray-200"
                                                        >
                                                            <FaEdit className="mr-2 text-black" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleDeleteRow(restosubcategory.id);
                                                            }}
                                                            className="text-red-600 hover:bg-gray-200"
                                                        >
                                                            <FaTrashAlt className="mr-2" />
                                                        </button>
                                                    </div>
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
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this SubCategory?</h2>
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

export default RestoSubCategory;
