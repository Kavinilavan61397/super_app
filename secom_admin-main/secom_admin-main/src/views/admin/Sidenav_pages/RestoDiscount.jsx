import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import Navbar from 'components/navbar';


function RestoDiscount() {
    const [tableData, setTableData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [rowIdToDelete, setRowIdToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]); // State to store filtered data

    // Yup validation schema
    const validationSchemaAdd = Yup.object({
    });

    const validationSchemaEdit = Yup.object({
    });

    const { reset, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(openAddModal ? validationSchemaAdd : validationSchemaEdit),
        defaultValues: {
        },
    });



    const fetchDiscountData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/get_all_restaurant_discount');
            setTableData(response.data.data);
            setTotalItems(response.data.length);
            console.log(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [products, setProducts] = useState([]);
    const [vendorId, setVendorId] = useState(null); // State to store vendor_id

    const fetchProductData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/getAllRestaurantProductVariations');
            const fetchedProductsObj = response.data.data;

            // Convert object with numeric keys into an array
            const fetchedProducts = Object.values(fetchedProductsObj);

            setProducts(fetchedProducts);

            if (fetchedProducts.length > 0) {
                setVendorId(fetchedProducts[0].restaurant_product.vendor_id);
            }

            console.log(fetchedProducts); // Now an array
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        fetchDiscountData();
        fetchProductData();
    }, [itemsPerPage]);

    const handleFormSubmit = async (data) => {
        const formData = new FormData();
        formData.append('restaurant_discount_name', data.restaurant_discount_name);
        formData.append('restaurant_product_variation_id', data.restaurant_product_variation_id);
        formData.append('restaurant_discount_type', data.restaurant_discount_type);
        formData.append('restaurant_discount_amount', data.restaurant_discount_amount);
        formData.append('status', data.status);

        formData.append('vendor_id', vendorId);

        setLoading(true);
        const accessToken = localStorage.getItem('OnlineShop-accessToken');
        const url = 'https://yrpitsolutions.com/ecom_backend/api/admin/save_restaurant_discount';

        try {
            await axios.post(url, formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            fetchDiscountData();
            setOpenAddModal(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Display user-friendly error message here
        } finally {
            setLoading(false);
        }
    };

    const handleFormUpdate = async (data) => {
        setLoading(true);

        const formData = new FormData();

        formData.append('restaurant_discount_name', data.restaurant_discount_name || selectedBrand.restaurant_discount_name);
        formData.append('restaurant_product_variation_id', data.restaurant_product_variation_id || selectedBrand.restaurant_product_variation_id);
        formData.append('restaurant_discount_type', data.restaurant_discount_type || selectedBrand.restaurant_discount_type);
        formData.append('restaurant_discount_amount', data.restaurant_discount_amount || selectedBrand.restaurant_discount_amount);
        formData.append('status', data.status || selectedBrand.status);
        formData.append('_method', 'PUT');

        formData.append('vendor_id', vendorId);

        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            const url = `https://yrpitsolutions.com/ecom_backend/api/admin/update_save_restaurant_discount_by_id/${selectedBrand.id}`;

            setTimeout(async () => {
                try {
                    await axios.post(url, formData, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    fetchDiscountData();
                    setOpenEditModal(false);
                    reset();
                } catch (error) {
                    console.error('Error updating form:', error);
                } finally {
                    setLoading(false);
                }
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.error('Error preparing form data:', error);
        }
    };

    const handleAddBrand = () => {
        setSelectedBrand(null);
        setValue('restaurant_discount_name', '');
        setValue('restaurant_product_variation_id', '');
        setValue('restaurant_discount_type', '');
        setValue('restaurant_discount_amount', '');
        setValue('status', '');
        setValue('vendor_id', '');
        setOpenAddModal(true);
    };

    const handleEditRow = (discount) => {
        setSelectedBrand(discount);
        setValue('restaurant_discount_name', discount.restaurant_discount_name);
        setValue('restaurant_product_variation_id', discount.restaurant_product_variation_id);
        setValue('restaurant_discount_type', discount.restaurant_discount_type);
        setValue('restaurant_discount_amount', discount.restaurant_discount_amount);
        setValue('status', discount.status);
        setValue('vendor_id', discount.vendor_id);
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
            await axios.delete(`https://yrpitsolutions.com/ecom_backend/api/admin/delete_restaurant_discount_by_id/${rowIdToDelete}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            fetchDiscountData();
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting Discount:', error);
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
                await axios.delete(`https://yrpitsolutions.com/ecom_backend/api/admin/delete_restaurant_discount_by_id/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }
            await fetchDiscountData(); // Refresh the data
            setSelectedRows([]); // Clear selection after bulk delete
        } catch (error) {
            console.error('Error deleting selected Discounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((discount) =>
                discount.restaurant_discount_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
            setTotalItems(filtered.length);
            setCurrentPage(1);
        } else {
            setFilteredData(tableData);
            setTotalItems(tableData.length);
        }
    }, [searchQuery, tableData]);

    const handleRowSelection = (id) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
    };

    // Get paginated data
    const getPaginatedData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    };


    // const [openDropdown, setOpenDropdown] = useState(null);
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
            <Navbar brandText={"Discount"} />
            {/* <TokenExpiration /> */}
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
                                placeholder="Search by Discount Name..."
                                onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on change
                                value={searchQuery} // Bind searchQuery to the input field
                                className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAddBrand}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
                    >
                        <FaPlus className="mr-2" /> Add Discount
                    </button>
                </span>

                {openAddModal && !openEditModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={() => setOpenAddModal(false)}
                    >
                        <div
                            className="bg-white rounded-lg shadow-2xl p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Discount</h2>

                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Discount Name */}
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Discount Name<span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="restaurant_discount_name"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Discount Name"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.restaurant_discount_name && <p className="text-red-500 text-sm">{errors.restaurant_discount_name.message}</p>}
                                </div>

                                {/* Discount Field */}
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Discount Amount<span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="restaurant_discount_amount"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Discount Amount"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.restaurant_discount_amount && <p className="text-red-500 text-sm">{errors.restaurant_discount_amount.message}</p>}
                                </div>
                            </div>

                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Discount For */}
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Variation</label>
                                    <Controller
                                        name="restaurant_product_variation_id"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            >
                                                <option value="">Select Variation</option>
                                                {products.map((variation) => (
                                                    <option key={variation.id} value={variation.id}>
                                                        {variation.product_variation_name}
                                                    </option>
                                                ))}
                                            </select>

                                        )}
                                    />
                                    {errors.product_variation_name && <p className="text-red-500 text-sm">{errors.product_variation_name.message}</p>}
                                </div>

                                {/* Discount Type */}
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Discount Type<span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="restaurant_discount_type"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            >
                                                <option value="">Select Discount Type</option>
                                                <option value="percentage">Percentage</option>
                                                <option value="value">Value</option>
                                            </select>
                                        )}
                                    />
                                    {errors.restaurant_discount_type && (
                                        <p className="text-red-500 text-sm">{errors.restaurant_discount_type.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Status<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    )}
                                />
                                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={() => setOpenAddModal(false)}
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit(handleFormSubmit)}
                                    disabled={loading}
                                    className={`relative px-6 py-3 rounded-lg flex items-center ml-auto max-w-xs ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#4318ff] text-white"
                                        }`}
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
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={() => setOpenEditModal(false)}
                    >
                        <div
                            className="bg-white rounded-lg shadow-2xl p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Discount</h2>

                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Discount Name */}
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Discount Name<span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="restaurant_discount_name"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Discount Name"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.restaurant_discount_name && <p className="text-red-500 text-sm">{errors.restaurant_discount_name.message}</p>}
                                </div>

                                {/* Discount Field */}
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Discount Amount<span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="restaurant_discount_amount"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Discount Amount"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.restaurant_discount_amount && <p className="text-red-500 text-sm">{errors.restaurant_discount_amount.message}</p>}
                                </div>
                            </div>

                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Discount For */}
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Discount For<span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="restaurant_product_variation_id"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            >
                                                <option value="">Select a Product Variation</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.product_variation_name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                    {errors.restaurant_product_variation_id && (
                                        <p className="text-red-500 text-sm">{errors.restaurant_product_variation_id.message}</p>
                                    )}
                                </div>

                                {/* Discount Type */}
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Discount Type<span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="restaurant_discount_type"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            >
                                                <option value="">Select Discount Type</option>
                                                <option value="percentage">Percentage</option>
                                                <option value="value">Value</option>
                                            </select>
                                        )}
                                    />
                                    {errors.restaurant_discount_type && (
                                        <p className="text-red-500 text-sm">{errors.restaurant_discount_type.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Status<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    )}
                                />
                                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                            </div>

                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={() => setOpenEditModal(false)}
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit(handleFormUpdate)}
                                    disabled={loading}
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
                                                const data = getPaginatedData();
                                                if (data.length === 0) return; // Do nothing if there's no data
                                                if (selectedRows.length === data.length) {
                                                    setSelectedRows([]); // Deselect all
                                                } else {
                                                    setSelectedRows(data.map((row) => row.id)); // Select all
                                                }
                                            }}
                                        />

                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">Discount Name</th>
                                <th className="px-6 py-4 text-left">Discount Type</th>
                                <th className="px-6 py-4 text-left">Discount Amount</th>
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
                            {getPaginatedData().length > 0 ? (
                                getPaginatedData().map((discount) => (
                                    <tr key={discount.id} className="border-t">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(discount.id)}
                                                onChange={() => handleRowSelection(discount.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">{discount.restaurant_discount_name}</td>
                                        <td className="px-6 py-4">{discount.restaurant_discount_type}</td>
                                        <td className="px-6 py-4">{discount.restaurant_discount_amount}</td>
                                        <td className="text-right group relative">
                                            <div className="flex items-center space-x-2">
                                                {/* Ellipsis icon */}
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === discount.id ? null : discount.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {/* Edit and Delete icons visible on hover */}
                                                <div className="absolute right-20 flex space-x-2 opacity-0 group-hover:opacity-100 group-hover:flex transition-all duration-200">
                                                    <button
                                                        onClick={() => {
                                                            handleEditRow(discount);
                                                            setOpenDropdown(null);
                                                        }}
                                                        className="text-navy-700 hover:bg-gray-200"
                                                    >
                                                        <FaEdit className="mr-2 text-black" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteRow(discount.id);
                                                            setOpenDropdown(null);
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
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No Discount data found
                                    </td>
                                </tr>
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
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this Discount Data?</h2>
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

export default RestoDiscount;
