import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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

function HotelAttributes() {
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
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const validationSchemaAdd = Yup.object({
        amenity_name: Yup.string().required('Name is required'),
        amenity_logo: Yup.mixed()
            .required('Logo is required')
            .test('fileType', 'Only image files are allowed', (value) => {
                return value && value instanceof File && value.type.startsWith('image/');
            }),
    });

    const validationSchemaEdit = Yup.object({
        // brandName: Yup.string().required('Brand Name is required'),
    });

    const { reset, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(openAddModal ? validationSchemaAdd : validationSchemaEdit),
        defaultValues: {
            amenity_name: selectedBrand?.amenity_name || '',
            amenity_logo: selectedBrand?.amenity_logo || null,
        },
    });

    const fetchBrandData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/tourism_dup_api/api/admin/get_amenities');
            const data = response.data.data;
            console.log(response.data.data);
            setTableData(data); // Store the full data
            setFilteredData(data); // Show all data initially
            setTotalItems(data.length); // Set total items for pagination
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchBrandData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredData(tableData); // Reset to full data if no search query
            setTotalItems(tableData.length); // Reset total items
        } else {
            const filtered = tableData.filter(brand =>
                brand.amenity_name.toLowerCase().includes(searchQuery.toLowerCase())
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
            setValue('amenity_logo', file);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setValue('amenity_logo', file);
        } else {
            setImagePreview(selectedBrand?.photo || null);
            setValue('amenity_logo', null);
        }
    };

    const [error, setError] = useState(null);

    const handleAddBrand = () => {
        const brandName = getValues('amenity_logo');
        toast.dismiss();
        setSelectedBrand(null);
        setImagePreview(null);
        setValue('amenity_logo', '');
        reset({
            amenity_name: '',
            amenity_logo: null,
        });
        setOpenAddModal(true);
    };


    const handleFormSubmit = async (data) => {
        const amenity_name = data.amenity_name;
        const existingBrand = getPaginatedData().find(brand => brand.amenity_name.toLowerCase() === amenity_name.toLowerCase());

        // if (existingBrand) {
        //     toast.error("This brand already exists. Provide different name.", {
        //         autoClose: 3000,
        //         hideProgressBar: true,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //     });
        //     return; // Prevent form submission if the brand name already exists
        // }

        if (!data.amenity_logo || !(data.amenity_logo instanceof File)) {
            setError("Logo is required ");
            return;
        }

        const formData = new FormData();
        formData.append('amenity_name', data.amenity_name);
        formData.append('amenity_logo', data.amenity_logo);
        setLoading(true);

        try {
            const accessToken = localStorage.getItem('tourism_token');
            const url = 'https://yrpitsolutions.com/tourism_dup_api/api/admin/save_amenities';

            setTimeout(async () => {
                try {
                    await axios.post(url, formData, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });

                    toast.success("Attribute added successfully!", {
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    fetchBrandData();
                    setOpenAddModal(false);
                    setBrandImage(null);
                    reset();
                } catch (error) {
                    console.error('Error submitting form:', error);
                    toast.error("Failed to add Atrribute. Please try again.", {
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
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.error('Error preparing form data:', error);
            toast.error("Error preparing form data. Please try again.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };


    const handleEditRow = (brand) => {
        setSelectedBrand(brand);
        setValue('amenity_name', brand.amenity_name);
        setImagePreview(brand.amenity_logo || null);
        setOpenEditModal(true);
    };

    const handleFormUpdate = async (data) => {
        setLoading(true);

        const existingBrand = getPaginatedData().find(brand => brand.amenity_name.toLowerCase() === data.amenity_name.trim().toLowerCase());

        // if (existingBrand && existingBrand.id !== selectedBrand.id) {
        //     toast.error("This brand name is already taken. Please choose a different name.", {
        //         autoClose: 3000,
        //         hideProgressBar: true,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         className: 'bg-[#ff0000] text-white', // Error background color for the toast
        //     });
        //     setLoading(false);
        //     return; // Prevent the update if brand name already exists
        // }

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('amenity_name', data.amenity_name.trim() || selectedBrand.amenity_name);

        // Add the new image if it's present, otherwise remove it
        if (data.amenity_logo && data.amenity_logo instanceof File) {
            formData.append('amenity_logo', data.amenity_logo);
        } else if (!data.amenity_logo) {
            formData.delete('amenity_logo');
        }

        try {
            const accessToken = localStorage.getItem('tourism_token');
            const url = `https://yrpitsolutions.com/tourism_dup_api/api/admin/update_amenities_by_id/${selectedBrand.id}`;

            setTimeout(async () => {
                try {
                    await axios.post(url, formData, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    // Success toast for updating the brand
                    toast.success("Atributes updated successfully!", {
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        className: 'bg-[#4318ff] text-white', // Success background color for the toast
                    });

                    // Fetch brand data and close the modal
                    fetchBrandData();
                    setOpenEditModal(false);
                    setBrandImage(null);
                    reset();
                } catch (error) {
                    console.error('Error updating form:', error);

                    // Error toast if update fails
                    toast.error("Failed to update Attribute. Please try again.", {
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        className: 'bg-[#ff0000] text-white', // Error background color for the toast
                    });
                } finally {
                    setLoading(false);
                }
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.error('Error preparing form data:', error);

            // Error toast if preparing the form data fails
            toast.error("Error preparing form data. Please try again.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'bg-[#ff0000] text-white', // Error background color for the toast
            });
        }
    };


    const handleDeleteRow = (id) => {
        setRowIdToDelete(id);
        setOpenDeleteDialog(true);
    };


    const handleDeleteConfirmation = async () => {
        setIsDeleting(true);
        try {
            const accessToken = localStorage.getItem('tourism_token');
            await axios.delete(`https://yrpitsolutions.com/tourism_dup_api/api/admin/delete_amenities_by_id/${rowIdToDelete}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Success Toast
            toast.success("Banner deleted successfully!", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            fetchBrandData();
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting banner:', error);

            // Error Toast
            toast.error("Error deleting banner. Please try again.", {
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
            const accessToken = localStorage.getItem('tourism_token');
            for (let id of selectedRows) {
                await axios.delete(`https://yrpitsolutions.com/tourism_dup_api/api/admin/delete_amenities_by_id/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }

            // Success Toast for bulk delete
            toast.success("Banners deleted successfully!", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Refresh data and clear selection
            window.location.reload();
            await fetchBrandData(); // Refresh the data
            setSelectedRows([]); // Clear selection after bulk delete
        } catch (error) {
            console.error('Error deleting selected banners:', error);

            // Error Toast for bulk delete
            toast.error("Error deleting selected banners. Please try again.", {
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
                <Navbar brandText={"Hotel Attributes"}/>
            <TokenExpiration />
            <ToastContainer />
            <div className="w-full mx-auto">
                <span className="flex mt-4 items-center w-full gap-6">
                    {/* Search bar */}
                    <div className="relative flex  flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
                        <div className="flex h-full w-full items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white">
                            <p className="pl-3 pr-2 text-xl">
                                <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                            </p>
                            <input
                                type="text"
                                placeholder="Search by Name..."
                                onChange={(e) => setSearchQuery(e.target.value)} // Directly set the search query
                                value={searchQuery}
                                className="block  w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                            />
                        </div>
                    </div>


                    <button
                        onClick={handleAddBrand}
                        className="bg-[#4318ff] text-white px-6 py-2  rounded-full text-lg font-medium flex items-center ml-auto"
                    >
                        <FaPlus className="mr-2" /> Add Hotel Attributes
                    </button>
                </span>

                {openAddModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={closeCreateModal}
                    >
                        <div
                            className="bg-white rounded-lg shadow-2xl p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Hotel Attributes</h2>

                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                 Logo <span className="text-red-500 ">*</span>
                                </label>
                                <Controller
                                    name="amenity_name"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            placeholder="Enter Brand Name"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.amenity_name && <p className="text-red-500 text-sm">{errors.amenity_name.message}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Icon <span className="text-red-500 ">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSaveChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                />
                                {errors.amenity_logo && <p className="text-red-500 text-sm">{errors.amenity_logo.message}</p>}
                            </div>

                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={closeCreateModal}
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit(handleFormSubmit)}
                                    disabled={loading}
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
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={closeEditModal}
                    >
                        <div
                            className="bg-white rounded-lg shadow-2xl p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Hotel Attributes</h2>

                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                     Name <span className="text-red-500 ">*</span>
                                </label>
                                <Controller
                                    name="amenity_name"
                                    control={control}
                                    defaultValue={selectedBrand?.brand_name || ''}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            placeholder="Enter Name"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.amenity_name && <p className="text-red-500 text-sm">{errors.amenity_name.message}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Icon <span className="text-red-500 ">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                />
                                {errors.amenity_logo && <p className="text-red-500 text-sm">{errors.amenity_logo.message}</p>}
                            </div>

                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={closeEditModal}
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
                                            checked={selectedRows.length === getPaginatedData().length && getPaginatedData().length > 0}
                                            onChange={() => {
                                                if (selectedRows.length === getPaginatedData().length) {
                                                    setSelectedRows([]);
                                                } else {
                                                    setSelectedRows(getPaginatedData().map((row) => row.id));
                                                }
                                            }}
                                            disabled={getPaginatedData().length === 0}  // Disable checkbox when no data is available
                                        />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">Icon</th>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-right">Actions</th>
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
                                getPaginatedData().map((brand) => (
                                    <tr key={brand.id} className="border-t">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(brand.id)}
                                                onChange={() => handleRowSelection(brand.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <img
                                                src={brand.amenity_logo || '/default-image.png'}
                                                alt={brand.amenity_name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{brand.amenity_name}</td>
                                        <td className="text-right group relative">
                                            <div className="flex justify-end items-center space-x-2">
                                                {/* Ellipsis icon */}
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === brand.id ? null : brand.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {/* Edit and Delete icons visible on hover, aligned left */}
                                                <div className="absolute right-auto left-40 flex space-x-6 opacity-0 group-hover:opacity-100 group-hover:flex transition-all duration-200">
                                                    <button
                                                        onClick={() => {
                                                            handleEditRow(brand);
                                                        }}
                                                        className="text-navy-700 hover:bg-gray-200"
                                                    >
                                                        <FaEdit className="text-black" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteRow(brand.id);
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
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No data found
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
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this Attribute?</h2>
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

export default HotelAttributes;