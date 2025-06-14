import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { TokenExpiration } from 'views/auth/TokenExpiration ';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from 'components/navbar';



function HotelPolicy() {
    const [tableData, setTableData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedQuestion, setselectedQuestion] = useState(null);
    const [question, setquestion] = useState('');
    const [answer, setanswer] = useState(null);
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
        // question: Yup.string().required('Question Name is required'),
        // answer: Yup.string().required('answer Name is required'),

    });

    const validationSchemaEdit = Yup.object({
        // question: Yup.string().required('Question Name is required'),
        // answer: Yup.string().required('answer Name is required'),
    });

    const { register, reset, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(openAddModal ? validationSchemaAdd : validationSchemaEdit),
        defaultValues: {
            // question: selectedQuestion?.question || '',
            // answer: selectedQuestion?.answer || ''
        }
    });


    const fetchFaqData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/tourism_dup_api/api/admin/get_policy');
            let data = response.data;
            console.log(response.data);


            if (searchQuery.trim() !== '') {
                data = data.filter((faq) =>
                    faq.policy_title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setFilteredData(data);
            setTotalItems(data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchFaqData();
    }, [itemsPerPage, currentPage, searchQuery]);

    useEffect(() => {
        if (searchQuery.trim() === '') {

            setFilteredData(tableData);
            setTotalItems(tableData.length);
        } else {

            const filtered = tableData.filter((faq) =>
                faq.policy_title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
            setTotalItems(filtered.length);
        }
    }, [searchQuery, tableData]);


    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((faq) =>
                faq.policy_title.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by name
            );
            setFilteredData(filtered);
            setTotalItems(filtered.length);
            setCurrentPage(1); // Reset to first page when search query changes
        } else {
            setFilteredData(tableData); // If no search query, show all users
            setTotalItems(tableData.length);
        }
    }, [searchQuery, tableData]);

    useEffect(() => {
        fetchFaqData();
    }, [itemsPerPage]);

    const handleAnswerChange = (value) => {
        setanswer(value);
    };

    const [error, setError] = useState(null);
    
    const handleFormSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('policy_title', data.policy_title);
        formData.append('policy_description', data.policy_description);

        try {
            const accessToken = localStorage.getItem('tourism_token');
            const response = await axios.post(
                'https://yrpitsolutions.com/tourism_dup_api/api/admin/save_policy',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                setOpenAddModal(false);
                fetchFaqData();
                toast.success('Hotel Policy added successfully!', {
                    progress: undefined, // Hide the progress bar
                    hideProgressBar: true,
                });
            }
        } catch (error) {
            console.error('Error saving Hotel Policy:', error);
            toast.error('Error saving Hotel Policy!', {
                progress: undefined, // Hide the progress bar
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Update Form (Edit FAQ)
    const handleFormUpdate = async (data) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('policy_title', data.policy_title);
        formData.append('policy_description', data.policy_description);
        formData.append('_method', 'PUT');

        try {
            const accessToken = localStorage.getItem('tourism_token');

            const response = await axios({
                method: 'POST',
                url: `https://yrpitsolutions.com/tourism_dup_api/api/admin/update_policy_by_id/${selectedQuestion.id}`, // URL with selected FAQ id
                data: formData,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setOpenEditModal(false);
                fetchFaqData();
                toast.success('Hotel Policy updated successfully!', {
                    progress: undefined, // Hide the progress bar
                    hideProgressBar: true,
                });
            }
        } catch (error) {
            console.error('Error updating Hotel Policy:', error);
            toast.error('Error updating Hotel Policy!', {
                progress: undefined, // Hide the progress bar
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    };


    const handleAddfaq = () => {
        setselectedQuestion(null);
        setValue('policy_title', '');
        setValue('policy_description', '');
        setImagePreview(null);
        setOpenAddModal(true);
    };

    const handleEditRow = (faq) => {
        setselectedQuestion(faq);
        setValue('policy_title', faq.policy_title);
        setanswer('policy_description', faq.policy_description);
        setOpenEditModal(true);
    };


    const handleDeleteRow = (id) => {
        setRowIdToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirmation = async () => {
        setIsDeleting(true);
        try {
            const accessToken = localStorage.getItem('tourism_token');

            // Perform the delete request
            await axios.delete(`https://yrpitsolutions.com/tourism_dup_api/api/admin/delete_policy_by_id/${rowIdToDelete}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Refresh FAQ data and close the delete dialog
            fetchFaqData();
            setOpenDeleteDialog(false);

            // Show success toast
            toast.success('FAQ deleted successfully!', {
                progress: undefined,  // Hide progress bar
                hideProgressBar: true,
            });

        } catch (error) {
            console.error('Error deleting Hotel Policy:', error);

            // Show error toast
            toast.error('Error deleting Hotel Policy!', {
                progress: undefined,  // Hide progress bar
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
            const accessToken = localStorage.getItem('tourism_token');

            // Iterate through selected rows and delete each FAQ
            for (let id of selectedRows) {
                await axios.delete(`https://yrpitsolutions.com/tourism_dup_api/api/admin/delete_policy_by_id/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }

            // Refresh data and reset state
            await fetchFaqData();
            setSelectedRows([]); // Clear selection
            window.location.reload(); // Optionally refresh the page

            // Show success toast after bulk delete is complete
            toast.success('Selected Hotel Policy deleted successfully!', {
                progress: undefined, // Hide the progress bar
                hideProgressBar: true,
            });

        } catch (error) {
            console.error('Error deleting selected Hotel Policy:', error);

            // Show error toast if something goes wrong
            toast.error('Error deleting selected Hotel Policy!', {
                progress: undefined, // Hide the progress bar
                hideProgressBar: true,
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

    // Get paginated data
    const getPaginatedData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
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

    const handleCloseAddModal = () => {
        setOpenAddModal(false);
        setanswer(null);
        reset();
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setanswer(null);
        reset();
    };

    useEffect(() => {
        if (selectedQuestion) {
            setValue('policy_title', selectedQuestion.policy_title); // Prefill question
            setValue('policy_description', selectedQuestion.policy_description); // Prefill answer
        }
    }, [selectedQuestion, setValue]);


    return (
        <div className=" min-h-screen pt-6">
            <Navbar brandText={"Hotel Policy"} />
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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAddfaq}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
                    >
                        <FaPlus className="mr-2" /> Add Hotel Policy
                    </button>
                </span>





                {/* Add Modal */}
                {openAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-2xl p-8 w-[70%] max-w-3xl">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add Hotel Policy</h3>
                            <form onSubmit={handleSubmit(handleFormSubmit)}>
                                {/* Question Input */}
                                <div className="mb-6">
                                    <label htmlFor="question" className="block text-lg text-gray-600 font-medium mb-2">
                                        Name <span className="text-red-500 ">*</span>
                                    </label>
                                    <input
                                        name="policy_title"
                                        type="text"
                                        id="policy_title"
                                        {...register('policy_title')}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none"
                                        placeholder="Enter the Policy Title"
                                    />
                                    {errors.policy_title && <p className="text-red-500 text-sm mt-2">{errors.policy_title.message}</p>}
                                </div>

                                {/* Answer Input (React Quill) */}
                                <div className="mb-6">
                                    <label htmlFor="answer" className="block text-xl text-gray-600 font-medium mb-2">
                                        Description <span className="text-red-500 ">*</span>
                                    </label>
                                    <Controller
                                        name="policy_description"
                                        control={control}
                                        render={({ field }) => (
                                            <ReactQuill
                                                {...field} 
                                                value={field.value || ""}
                                                onChange={field.onChange} 
                                                className="w-full rounded-lg h-[200px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                                                placeholder="Enter the Policy Description"
                                            />
                                        )}
                                    />
                                    {errors.policy_description && <p className="text-red-500 text-sm mt-2">{errors.policy_description.message}</p>}
                                </div>

                                <div className="flex justify-end gap-4 mt-16">
                                    <button
                                        type="button"
                                        onClick={handleCloseAddModal}
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


                {/* Edit Modal */}
                {openEditModal && selectedQuestion && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-2xl p-8 w-[70%] max-w-3xl">
                            <h3 className="text-3xl font-semibold text-gray-800 mb-6">Edit Hotel Policy</h3>
                            <form onSubmit={handleSubmit(handleFormUpdate)}>
                                {/* Question Input */}
                                <div className="mb-6">
                                    <label htmlFor="question" className="block text-xl text-gray-600 font-medium mb-2">
                                        Name <span className="text-red-500 ">*</span>
                                    </label>
                                    <input
                                        name="policy_title"
                                        type="text"
                                        id="policy_title"
                                        {...register('policy_title')}
                                        // defaultValue={selectedpolicy_title?.policy_title || ''}  
                                        className="w-full px-5 py-4 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                                        placeholder="Enter the Policy Title"
                                    />

                                    {errors.policy_title && <p className="text-red-500 text-sm mt-2">{errors.policy_title.message}</p>}
                                </div>

                                {/* Answer Input (React Quill) */}
                                <div className="mb-6">
                                    <label htmlFor="answer" className="block text-xl text-gray-600 font-medium mb-2">
                                        Description <span className="text-red-500 ">*</span>
                                    </label>
                                    <Controller
                                        name="policy_description"
                                        control={control}
                                        render={({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                className="w-full rounded-lg h-[200px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                                                placeholder="Enter the Policy Description"
                                            />
                                        )}
                                    />
                                    {errors.policy_description && <p className="text-red-500 text-sm mt-2">{errors.policy_description.message}</p>}
                                </div>


                                {/* Buttons */}
                                <div className="flex justify-end gap-4 mt-16">
                                    <button
                                        type="button"
                                        onClick={handleCloseEditModal}
                                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit(handleFormUpdate)}
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
                                            // checked={selectedRows.length === getPaginatedData().length}
                                            checked={false}
                                            onChange={() => {
                                                if (selectedRows.length === getPaginatedData().length) {
                                                    setSelectedRows([]);
                                                } else {
                                                    setSelectedRows(getPaginatedData().map((row) => row.id));
                                                }
                                            }}
                                        />
                                    </div>
                                </th>
                                {/* <th className="px-6 py-4 text-left">Image</th> */}
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Description</th>
                                <th className="px-6 py-4 text-left">Actions</th>
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
                                    <td colSpan="4" className="text-center py-4 text-gray-500">
                                        No Hotel Policy found
                                    </td>
                                </tr>
                            ) : (
                                getPaginatedData().map((faq) => (
                                    <tr key={faq.id} className="border-t">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(faq.id)}
                                                onChange={() => handleRowSelection(faq.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">{faq.policy_title}</td>
                                        <td className="px-6 py-4" dangerouslySetInnerHTML={{ __html: faq.policy_description }}></td>
                                       <td className="text-right group relative">
                                            <div className="flex justify-end items-center space-x-2">
                                                {/* Ellipsis icon */}
                                                <button
                                                    onClick={() => setOpenDropdown(openDropdown === faq.id ? null : faq.id)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <FaEllipsisV />
                                                </button>
                                                {/* Edit and Delete icons visible on hover, aligned left */}
                                                <div className="absolute right-auto left-0 flex space-x-6 opacity-0 group-hover:opacity-100 group-hover:flex transition-all duration-200">
                                                    <button
                                                        onClick={() => {
                                                            handleEditRow(faq);
                                                        }}
                                                        className="text-navy-700 hover:bg-gray-200"
                                                    >
                                                        <FaEdit className="text-black" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteRow(faq.id);
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
                        {[5, 10, 20, 50, 100].map((option) => (
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
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this Policy?</h2>
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

export default HotelPolicy;