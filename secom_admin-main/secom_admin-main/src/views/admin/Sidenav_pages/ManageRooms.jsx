import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { TokenExpiration } from 'views/auth/TokenExpiration ';
import Navbar from 'components/navbar';

function ManageRooms() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("hotel_id");
    const [tableData, setTableData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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

    const validationSchemaAdd = Yup.object({
    });

    const validationSchemaEdit = Yup.object({
    });

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { reset, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(openAddModal ? validationSchemaAdd : validationSchemaEdit),
        defaultValues: {
            // hotel_id: selectedProduct?.hotel_id || '',
        },
    });

    const fetchVariationData = async () => {
        if (!productId) {
            console.warn("HotelId is undefined.");
            return;
        }
        try {
            const response = await axios.get(
                `https://yrpitsolutions.com/tourism_dup_api/api/hotels/${productId}/rooms`
            );
            console.log(response.data.data);
            setTableData(response.data.data);
            setTotalItems(response.data.length);
        } catch (error) {
            console.error("Error fetching variation data:", error);
        }
    };

    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            const response = await fetch('https://yrpitsolutions.com/tourism_dup_api/api/admin/get_amenities');
            const data = await response.json();

            if (data && data.data) {
                // Map the response to your attributes array
                const fetchedAttributes = data.data.map((amenity) => ({
                    id: amenity.id,
                    name: amenity.amenity_name,
                }));
                setAttributes(fetchedAttributes);
            }
        } catch (error) {
            console.error('Error fetching amenities data:', error);
        }
    };

    const handleAttributeChange = (event, attributeId) => {
        const { checked } = event.target;
        if (checked) {
            setSelectedAttributes((prev) => [...prev, attributeId]);
        } else {
            setSelectedAttributes((prev) => prev.filter((id) => id !== attributeId));
        }
    };

    useEffect(() => {
        if (productId) {
            fetchVariationData();
        }
    }, [productId, itemsPerPage]);

    const [images, setImages] = useState([]);

    const handleFileChange = (event) => {
        const files = event.target.files;
        const newImages = images.concat(Array.from(files));
        setImages(newImages);
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleFormSubmit = async (data) => {
        const formData = new FormData();

        // Append non-file fields
        formData.append('hotel_id', productId);
        formData.append('room_name', data.room_name);
        formData.append('room_size', data.room_size);
        formData.append('no_of_beds', data.no_of_beds);
        formData.append('room_price', data.room_price);
        formData.append('sale_price', data.sale_price);
        formData.append('extra_bed_price', data.extra_bed_price);
        formData.append('child_price', data.child_price);
        formData.append('max_adults', data.max_adults);
        formData.append('max_childs', data.max_childs);
        formData.append('max_infants', data.max_infants);
        formData.append('agent_price', 100);  // Static agent price
        formData.append('status', 1);  // Static status

        // Append the selected amenities as an array (not JSON string)
        if (selectedAttributes.length > 0) {
            selectedAttributes.forEach(attributeId => {
                formData.append('amenities[]', attributeId);  // Append each attribute ID as an individual field
            });
        }

        // Append each image file to the form data
        if (images.length > 0) {
            images.forEach((image) => {
                formData.append('featured_images[]', image); // Append each image file
            });
        }

        try {
            const accessToken = localStorage.getItem('tourism_token');
            const url = 'https://yrpitsolutions.com/tourism_dup_api/api/admin/hotel_rooms';

            // Send the formData (which includes files) with axios
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data', // Make sure to set the correct content type
                },
            });

            fetchVariationData();
            setOpenAddModal(false);
            reset();
            setImages([]);
            setSelectedAttributes([]);  // Clear selected attributes after submission

            // Show success toaster without progress bar
            toast.success('Room added successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add Room! Please try again.', {
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

    const handleAddBrand = () => {
        setSelectedProduct(null);
        setValue('hotel_id', '');
        setValue('room_name', '');
        setValue('room_size', '');
        setValue('no_of_beds', '');
        setValue('room_price', '');
        setValue('sale_price', '');
        setValue('extra_bed_price', '');
        setValue('child_price', '');
        setValue('max_adults', '');
        setValue('max_childs', '');
        setValue('max_infants', '');

        setImages([]);
        setSelectedAttributes([]);


        setOpenAddModal(true);
    };

    const [uploadedImages, setUploadedImages] = useState([]);

    const handleImageSelection = (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles);
            setUploadedImages(filesArray); // Update state with selected files
        }
    };

    const removeSelectedImage = (index) => {
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages); // Remove image from state
    };


    useEffect(() => {
        if (selectedProduct) {
            // Pre-fill the form with existing room data
            setValue('hotel_id', selectedProduct.hotel_id);
            setValue('room_name', selectedProduct.room_name);
            setValue('room_size', selectedProduct.room_size);
            setValue('no_of_beds', selectedProduct.no_of_beds);
            setValue('room_price', selectedProduct.room_price);
            setValue('sale_price', selectedProduct.sale_price);
            setValue('extra_bed_price', selectedProduct.extra_bed_price);
            setValue('child_price', selectedProduct.child_price);
            setValue('max_adults', selectedProduct.max_adults);
            setValue('max_childs', selectedProduct.max_childs);
            setValue('max_infants', selectedProduct.max_infants);

            // Pre-fill amenities and images
            setSelectedAttributes(selectedProduct.amenities.map(amenity => amenity.id));
            setImages(selectedProduct.featured_images || []);
            setUploadedImages(selectedProduct.featured_images || []);
        }
    }, [selectedProduct, setValue]);

    const handleFormUpdate = async (data) => {
        setLoading(true);
    
        // Initialize FormData
        const formData = new FormData();
        formData.append('_method', 'PUT');
    
        // Hotel Room Data - use existing data if no new data is provided
        formData.append('hotel_id', data.hotel_id || selectedProduct.hotel_id);
        formData.append('room_name', data.room_name || selectedProduct.room_name);
        formData.append('room_size', data.room_size || selectedProduct.room_size);
        formData.append('no_of_beds', data.no_of_beds || selectedProduct.no_of_beds);
        formData.append('room_price', data.room_price || selectedProduct.room_price);
        formData.append('sale_price', data.sale_price || selectedProduct.sale_price);
        formData.append('extra_bed_price', data.extra_bed_price || selectedProduct.extra_bed_price);
        formData.append('child_price', data.child_price || selectedProduct.child_price);
        formData.append('max_adults', data.max_adults || selectedProduct.max_adults);
        formData.append('max_childs', data.max_childs || selectedProduct.max_childs);
        formData.append('max_infants', data.max_infants || selectedProduct.max_infants);
    
        // Use existing 'agent_price' if not provided in the form
        formData.append('agent_price', data.agent_price || selectedProduct.agent_price);
    
        // Append each amenity as a separate field in the formData
        selectedAttributes.length
            ? selectedAttributes.forEach(attributeId => formData.append('amenities[]', attributeId))
            : selectedProduct.amenities.forEach(amenity => formData.append('amenities[]', amenity.id));
    
        // Use existing 'status' if not provided in the form
        formData.append('status', data.status || selectedProduct.status);
    
        // Add featured images to formData (upload new ones if available)
        images.forEach((file) => {
            formData.append('featured_images[]', file);
        });
    
        try {
            const accessToken = localStorage.getItem('tourism_token');
            const url = `https://yrpitsolutions.com/tourism_dup_api/api/admin/hotel_rooms/${selectedProduct.id}`;
    
            setTimeout(async () => {
                try {
                    // Make the API request to update the room data
                    await axios.post(url, formData, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
    
                    // Show success toaster after updating
                    toast.success('Room updated successfully!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
    
                    fetchVariationData();  // Presumably refresh the data
                    setOpenEditModal(false);
                    reset();
                } catch (error) {
                    console.error('Error updating form:', error);
                    toast.error('Failed to update Room. Please try again.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }, 2000);
        } catch (error) {
            setLoading(false);
            console.error('Error preparing form data:', error);
            toast.error('Error preparing form data. Please check your input.', {
                position: "top-right",
                autoClose: 5000,
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

    const handleEditRow = (variation) => {
        setSelectedProduct(variation);

        // Set the selected attributes for the room

        setValue('hotel_id', variation.hotel_id);
        setValue('room_name', variation.room_name);
        setValue('room_size', variation.room_size);
        setValue('no_of_beds', variation.no_of_beds);
        setValue('room_price', variation.room_price);
        setValue('sale_price', variation.sale_price);
        setValue('extra_bed_price', variation.extra_bed_price);
        setValue('child_price', variation.child_price);
        setValue('max_adults', variation.max_adults);
        setValue('max_childs', variation.max_childs);
        setValue('max_infants', variation.max_infants);

        setImages(variation.featured_images || []);  // Correctly set featured images from variation data
        setUploadedImages(variation.featured_images || []);  // If you're using uploadedImages for rendering
        setSelectedAttributes(variation.amenities || []);
        setOpenEditModal(true);
    };

    const handleDeleteRow = (id) => {
        setRowIdToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirmation = async () => {
        setIsDeleting(true); // Start loading state

        try {
            const accessToken = localStorage.getItem('tourism_token');

            // Sending DELETE request to delete product variation
            await axios.delete(`https://yrpitsolutions.com/tourism_dup_api/api/admin/hotel_rooms/${rowIdToDelete}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            fetchVariationData(); // Refresh the data after deletion
            setOpenDeleteDialog(false); // Close the delete dialog

            // Show success toast after successful deletion
            toast.success('Room deleted successfully!', {
                position: 'top-right',
                autoClose: 3000,  // Toast will auto-close in 3 seconds
                hideProgressBar: true,  // Hide progress bar for cleaner UI
                closeOnClick: true,  // Allow the user to click to close the toast
                pauseOnHover: true,  // Pause the toast when hovered over
                draggable: true,  // Allow the user to drag the toast around
                progress: undefined,  // Disable the progress bar
            });

        } catch (error) {
            console.error('Error deleting Roomn:', error);

            // Show error toast if deletion fails
            toast.error('Failed to delete Roomn. Please try again.', {
                position: 'top-right',
                autoClose: 3000,  // Toast will auto-close in 3 seconds
                hideProgressBar: true,  // Hide progress bar for error case
                closeOnClick: true,  // Allow user to click to close the error message
                pauseOnHover: true,  // Pause on hover for better interaction
                draggable: true,  // Allow dragging for error toast
                progress: undefined,  // Disable progress bar
            });
        } finally {
            setIsDeleting(false); // Stop loading state once the operation is complete
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const handleBulkDelete = async () => {
        setLoading(true); // Start loading state

        try {
            const accessToken = localStorage.getItem('tourism_token');

            // Iterate through the selected rows and delete each one
            for (let id of selectedRows) {
                await axios.delete(`https://yrpitsolutions.com/tourism_dup_api/api/admin/hotel_rooms/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }

            window.location.reload(); 

            // Refresh the data after deletion
            fetchVariationData();
            setSelectedRows([]); // Clear the selection

            // Show success toast after successful bulk deletion
            toast.success('Selected products have been successfully deleted!', {
                position: 'top-right',
                autoClose: 3000, // Toast auto-close in 3 seconds
                hideProgressBar: true, // Hide the progress bar for cleaner UI
                closeOnClick: true, // Allow users to close the toast by clicking
                pauseOnHover: true, // Pause the toast when hovered over
                draggable: true, // Allow dragging the toast
                progress: undefined, // Disable progress bar
            });

        } catch (error) {
            console.error('Error deleting selected products:', error);

            // Show error toast if bulk deletion fails
            toast.error('There was an error deleting the selected products. Please try again.', {
                position: 'top-right',
                autoClose: 3000, // Toast auto-close in 3 seconds
                hideProgressBar: true, // Hide the progress bar for error case
                closeOnClick: true, // Allow users to close the error toast by clicking
                pauseOnHover: true, // Pause the toast when hovered over
                draggable: true, // Allow dragging the error toast
                progress: undefined, // Disable progress bar
            });
        } finally {
            setLoading(false); // Stop loading state once the operation is complete
        }
    };

    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((variation) =>
                variation.room_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
            setTotalItems(filtered.length);
            setCurrentPage(1);
        } else {
            setFilteredData(tableData);
            setTotalItems(tableData.length);
        }
    }, [searchQuery, tableData]);

    const getPaginatedData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

    return (
        <div className=" min-h-screen pt-6">
            <Navbar brandText={"Manage Rooms"} />
            <TokenExpiration />
            <ToastContainer />
            <div className="w-full mx-auto">
                <span className="flex mt-4 items-center w-full gap-2">
                    {/* Search bar */}
                    <div className="relative flex flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
                        <div className="flex h-full w-full items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white">
                            <p className="pl-3 pr-2 text-xl">
                                <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                            </p>
                            <input
                                type="text"
                                placeholder="Search by Room Name..."
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}
                                className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                            />
                        </div>
                    </div>


                    <button
                        onClick={handleAddBrand}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
                    >
                        <FaPlus className="mr-2" /> Add Room
                    </button>
                    <button
                        onClick={() => navigate(`/admin/available-rooms?hotel_id=${productId}`)}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto">
                        Available Rooms
                    </button>
                </span>

                {openAddModal && !openEditModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={() => setOpenAddModal(false)}>
                        <div
                            className="bg-white rounded-lg shadow-2xl p-8 w-[70%] max-h-[90%] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Room</h2>
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-6 mt-5">
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Room Name</label>
                                    <Controller
                                        name="room_name"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Room Name"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.room_name && <p className="text-red-500 text-sm">{errors.room_name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Room Size
                                    </label>
                                    <Controller
                                        name="room_size"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Room Size"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.room_size && (
                                        <p className="text-red-500 text-sm mt-1">{errors.room_size.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        No of Beds
                                    </label>
                                    <Controller
                                        name="no_of_beds"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter No of Beds"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.no_of_beds && (
                                        <p className="text-red-500 text-sm mt-1">{errors.no_of_beds.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Room Price</label>
                                    <Controller
                                        name="room_price"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Room Price"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.room_price && <p className="text-red-500 text-sm">{errors.room_price.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Sale Price
                                    </label>
                                    <Controller
                                        name="sale_price"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Sale Price"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.sale_price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.sale_price.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-6 mt-5">
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Extra Bed Price</label>
                                    <Controller
                                        name="extra_bed_price"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Extra Bed Price"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.extra_bed_price && <p className="text-red-500 text-sm">{errors.extra_bed_price.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Child Price
                                    </label>
                                    <Controller
                                        name="child_price"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Child Price"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.child_price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.child_price.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Max Adult
                                    </label>
                                    <Controller
                                        name="max_adults"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter Max Adult"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.max_adults && (
                                        <p className="text-red-500 text-sm mt-1">{errors.max_adults.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Max Childs
                                    </label>
                                    <Controller
                                        name="max_childs"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter Max Childs"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.max_childs && (
                                        <p className="text-red-500 text-sm mt-1">{errors.max_childs.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Max Infants
                                    </label>
                                    <Controller
                                        name="max_infants"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter Max Infants"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.max_infants && (
                                        <p className="text-red-500 text-sm mt-1">{errors.max_infants.message}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-lg text-gray-600 font-medium mb-2">Attributes</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {attributes.map((attribute) => (
                                        <div key={attribute.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`attribute-${attribute.id}`} // Unique ID for each checkbox
                                                value={attribute.name}
                                                className="mr-2"
                                                onChange={(e) => handleAttributeChange(e, attribute.id)}
                                                checked={selectedAttributes.includes(attribute.id)} // Reflect current selected state
                                            />
                                            {/* <img src={attribute.logo} alt={attribute.name} className="w-6 h-6 mr-2" /> */}
                                            <label htmlFor={`attribute-${attribute.id}`}>{attribute.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Upload Multiple Images
                                </label>
                                <input
                                    name="featured_images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                />
                                <div style={{ marginTop: '10px' }}>
                                    {images.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between my-2">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-10 h-10 object-cover rounded-md"
                                            />
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="ml-2 text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {images.length} images uploaded
                                </p>
                            </div>
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={() => setOpenAddModal(false)}
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit(handleFormSubmit)}
                                    disabled={loading}
                                    className="relative bg-[#4318ff] text-white px-6 py-3 rounded-lg flex items-center ml-auto max-w-xs" >
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
                        onClick={() => setOpenEditModal(false)}>
                        <div
                            className="bg-white rounded-lg shadow-2xl p-8 w-[70%] max-h-[90%] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}>

                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Variation</h2>
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-6 mt-5">
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Room Name</label>
                                    <Controller
                                        name="room_name"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Room Name"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.room_name && <p className="text-red-500 text-sm">{errors.room_name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Room Size
                                    </label>
                                    <Controller
                                        name="room_size"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Room Size"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.room_size && (
                                        <p className="text-red-500 text-sm mt-1">{errors.room_size.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        No of Beds
                                    </label>
                                    <Controller
                                        name="no_of_beds"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter No of Beds"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.no_of_beds && (
                                        <p className="text-red-500 text-sm mt-1">{errors.no_of_beds.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Room Price</label>
                                    <Controller
                                        name="room_price"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Room Price"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.room_price && <p className="text-red-500 text-sm">{errors.room_price.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Sale Price
                                    </label>
                                    <Controller
                                        name="sale_price"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Sale Price"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.sale_price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.sale_price.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-6 mt-5">
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Extra Bed Price</label>
                                    <Controller
                                        name="extra_bed_price"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Extra Bed Price"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.extra_bed_price && <p className="text-red-500 text-sm">{errors.extra_bed_price.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Child Price
                                    </label>
                                    <Controller
                                        name="child_price"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Child Price"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.child_price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.child_price.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Max Adult
                                    </label>
                                    <Controller
                                        name="max_adults"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter Max Adult"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.max_adults && (
                                        <p className="text-red-500 text-sm mt-1">{errors.max_adults.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Max Childs
                                    </label>
                                    <Controller
                                        name="max_childs"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter Max Childs"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.max_childs && (
                                        <p className="text-red-500 text-sm mt-1">{errors.max_childs.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Max Infants
                                    </label>
                                    <Controller
                                        name="max_infants"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter Max Infants"
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.max_infants && (
                                        <p className="text-red-500 text-sm mt-1">{errors.max_infants.message}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-lg text-gray-600 font-medium mb-2">Attributes</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {attributes.map((attribute) => (
                                        <div key={attribute.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`attribute-${attribute.id}`} // Unique ID for each checkbox
                                                value={attribute.name}
                                                className="mr-2"
                                                onChange={(e) => handleAttributeChange(e, attribute.id)}
                                                checked={selectedAttributes.includes(attribute.id)} // Reflect current selected state
                                            />
                                            <label htmlFor={`attribute-${attribute.id}`}>{attribute.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-lg text-gray-600 font-medium mb-2">
                                    Upload Multiple Images
                                </label>
                                <input
                                    name="featured_images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelection}
                                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                />
                                <div style={{ marginTop: '10px' }}>
                                    {/* Prefill the images if any are set in selectedProduct */}
                                    {uploadedImages.length > 0 && uploadedImages.map((file, index) => {
                                        if (file instanceof File) {
                                            return (
                                                <div key={index} className="flex items-center justify-between my-2">
                                                    <img
                                                        src={URL.createObjectURL(file)}  // Displaying the image
                                                        alt={file.name}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => removeSelectedImage(index)}  // Removing the image
                                                            className="ml-2 text-sm text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            // Display the prefilled image URL (for featured_images from selectedProduct)
                                            return (
                                                <div key={index} className="flex items-center justify-between my-2">
                                                    <img
                                                        src={file}  // Displaying prefilled image (URL)
                                                        alt={`Featured Image ${index}`}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => removeSelectedImage(index)}  // Removing the image
                                                            className="ml-2 text-sm text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <p className="text-sm text-gray-600">{uploadedImages.length} image(s) uploaded</p>
                            </div>
                            <div className="flex justify-end space-x-4 mt-4">

                                <button
                                    onClick={() => setOpenEditModal(false)}
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md">
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
                                        {/* <input
                                            type="checkbox"
                                            onChange={() => {
                                                if (selectedRows.length === getPaginatedData().length) {
                                                    setSelectedRows([]); // Deselect all rows
                                                } else {
                                                    setSelectedRows(getPaginatedData().map((row) => row.id)); // Select all rows
                                                }
                                            }}
                                        /> */}
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
                                <th className="px-6 py-4 text-left">Room Name</th>
                                <th className="px-6 py-4 text-left">Room Price</th>
                                <th className="px-6 py-4 text-left">Sale Price</th>
                                <th className="px-6 py-4 text-left">No of Beds</th>
                                <th className="px-6 py-4 text-left">Room Size</th>
                                <th className="px-6 py-4 text-right">Actions</th>
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
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        No Rooms found
                                    </td>
                                </tr>
                            ) : (
                                getPaginatedData().map((variation) => (
                                    <tr key={variation.id} className="border-t group relative">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(variation.id)}
                                                onChange={() => handleRowSelection(variation.id)} // Handle selection
                                            />
                                        </td>
                                        <td className="px-6 py-4">{variation.room_name}</td>
                                        <td className="px-6 py-4">{variation.room_price}</td>
                                        <td className="px-6 py-4">{variation.sale_price}</td>
                                        <td className="px-6 py-4">{variation.no_of_beds}</td>
                                        <td className="px-6 py-4">{variation.room_size}</td>

                                        <td className="px-6 py-4 text-right pl-10">
                                            <button
                                                onClick={() => setOpenDropdown(openDropdown === variation.id ? null : variation.id)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditRow(variation)}
                                                    className=" mr-4"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRow(variation.id)}
                                                    className="text-red-600 hover:text-red-900 pr-10"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="text-gray-600 hover:text-gray-900"
                                                    onClick={() => { }}
                                                >

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
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this Room?</h2>
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

export default ManageRooms;