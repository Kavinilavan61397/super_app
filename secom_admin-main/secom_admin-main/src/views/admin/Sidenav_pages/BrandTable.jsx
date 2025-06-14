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

function BrandTable() {
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

    const fetchBrandData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/admin/get_all_brand');
            const data = response.data;
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
    // const handleFormSubmit = async (data) => {
    //     if (!data.brandImage || !(data.brandImage instanceof File)) {
    //         setError("Brand Image is required ");
    //         return;
    //     }
    //     const formData = new FormData();
    //     formData.append('brand_name', data.brandName);
    //     formData.append('photo', data.brandImage);
    //     setLoading(true);
    //     try {
    //         const accessToken = localStorage.getItem('OnlineShop-accessToken');
    //         const url = 'https://yrpitsolutions.com/ecom_backend/api/admin/save_brand';

    //         setTimeout(async () => {
    //             try {
    //                 await axios.post(url, formData, {
    //                     headers: { Authorization: `Bearer ${accessToken}` }
    //                 });
    //                 fetchBrandData();
    //                 setOpenAddModal(false);
    //                 setBrandImage(null);
    //                 reset();
    //             } catch (error) {
    //                 console.error('Error submitting form:', error);
    //             } finally {
    //                 setLoading(false);
    //             }
    //         }, 2000);
    //     } catch (error) {
    //         setLoading(false);
    //         console.error('Error preparing form data:', error);
    //     }
    // };

    // const handleFormUpdate = async (data) => {
    //     setLoading(true);

    //     const formData = new FormData();
    //     formData.append('_method', 'PUT');
    //     formData.append('brand_name', data.brandName.trim() || selectedBrand.brand_name);

    //     if (data.brandImage && data.brandImage instanceof File) {
    //         formData.append('photo', data.brandImage);
    //     } else if (!data.brandImage) {
    //         formData.delete('photo');
    //     }

    //     try {
    //         const accessToken = localStorage.getItem('OnlineShop-accessToken');
    //         const url = `https://yrpitsolutions.com/ecom_backend/api/admin/update_brand_by_id/${selectedBrand.id}`;

    //         setTimeout(async () => {
    //             try {
    //                 await axios.post(url, formData, {
    //                     headers: { Authorization: `Bearer ${accessToken}` },
    //                 });
    //                 fetchBrandData();
    //                 setOpenEditModal(false);
    //                 setBrandImage(null);
    //                 reset();
    //             } catch (error) {
    //                 console.error('Error updating form:', error);
    //             } finally {
    //                 setLoading(false);
    //             }
    //         }, 2000);
    //     } catch (error) {
    //         setLoading(false);
    //         console.error('Error preparing form data:', error);
    //     }
    // };

    // const handleAddBrand = () => {
    //     setSelectedBrand(null);
    //     setValue('brandName', '');
    //     setImagePreview(null);
    //     setOpenAddModal(true);
    //     reset();
    // };

    // const handleEditRow = (brand) => {
    //     setSelectedBrand(brand);
    //     setValue('brandName', brand.brand_name);


    //     if (brand.photo) {
    //         setImagePreview(brand.photo);
    //     } else {
    //         setImagePreview(null);
    //     }

    //     setOpenEditModal(true);
    // };

    // const handleAddBrand = () => {

    //     setSelectedBrand(null);
    //     setImagePreview(null); 
    //     setValue('brandName', ''); 
    //     reset({
    //         brandName: '', 
    //         brandImage: null, 
    //     });
    //     setOpenAddModal(true); 
    // };
    // const handleAddBrand = () => {
    //     // Get brand name from the form value (or any other logic you use to get the input data)
    //     const brandName = getValues('brandName');  // Assuming you're using react-hook-form

    //     // Check if brand already exists in the current list of brands
    //     const existingBrand = getPaginatedData().find(brand => brand.brand_name.toLowerCase() === brandName.toLowerCase());

    //     if (existingBrand) {
    //         // If brand already exists, show toaster message
    //         toast.error("This brand is already added.", {
    //             position: toast.POSITION.TOP_RIGHT,
    //             autoClose: 5000,
    //             hideProgressBar: true,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //         return; // Prevent opening the modal if brand already exists
    //     }

    //     // If brand doesn't exist, proceed with resetting the form and opening the modal
    //     setSelectedBrand(null);
    //     setImagePreview(null);
    //     setValue('brandName', '');
    //     reset({
    //         brandName: '',
    //         brandImage: null,
    //     });
    //     setOpenAddModal(true);
    // };

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


    const handleFormSubmit = async (data) => {
        // Prevent form submission if brand name already exists in the table
        const brandName = data.brandName;
        const existingBrand = getPaginatedData().find(brand => brand.brand_name.toLowerCase() === brandName.toLowerCase());

        if (existingBrand) {
            toast.error("This brand already exists. Provide different name.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return; // Prevent form submission if the brand name already exists
        }

        if (!data.brandImage || !(data.brandImage instanceof File)) {
            setError("Brand Image is required ");
            return;
        }

        const formData = new FormData();
        formData.append('brand_name', data.brandName);
        formData.append('photo', data.brandImage);
        setLoading(true);

        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            const url = 'https://yrpitsolutions.com/ecom_backend/api/admin/save_brand';

            setTimeout(async () => {
                try {
                    await axios.post(url, formData, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });

                    // After successful form submission, show a success toast
                    toast.success("Brand added successfully!", {
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    // Fetch brand data, close the modal, and reset the form
                    fetchBrandData();
                    setOpenAddModal(false);
                    setBrandImage(null);
                    reset();
                } catch (error) {
                    console.error('Error submitting form:', error);
                    // Optionally, show a failure toast here if the request fails
                    toast.error("Failed to add brand. Please try again.", {
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

    // const handleEditRow = (brand) => {
    //     setSelectedBrand(brand);
    //     setValue('brandName', brand.brand_name); 
    //     setImagePreview(brand.photo || null); 
    //     setOpenEditModal(true);
    // };

    const handleEditRow = (brand) => {
        setSelectedBrand(brand);
        setValue('brandName', brand.brand_name);
        setImagePreview(brand.photo || null);
        setOpenEditModal(true);
    };

    const handleFormUpdate = async (data) => {
        setLoading(true);

        // Check if the brand name already exists in the current list of brands
        const existingBrand = getPaginatedData().find(brand => brand.brand_name.toLowerCase() === data.brandName.trim().toLowerCase());

        // If the new brand name already exists and it's not the same as the currently selected brand name
        if (existingBrand && existingBrand.id !== selectedBrand.id) {
            toast.error("This brand name is already taken. Please choose a different name.", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'bg-[#ff0000] text-white', // Error background color for the toast
            });
            setLoading(false);
            return; // Prevent the update if brand name already exists
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('brand_name', data.brandName.trim() || selectedBrand.brand_name);

        // Add the new image if it's present, otherwise remove it
        if (data.brandImage && data.brandImage instanceof File) {
            formData.append('photo', data.brandImage);
        } else if (!data.brandImage) {
            formData.delete('photo');
        }

        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');
            const url = `https://yrpitsolutions.com/ecom_backend/api/admin/update_brand_by_id/${selectedBrand.id}`;

            setTimeout(async () => {
                try {
                    await axios.post(url, formData, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    // Success toast for updating the brand
                    toast.success("Brand updated successfully!", {
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
                    toast.error("Failed to update brand. Please try again.", {
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

    // const handleDeleteConfirmation = async () => {
    //     setIsDeleting(true);
    //     try {
    //         const accessToken = localStorage.getItem('OnlineShop-accessToken');
    //         await axios.delete(`https://yrpitsolutions.com/ecom_backend/api/admin/delete_brand_by_id/${rowIdToDelete}`, {
    //             headers: { Authorization: `Bearer ${accessToken}` },
    //         });
    //         fetchBrandData();
    //         setOpenDeleteDialog(false);

    //         // Show success toast
    //         toast.success("Brand deleted successfully!", {
    //             autoClose: 3000,
    //             hideProgressBar: true,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //     } catch (error) {
    //         console.error('Error deleting brand:', error);
    //         // Show error toast if deletion fails
    //         toast.error("Failed to delete brand. Please try again.", {
    //             autoClose: 3000,
    //             hideProgressBar: true,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //     } finally {
    //         setIsDeleting(false);
    //     }
    // };

    const handleDeleteConfirmation = async () => {
        setIsDeleting(true);
        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');

            // Send rowIdToDelete as an array in the body of the DELETE request
            const response = await axios.delete('https://yrpitsolutions.com/ecom_backend/api/admin/delete_brands', {
                headers: { Authorization: `Bearer ${accessToken}` },
                data: { ids: [rowIdToDelete] }  // Sending the single rowId as part of an array
            });

            if (response.status === 200) {
                fetchBrandData();
                setOpenDeleteDialog(false);

                // Show success toast after brand deletion
                toast.success("Brand deleted successfully!", {
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                throw new Error('Failed to delete brand');
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
            // Show error toast if deletion fails
            toast.error("Failed to delete brand. Please try again.", {
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

    // const handleBulkDelete = async () => {
    //     setLoading(true);
    //     try {
    //         const accessToken = localStorage.getItem('OnlineShop-accessToken');
    //         for (let id of selectedRows) {
    //             await axios.delete(`https://yrpitsolutions.com/ecom_backend/api/admin/delete_brand_by_id/${id}`, {
    //                 headers: { Authorization: `Bearer ${accessToken}` },
    //             });
    //         }

    //         // Show success toast after bulk delete
    //         toast.success("Selected brands deleted successfully!", {
    //             autoClose: 3000,
    //             hideProgressBar: true,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });

    //         window.location.reload();
    //         setSelectedRows([]); // Clear selection after bulk delete
    //     } catch (error) {
    //         console.error('Error deleting selected brands:', error);
    //         // Show error toast if bulk deletion fails
    //         toast.error("Failed to delete selected brands. Please try again.", {
    //             autoClose: 3000,
    //             hideProgressBar: true,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('OnlineShop-accessToken');

            // Send selectedRows as an array in the body of the DELETE request
            const response = await axios.delete('https://yrpitsolutions.com/ecom_backend/api/admin/delete_brands', {
                headers: { Authorization: `Bearer ${accessToken}` },
                data: { ids: selectedRows }  // Assuming the API expects an 'ids' array in the body
            });

            // Check if the API returns a successful response
            if (response.status === 200) {
                // Show success toast after bulk delete
                toast.success("Selected brands deleted successfully!", {
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                window.location.reload();
                setSelectedRows([]); // Clear selection after bulk delete
            } else {
                throw new Error('Failed to delete brands');
            }
        } catch (error) {
            console.error('Error deleting selected brands:', error);
            // Show error toast if bulk deletion fails
            toast.error("Failed to delete selected brands. Please try again.", {
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
                <Navbar brandText={"Brand"}/>
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
                                placeholder="Search by Brand Name..."
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
                        <FaPlus className="mr-2" /> Add Brand
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
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Brand</h2>

                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Brand Name <span className="text-red-500 ">*</span>
                                </label>
                                <Controller
                                    name="brandName"
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
                                {errors.brandName && <p className="text-red-500 text-sm">{errors.brandName.message}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Brand Image (151x135) <span className="text-red-500 ">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSaveChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                />
                                {errors.brandImage && <p className="text-red-500 text-sm">{errors.brandImage.message}</p>}
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
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Brand</h2>

                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Brand Name <span className="text-red-500 ">*</span>
                                </label>
                                <Controller
                                    name="brandName"
                                    control={control}
                                    defaultValue={selectedBrand?.brand_name || ''}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            placeholder="Enter Brand Name"
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.brandName && <p className="text-red-500 text-sm">{errors.brandName.message}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Brand Image (151x135) <span className="text-red-500 ">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                />
                                {errors.brandImage && <p className="text-red-500 text-sm">{errors.brandImage.message}</p>}
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
                {/* <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
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
                                <th className="px-6 py-4 text-left">Image</th>
                                <th className="px-6 py-4 text-left">Brand Name</th>
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
                                                src={brand.photo || '/default-image.png'}
                                                alt={brand.brand_name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{brand.brand_name}</td>
                                        <td className="text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === brand.id ? null : brand.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {openDropdown === brand.id && (
                                                    <div
                                                        ref={dropdownRef}
                                                        className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-40 z-10"
                                                    >
                                                        <div
                                                            onClick={() => {
                                                                handleEditRow(brand);
                                                                setOpenDropdown(null);
                                                            }}
                                                            className="flex items-center px-4 py-2 text-navy-700 hover:bg-gray-200 cursor-pointer"
                                                        >
                                                            <FaEdit className="mr-2 text-black" />
                                                            Edit
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                handleDeleteRow(brand.id);
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
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No Brand data found
                                    </td>
                                </tr>
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
                                <th className="px-6 py-4 text-left">Image</th>
                                <th className="px-6 py-4 text-left">Brand Name</th>
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
                                                src={brand.photo || '/default-image.png'}
                                                alt={brand.brand_name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="px-6 py-4">{brand.brand_name}</td>
                                        <td className="text-right group relative">
                                            <div className="flex items-center space-x-2">
                                                {/* Ellipsis icon */}
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === brand.id ? null : brand.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {/* Edit and Delete icons visible on hover */}
                                                <div className="absolute right-40 flex space-x-2 opacity-0 group-hover:opacity-100 group-hover:flex transition-all duration-200">
                                                    <button
                                                        onClick={() => {
                                                            handleEditRow(brand);
                                                        }}
                                                        className="text-navy-700 hover:bg-gray-200"
                                                    >
                                                        <FaEdit className="mr-2 text-black" />
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
                                        No Brand data found
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
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this Brand?</h2>
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

export default BrandTable;