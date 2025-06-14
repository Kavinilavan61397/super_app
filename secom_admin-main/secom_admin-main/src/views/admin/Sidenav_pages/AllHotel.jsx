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
import { FaChevronDown } from 'react-icons/fa';

function AllHotel() {
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
    const [brands, setBrands] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");

    const productSchemaAdd = Yup.object().shape({
    });

    const productSchemaEdit = Yup.object().shape({
    });

    const isEditMode = selectedProduct !== undefined && selectedProduct !== null;

    const { control, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm({
        resolver: yupResolver(isEditMode ? productSchemaEdit : productSchemaAdd),
        defaultValues: {
            location_name: '',
            property_id: '',
            hotel_name: '',
            starting_price: '',
            highest_price: '',
            full_address: '',
            ratings: '',
            max_adult: '',
            max_children: '',
            max_infant: '',
            seo_title: '',
            seo_description: '',
            meta_title: '',
            description: '',
            banner_images: [], // Reset the banner images
            policy_title: [], // Reset policy titles
            policy_description: [], // Reset policy descriptions
            faq_title: [], // Reset FAQ titles
            faq_description: [], // Reset FAQ description
        },
    });


    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);

    const fetchAttributes = async () => {
        try {
            const response = await fetch("https://yrpitsolutions.com/tourism_dup_api/api/admin/get_amenities");
            const data = await response.json();

            if (data && data.data) {
                setAttributes(data.data); // Set the fetched amenities data to state
                console.log("Fetched attributes:", data.data);
            } else {
                console.error("Failed to fetch attributes");
            }
        } catch (error) {
            console.error("Error fetching attributes:", error);
        }
    };

    useEffect(() => {
        fetchAttributes(); // Fetch amenities data when component mounts
    }, []);

    const handleAttributeChange = (event, attributeId) => {
        const { checked } = event.target;
        if (checked) {
            setSelectedAttributes((prev) => [...prev, attributeId]);
        } else {
            setSelectedAttributes((prev) => prev.filter((id) => id !== attributeId));
        }
    };


    // const [categories, setCategories] = useState([]);  // Store hotel policy data
    const [selectedHotelPolicies, setSelectedHotelPolicies] = useState([]); // Store selected policies
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [policy, setPolicy] = useState([]); // Store fetched policy data

    // Fetch hotel policies from the API
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await axios.get('https://yrpitsolutions.com/tourism_dup_api/api/admin/get_policy');
                console.log('Hotel Policy fetched:', response.data);
                setPolicy(response.data);
            } catch (error) {
                console.error('Error fetching Hotel Policy data:', error);
            }
        };

        fetchCategoryData();
    }, []);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownVisible((prevState) => !prevState);
    };

    // Handle selection of hotel policy
    const handleSelectChange = (selectedPolicy) => {
        setSelectedHotelPolicies((prevSelected) => {
            if (!prevSelected.some((policy) => policy.id === selectedPolicy.id)) {
                return [...prevSelected, selectedPolicy]; // Add policy if not already selected
            }
            return prevSelected; // Don't add if already selected
        });
        setIsDropdownVisible(false); // Close the dropdown after selecting
    };

    // Remove selected hotel policy
    const handleRemoveSelectedHotelPolicy = (policyId) => {
        setSelectedHotelPolicies((prevSelected) =>
            prevSelected.filter((policy) => policy.id !== policyId) // Filter out the removed policy
        );
    };

    // Truncate the policy description to a limited length
    const truncateDescription = (description, maxLength = 50) => {
        return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
    };

    const [tags, setTags] = useState([]); // Store FAQ data
    const [selectedFAQs, setSelectedFAQs] = useState([]); // For storing selected FAQs
    const [isFaqDropdownVisible, setIsFaqDropdownVisible] = useState(false);
    // const [loading, setLoading] = useState(true); // Handle loading state

    useEffect(() => {
        const fetchTags = async () => {
            console.log("Fetching hotel FAQ data...");
            try {
                const response = await axios.get('https://yrpitsolutions.com/tourism_dup_api/api/admin/get_faq');
                console.log('Hotel FAQs fetched:', response.data);
                setTags(response.data);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching Hotel FAQ data:', error);
                setTags([]); // Set tags to empty if error occurs
                setLoading(false); // Set loading to false on error
            }
        };

        fetchTags();
    }, []); // Empty dependency array to ensure it runs only once

    // Toggle visibility of the dropdown menu
    const toggleDropdownFaq = () => {
        setIsFaqDropdownVisible(prevState => !prevState);
    };

    // Handle FAQ selection
    const handleSelectChangeFaq = (faq) => {
        setSelectedFAQs(prevSelected => {
            if (!prevSelected.some((selected) => selected.id === faq.id)) {
                return [...prevSelected, faq];
            }
            return prevSelected; // Do nothing if FAQ is already selected
        });
        setIsFaqDropdownVisible(false); // Close the dropdown after selecting
    };

    // Remove selected FAQ
    const handleRemoveSelectedFAQ = (faqId) => {
        setSelectedFAQs(prevSelected => prevSelected.filter((faq) => faq.id !== faqId));
    };

    // Truncate the FAQ description to a limited length
    const truncateFaqDescription = (description, maxLength = 50) => {
        return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
    };

    useEffect(() => {
        const fetchSubCategoryData = async () => {
            try {
                const response = await axios.get('https://yrpitsolutions.com/tourism_dup_api/api/admin/get_location');
                console.log('Location fetched:', response.data);
                setSubCategories(response?.data);
            } catch (error) {
                console.error('Error fetching Location data:', error);
                setSubCategories([]);
            }
        };

        fetchSubCategoryData();
    }, []);

    const filteredProducts = tableData.filter((product) => product.hotel_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/tourism_dup_api/api/admin/hotels');
            // console.log("aaaaaaaaaaaaaaaaaaa", response.data.data);
            setTableData(response.data.data);
            setTotalItems(response.data.length);
        } catch (error) {
            console.error('Error fetching All Hotels:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [itemsPerPage]);


    const [images, setImages] = useState([]); // State for the uploaded images

    // Handle file upload
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]); // Add new files to the existing images
    };

    // Remove image
    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index); // Filter out the image at the given index
        setImages(newImages); // Update the state with the filtered images
        URL.revokeObjectURL(images[index]); // Revoke object URL for the removed image
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        try {
            // Prevent default form submission
            // e.preventDefault();
            setLoading(true); // Set loading state

            // Get form values
            const formValues = getValues();

            // Prepare FormData for file uploads
            const formData = new FormData();

            // Append simple fields
            formData.append("location_name", formValues.location_name);
            formData.append("property_id", formValues.property_id);
            formData.append("hotel_name", formValues.hotel_name);
            formData.append("starting_price", formValues.starting_price);
            formData.append("highest_price", formValues.highest_price);
            formData.append("full_address", formValues.full_address);
            formData.append("ratings", formValues.ratings);
            formData.append("max_adult", formValues.max_adult);
            formData.append("max_children", formValues.max_children);
            formData.append("max_infant", formValues.max_infant);
            formData.append("seo_title", formValues.seo_title);
            formData.append("seo_description", formValues.seo_description);
            formData.append("meta_title", formValues.meta_title);
            formData.append("description", formValues.description);
            formData.append("hotel_or_home_stay", "home");

            // Append hotel policies
            selectedHotelPolicies.forEach((policy, index) => {
                formData.append(`policy_title${index + 1}`, policy.policy_title);
                formData.append(`policy_description${index + 1}`, policy.policy_description);
            });

            // Append FAQs
            selectedFAQs.forEach((faq, index) => {
                formData.append(`faq_title${index + 1}`, faq.faq_title);
                formData.append(`faq_description${index + 1}`, faq.faq_description);
            });

            // Append amenities
            selectedAttributes.forEach((attributeId, index) => {
                const attribute = attributes.find(attr => attr.id === attributeId);
                if (attribute) {
                    // Appending with numbered keys (e.g., amenity_logo1, amenity_name1)
                    formData.append(`amenity_logo${index + 1}`, attribute.amenity_logo || ''); // Default to empty string if logo is missing
                    formData.append(`amenity_name${index + 1}`, attribute.amenity_name || ''); // Default to empty string if name is missing
                } else {
                    console.error(`Attribute with ID ${attributeId} not found in attributes.`);
                }
            });

            // Log FormData entries to inspect
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Append images
            images.forEach((file) => formData.append("banner_images[]", file));

            // Send the payload to the API
            const accessToken = localStorage.getItem("tourism_token");

            if (!accessToken) {
                console.error("Access token is missing. Please login.");
                toast.error("Access token is missing. Please login.");
                return;
            }

            const response = await axios.post(
                "https://yrpitsolutions.com/tourism_dup_api/api/admin/hotels",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log("Hotel created successfully:", response.data);

            // Success toast
            toast.success("Hotel added successfully!", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Reset form and close modal
            reset();
            setOpenAddModal(false);
            fetchProducts();

        } catch (error) {
            console.error("Error submitting form:", error);

            // Error toast
            toast.error("Error while adding Hotel!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false); // Set loading state to false in the finally block
        }
    };

    const handleAddHotel = () => {
        // Reset all form values including empty arrays for dynamic fields
        reset({
            location_name: '',
            property_id: '',
            hotel_name: '',
            starting_price: '',
            highest_price: '',
            full_address: '',
            ratings: '',
            max_adult: '',
            max_children: '',
            max_infant: '',
            seo_title: '',
            seo_description: '',
            meta_title: '',
            description: '',
            banner_images: [], // Reset the banner images
            policy_title: [], // Reset policy titles
            policy_description: [], // Reset policy descriptions
            faq_title: [], // Reset FAQ titles
            faq_description: [], // Reset FAQ descriptions
            amenity_logo: '', // Reset amenity logo
            amenity_name: '', // Reset amenity name
        });

        // Explicitly reset dynamic fields (arrays) that may not be handled well by `reset()`
        setValue('banner_images', []);
        setValue('policy_title', []);
        setValue('policy_description', []);
        setValue('faq_title', []);
        setValue('faq_description', []);

        setOpenAddModal(true);
        setSelectedProduct(null);
        setTotalItems([]);
    };

    const handleFormUpdate = async (data) => {
        try {
            setLoading(true); // Set loading state

            // Validate required fields
            if (!data.location_name || !data.hotel_name || !data.property_id) {
                toast.error("Location name, hotel name, and property ID are required!");
                return;
            }

            // Prepare FormData for file uploads
            const formData = new FormData();

            // Append simple fields
            formData.append("location_name", data.location_name);
            formData.append("property_id", data.property_id);
            formData.append("hotel_name", data.hotel_name);
            formData.append("starting_price", data.starting_price || '');
            formData.append("highest_price", data.highest_price || '');
            formData.append("full_address", data.full_address || '');
            formData.append("ratings", data.ratings || '');
            formData.append("max_adult", data.max_adult || 0);
            formData.append("max_children", data.max_children || 0);
            formData.append("max_infant", data.max_infant || 0);
            formData.append("seo_title", data.seo_title || '');
            formData.append("seo_description", data.seo_description || '');
            formData.append("meta_title", data.meta_title || '');
            formData.append("description", data.description || '');

            // Append hotel policies (validate as arrays)
            if (Array.isArray(selectedHotelPolicies) && selectedHotelPolicies.length) {
                selectedHotelPolicies.forEach((policy, index) => {
                    formData.append(`policy_title${index + 1}`, policy.policy_title || "");
                    formData.append(`policy_description${index + 1}`, policy.policy_description || "");
                });
            }

            // Append FAQs (validate as arrays)
            if (Array.isArray(selectedFAQs) && selectedFAQs.length) {
                selectedFAQs.forEach((faq, index) => {
                    formData.append(`faq_title${index + 1}`, faq.faq_title || "");
                    formData.append(`faq_description${index + 1}`, faq.faq_description || "");
                });
            }

            // Append amenities (validate selectedAttributes and attributes)
            if (Array.isArray(selectedAttributes) && selectedAttributes.length) {
                selectedAttributes.forEach((attributeId, index) => {
                    const attribute = attributes.find((attr) => attr.id === attributeId);
                    if (attribute) {
                        formData.append(`amenity_logo${index + 1}`, attribute.amenity_logo || "");
                        formData.append(`amenity_name${index + 1}`, attribute.amenity_name || "");
                    }
                });
            }

            // Append images (check if images are provided)
            if (images && images.length) {
                images.forEach((file) => formData.append("banner_images[]", file));
            }

            // Get the access token from localStorage
            const accessToken = localStorage.getItem("tourism_token");

            if (!accessToken) {
                console.error("Access token is missing. Please login.");
                toast.error("Access token is missing. Please login.");
                return;
            }

            // Send the PUT request to update the hotel
            const response = await axios.put(
                `https://yrpitsolutions.com/tourism_dup_api/api/admin/hotels/${selectedProduct.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Hotel updated successfully:", response.data);

            // Show success toast
            toast.success("Hotel updated successfully!", {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Close the modal and refresh the data
            setOpenEditModal(false);
            fetchProducts(); // Refresh the hotel list
        } catch (error) {
            console.error("Error updating hotel:", error);

            // Show error toast with more detailed error message if available
            const errorMessage = error.response?.data?.message || "Error updating hotel!";
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleEditRow = (product) => {
        // Set the selected product
        setSelectedProduct(product);
        console.log(selectedProduct)
        

        // Prefill the form with the selected product's data
        reset({
            location_name: product.location_name || "",
            property_id: product.property_id || "",
            hotel_name: product.hotel_name || "",
            starting_price: product.starting_price || "",
            highest_price: product.highest_price || "",
            full_address: product.full_address || "",
            ratings: product.ratings || "",
            max_adult: product.max_adult || 0,
            max_children: product.max_children || 0,
            max_infant: product.max_infant || 0,
            seo_title: product.seo_title || "",
            seo_description: product.seo_description || "",
            meta_title: product.meta_title || "",
            description: product.description || "",
            banner_images: product.banner_images || [], // Prefill banner images if available
            policy_title: product.policy_title || [], // Prefill policy titles if available
            policy_description: product.policy_description || [], // Prefill policy descriptions if available
            faq_title: product.faq_title || [], // Prefill FAQ titles if available
            faq_description: product.faq_description || [], // Prefill FAQ descriptions if available
        });

        // Prefill selected attributes, policies, and FAQs
        setSelectedAttributes(product.attributes || []);
        setSelectedHotelPolicies(product.policies || []);
        setSelectedFAQs(product.faqs || []);
        setImages(product.banner_images || []); // Prefill images if available

        // Open the edit modal
        setOpenEditModal(true);
    };

    const handleRowSelection = (id) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > Math.ceil(filteredProducts.length / itemsPerPage)) return;
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((product) =>
                product.hotel_name.toLowerCase().includes(searchQuery.toLowerCase())
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

    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            setSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(debounceSearch);
    }, [searchQuery]);

    const handleDeleteRow = (id) => {
        setRowIdToDelete(id);
        // console.log(rowIdToDelete)
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirmation = async () => {
        setIsDeleting(true);
        try {
            const accessToken = localStorage.getItem('tourism_token');
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

            await axios.delete(`https://yrpitsolutions.com/tourism_dup_api/api/admin/hotels/${rowIdToDelete}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

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
            const accessToken = localStorage.getItem('tourism_token');
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
                await axios.delete(`https://yrpitsolutions.com/tourism_dup_api/api/admin/hotels/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
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


    // const handleFileChange = (event) => {
    //     const files = event.target.files;
    //     const newImages = images.concat(Array.from(files));
    //     setImages(newImages);
    // };




    return (
        <div className="min-h-screen pt-6">

            {/* <TokenExpiration /> */}
            <Navbar brandText={"All Hotels"} />
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
                                placeholder="Search by Hotel Name..."
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}
                                className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                            />
                        </div>
                    </div>


                    <button
                        onClick={handleAddHotel}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
                    >
                        <FaPlus className="mr-2" /> Add New Hotel
                    </button>
                </span>

                {openAddModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
                        onClick={() => setOpenAddModal(false)}
                    >
                        <div
                            className="bg-white rounded-lg shadow-2xl p-12 w-[70%] max-h-[90%] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Hotel</h2>
                            <form>
                                <div className="mb-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                        <Controller
                                            name="location_name"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                                        Location<span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        {...field}
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                    >
                                                        <option value="">Select a Location</option>
                                                        {subCategories.map((subCategory) => (
                                                            <option key={subCategory.location_name} value={subCategory.location_name}>
                                                                {subCategory.location_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.location_name && <p className="text-red-500 text-sm">{errors.location_name.message}</p>}
                                                </div>
                                            )} />
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Property ID<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="property_id"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Property ID"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.property_id && <p className="text-red-500 text-sm">{errors.property_id.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Hotel Name<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="hotel_name"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Hotel Name"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.hotel_name && <p className="text-red-500 text-sm">{errors.hotel_name.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Price<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="highest_price"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Price"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.highest_price && <p className="text-red-500 text-sm">{errors.highest_price.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Sale Price<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="starting_price"
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
                                            {errors.starting_price && <p className="text-red-500 text-sm">{errors.starting_price.message}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-6 mt-4">
                                        <div className="sm:col-span-2"> {/* Full Address 40% */}
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Full Address<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="full_address"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Full Address"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.full_address && <p className="text-red-500 text-sm">{errors.full_address.message}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">Rating</label>
                                            <Controller
                                                name="ratings"
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                    >
                                                        <option value="">Select Rating</option>
                                                        {[1, 2, 3, 4, 5].map((ratings) => (
                                                            <option key={ratings} value={ratings}>
                                                                {ratings}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.ratings && <p className="text-red-500 text-sm">{errors.ratings.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Max Adults<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="max_adult"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        placeholder="2"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.max_adult && <p className="text-red-500 text-sm">{errors.max_adult.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Max Children<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="max_children"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        placeholder="2"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.max_children && <p className="text-red-500 text-sm">{errors.max_children.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Max Infants<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="max_infant"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        placeholder="2"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.max_infant && <p className="text-red-500 text-sm">{errors.max_infant.message}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                                        <div className="relative">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">Hotel Policy</label>
                                            <div
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 cursor-pointer flex items-center justify-between"
                                                onClick={toggleDropdown}
                                                aria-label="Hotel Policy"
                                            >
                                                <span>Select Policy</span>
                                                <FaChevronDown className="ml-2" />
                                            </div>
                                            {loading && (
                                                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 p-2 text-center">
                                                    <span>Loading...</span>
                                                </div>
                                            )}
                                            {isDropdownVisible && (
                                                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10">
                                                    <ul>
                                                        {policy.length > 0 ? (
                                                            policy.map((Hotel) => (
                                                                <li
                                                                    key={Hotel.id}
                                                                    onClick={() => handleSelectChange(Hotel)}
                                                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${selectedHotelPolicies.some(
                                                                        (selected) => selected.id === Hotel.id
                                                                    ) ? 'bg-gray-100' : ''}`}
                                                                >
                                                                    {Hotel.policy_title}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="px-4 py-2 text-gray-500">No Policies available</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedHotelPolicies.map((policy) => (
                                                    <span key={policy.id} className="flex items-center px-4 py-2 rounded-full border border-gray-600">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{policy.policy_title}</span>
                                                            <span className="text-sm text-gray-600">{truncateDescription(policy.policy_description)}</span>
                                                        </div>
                                                        <button
                                                            className="ml-2 text-red-600"
                                                            onClick={() => handleRemoveSelectedHotelPolicy(policy.id)}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            {errors.policy_id && <p className="text-red-500 text-sm">{errors.policy_id.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">Hotel FAQ</label>
                                            <div
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 cursor-pointer flex items-center justify-between"
                                                onClick={toggleDropdownFaq}
                                                aria-label="Hotel FAQ"
                                            >
                                                <span>Select FAQ</span>
                                                <FaChevronDown className="ml-2" />
                                            </div>
                                            {loading && (
                                                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 p-2 text-center">
                                                    <span>Loading...</span>
                                                </div>
                                            )}
                                            {isFaqDropdownVisible && (
                                                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10">
                                                    <ul>
                                                        {tags.length > 0 ? (
                                                            tags.map((faq) => (
                                                                <li
                                                                    key={faq.id}
                                                                    onClick={() => handleSelectChangeFaq(faq)}
                                                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${selectedFAQs.some(
                                                                        (selected) => selected.id === faq.id
                                                                    ) ? 'bg-gray-100' : ''}`}
                                                                >
                                                                    {faq.faq_title}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="px-4 py-2 text-gray-500">No FAQs available</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedFAQs.map((faq) => (
                                                    <span
                                                        key={faq.id}
                                                        className="flex items-center px-4 py-2 rounded-full border border-gray-600"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{faq.faq_title}</span>
                                                            <span className="text-sm text-gray-600">{truncateFaqDescription(faq.faq_description)}</span>
                                                        </div>
                                                        <button
                                                            className="ml-2 text-red-600"
                                                            onClick={() => handleRemoveSelectedFAQ(faq.id)}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            {errors.faq_id && <p className="text-red-500 text-sm">{errors.faq_id.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Upload Multiple Images
                                            </label>
                                            <input
                                                name="images"
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
                                                            className="w-10 h-10 object-cover rounded-md" />
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
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                URL Title<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="seo_title"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter URL Title"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.seo_title && <p className="text-red-500 text-sm">{errors.seo_title.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                SEO Description<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="seo_description"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter SEO Description"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.seo_description && <p className="text-red-500 text-sm">{errors.seo_description.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Meta Title<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="meta_title"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Meta Title"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.meta_title && <p className="text-red-500 text-sm">{errors.meta_title.message}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Attributes</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {/* Map over the fetched attributes and create checkboxes dynamically */}
                                            {attributes.map((attribute) => (
                                                <div key={attribute.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={attribute.id}
                                                        value={attribute.amenity_name}
                                                        className="mr-2"
                                                        onChange={(e) => handleAttributeChange(e, attribute.id)}
                                                    />
                                                    <label htmlFor={attribute.id}>{attribute.amenity_name}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Description</label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <ReactQuill
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    placeholder="Enter a detailed description of the Hotel "
                                                    className="w-full h-[140px] rounded-md px-0 py-0 text-gray-800 focus:outline-none"
                                                />
                                            )}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                        )}
                                    </div>
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
                            className="bg-white rounded-lg shadow-2xl p-12 w-[70%] max-h-[90%] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Hotel</h2>
                            <form onSubmit={handleSubmit(handleFormUpdate)}>
                                <div className="mb-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                        <Controller
                                            name="location_name"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                                        Location<span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        {...field}
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                    >
                                                        <option value="">Select a Location</option>
                                                        {subCategories.map((subCategory) => (
                                                            <option key={subCategory.location_name} value={subCategory.location_name}>
                                                                {subCategory.location_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.location_name && <p className="text-red-500 text-sm">{errors.location_name.message}</p>}
                                                </div>
                                            )} />
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Property ID<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="property_id"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Property ID"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.property_id && <p className="text-red-500 text-sm">{errors.property_id.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Hotel Name<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="hotel_name"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Hotel Name"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.hotel_name && <p className="text-red-500 text-sm">{errors.hotel_name.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Price<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="highest_price"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Price"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.highest_price && <p className="text-red-500 text-sm">{errors.highest_price.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Sale Price<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="starting_price"
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
                                            {errors.starting_price && <p className="text-red-500 text-sm">{errors.starting_price.message}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-6 mt-4">
                                        <div className="sm:col-span-2"> {/* Full Address 40% */}
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Full Address<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="full_address"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Full Address"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.full_address && <p className="text-red-500 text-sm">{errors.full_address.message}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">Rating</label>
                                            <Controller
                                                name="ratings"
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                    >
                                                        <option value="">Select Rating</option>
                                                        {[1, 2, 3, 4, 5].map((ratings) => (
                                                            <option key={ratings} value={ratings}>
                                                                {ratings}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.ratings && <p className="text-red-500 text-sm">{errors.ratings.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Max Adults<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="max_adult"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        placeholder="2"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.max_adult && <p className="text-red-500 text-sm">{errors.max_adult.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Max Children<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="max_children"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        placeholder="2"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.max_children && <p className="text-red-500 text-sm">{errors.max_children.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Max Infants<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="max_infant"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="number"
                                                        placeholder="2"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.max_infant && <p className="text-red-500 text-sm">{errors.max_infant.message}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                                        <div className="relative">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">Hotel Policy</label>
                                            <div
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 cursor-pointer flex items-center justify-between"
                                                onClick={toggleDropdown}
                                                aria-label="Hotel Policy"
                                            >
                                                <span>Select Policy</span>
                                                <FaChevronDown className="ml-2" />
                                            </div>
                                            {loading && (
                                                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 p-2 text-center">
                                                    <span>Loading...</span>
                                                </div>
                                            )}
                                            {isDropdownVisible && (
                                                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10">
                                                    <ul>
                                                        {policy.length > 0 ? (
                                                            policy.map((Hotel) => (
                                                                <li
                                                                    key={Hotel.id}
                                                                    onClick={() => handleSelectChange(Hotel)}
                                                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${selectedHotelPolicies.some(
                                                                        (selected) => selected.id === Hotel.id
                                                                    ) ? 'bg-gray-100' : ''}`}
                                                                >
                                                                    {Hotel.policy_title}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="px-4 py-2 text-gray-500">No Policies available</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedHotelPolicies.map((policy) => (
                                                    <span key={policy.id} className="flex items-center px-4 py-2 rounded-full border border-gray-600">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{policy.policy_title}</span>
                                                            <span className="text-sm text-gray-600">{truncateDescription(policy.policy_description)}</span>
                                                        </div>
                                                        <button
                                                            className="ml-2 text-red-600"
                                                            onClick={() => handleRemoveSelectedHotelPolicy(policy.id)}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            {errors.policy_id && <p className="text-red-500 text-sm">{errors.policy_id.message}</p>}
                                        </div>
                                        <div className="relative">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">Hotel FAQ</label>
                                            <div
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 cursor-pointer flex items-center justify-between"
                                                onClick={toggleDropdownFaq}
                                                aria-label="Hotel FAQ"
                                            >
                                                <span>Select FAQ</span>
                                                <FaChevronDown className="ml-2" />
                                            </div>
                                            {loading && (
                                                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 p-2 text-center">
                                                    <span>Loading...</span>
                                                </div>
                                            )}
                                            {isFaqDropdownVisible && (
                                                <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10">
                                                    <ul>
                                                        {tags.length > 0 ? (
                                                            tags.map((faq) => (
                                                                <li
                                                                    key={faq.id}
                                                                    onClick={() => handleSelectChangeFaq(faq)}
                                                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${selectedFAQs.some(
                                                                        (selected) => selected.id === faq.id
                                                                    ) ? 'bg-gray-100' : ''}`}
                                                                >
                                                                    {faq.faq_title}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="px-4 py-2 text-gray-500">No FAQs available</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedFAQs.map((faq) => (
                                                    <span
                                                        key={faq.id}
                                                        className="flex items-center px-4 py-2 rounded-full border border-gray-600"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{faq.faq_title}</span>
                                                            <span className="text-sm text-gray-600">{truncateFaqDescription(faq.faq_description)}</span>
                                                        </div>
                                                        <button
                                                            className="ml-2 text-red-600"
                                                            onClick={() => handleRemoveSelectedFAQ(faq.id)}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            {errors.faq_id && <p className="text-red-500 text-sm">{errors.faq_id.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Upload Multiple Images
                                            </label>
                                            <input
                                                name="images"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                            />
                                            <div style={{ marginTop: '10px' }}>
                                                {images.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between my-2">
                                                        {/* <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={file.name}
                                                            className="w-10 h-10 object-cover rounded-md" /> */}
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
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                URL Title<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="seo_title"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter URL Title"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.seo_title && <p className="text-red-500 text-sm">{errors.seo_title.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                SEO Description<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="seo_description"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter SEO Description"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.seo_description && <p className="text-red-500 text-sm">{errors.seo_description.message}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-lg text-gray-600 font-medium mb-2">
                                                Meta Title<span className="text-red-500">*</span>
                                            </label>
                                            <Controller
                                                name="meta_title"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Meta Title"
                                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            {errors.meta_title && <p className="text-red-500 text-sm">{errors.meta_title.message}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Attributes</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {/* Map over the fetched attributes and create checkboxes dynamically */}
                                            {attributes.map((attribute) => (
                                                <div key={attribute.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={attribute.id}
                                                        value={attribute.amenity_name}
                                                        className="mr-2"
                                                        onChange={(e) => handleAttributeChange(e, attribute.id)}
                                                    />
                                                    <label htmlFor={attribute.id}>{attribute.amenity_name}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Description</label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <ReactQuill
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    placeholder="Enter a detailed description of the Hotel "
                                                    className="w-full h-[140px] rounded-md px-0 py-0 text-gray-800 focus:outline-none"
                                                />
                                            )}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
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
                                <th className="px-6 py-4 text-left">Hotel Name</th>
                                <th className="px-6 py-4 text-left">Price</th>
                                <th className="px-6 py-4 text-left">Location</th>
                                <th className="px-6 py-4 text-left">Ratings</th>
                                <th className="px-6 py-4 text-left">Full Address</th>
                                <th className="px-6 py-4 text-right">Actions</th>
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
                                        No Hotel data found
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
                                        {/* <td className="px-6 py-4">
                                            <img
                                                src={product.ghg}
                                                alt={product.Hotel}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        </td> */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/manage-rooms?hotel_id=${product.id}`)
                                                }
                                                className="bg-transparent text-[#4318ff] border-2 border-[#4318ff] px-4 py-2 text-sm rounded-md cursor-pointer transition-all duration-300 hover:bg-[#4318ff1a] mt-4"
                                            >
                                                {product.hotel_name}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">{product.highest_price || ''}</td>
                                        <td className="px-6 py-4">{product.location_name || ''}</td>
                                        <td className="px-6 py-4">
                                            {product.ratings}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.full_address}
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
                            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this Hotel?</h2>
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

            </div >

        </div>

    );
}

export default AllHotel;
