import React, { useState, useEffect, useRef } from 'react';
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
import { userService } from 'services/userService';

function Users() {
    const [tableData, setTableData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    // Yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().when('$isEdit', {
            is: false,
            then: (schema) => schema.required('Password is required').min(6, 'Password must be at least 6 characters'),
            otherwise: (schema) => schema.optional(),
        }),
        phone: Yup.string().optional(),
        role: Yup.string().required('Role is required'),
        status: Yup.boolean().required('Status is required')
    });

    const { reset, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        context: { isEdit: openEditModal },
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            role: 'user',
            status: true
        }
    });

    // Fetch data function
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers({
                page: currentPage,
                limit: itemsPerPage
            });
            
            if (response.success) {
                setTableData(response.data.users || response.data);
                setFilteredData(response.data.users || response.data);
                setTotalItems(response.data.pagination?.total || response.data.length);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Handle search input change
    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((user) => {
                const lowercasedSearchQuery = searchQuery.toLowerCase();
                return (
                    user.name?.toLowerCase().includes(lowercasedSearchQuery) ||
                    user.email?.toLowerCase().includes(lowercasedSearchQuery) ||
                    user.phone?.toLowerCase().includes(lowercasedSearchQuery) ||
                    user.role?.toLowerCase().includes(lowercasedSearchQuery)
                );
            });
            setFilteredData(filtered);
            setTotalItems(filtered.length);
            setCurrentPage(1);
        } else {
            setFilteredData(tableData);
            setTotalItems(tableData.length);
        }
    }, [searchQuery, tableData]);

    useEffect(() => {
        fetchUserData();
    }, [currentPage, itemsPerPage]);

    // Handle row selection
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

    function formatDateWithOrdinal(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        
        const ordinal = (n) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
    
        return `${day}${ordinal(day)} ${month} ${year}`;
    }

    // Handle form submission
    const handleFormSubmit = async (data) => {
        try {
            setLoading(true);
            
            if (openEditModal && selectedUser) {
                // Update user
                const updateData = { ...data };
                if (!updateData.password) {
                    delete updateData.password;
                }
                
                await userService.updateUser(selectedUser.id, updateData);
                toast.success('User updated successfully!');
            } else {
                // Create user
                await userService.createUser(data);
                toast.success('User created successfully!');
            }
            
            setOpenAddModal(false);
            setOpenEditModal(false);
            setSelectedUser(null);
            reset();
            fetchUserData();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.message || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit user
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setValue('name', user.name);
        setValue('email', user.email);
        setValue('phone', user.phone || '');
        setValue('role', user.role);
        setValue('status', user.status);
        setOpenEditModal(true);
    };

    // Handle delete user
    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirmation = async () => {
        if (!selectedUser) return;
        
        try {
            setIsDeleting(true);
            await userService.deleteUser(selectedUser.id);
            toast.success('User deleted successfully!');
            setOpenDeleteDialog(false);
            setSelectedUser(null);
            fetchUserData();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.message || 'Failed to delete user');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) {
            toast.warning('Please select at least one user to delete!');
            return;
        }

        try {
            setIsDeleting(true);
            
            for (const userId of selectedRows) {
                await userService.deleteUser(userId);
            }
            
            toast.success('Selected users deleted successfully!');
            setSelectedRows([]);
            fetchUserData();
        } catch (error) {
            console.error('Error deleting users:', error);
            toast.error(error.message || 'Failed to delete users');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen pt-6">
            <Navbar brandText={"Users"} />
            <TokenExpiration />
            <ToastContainer />
            
            {/* Search bar */}
            <div className="relative mt-4 flex flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
                <div className="flex h-full w-full items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white">
                    <p className="pl-3 pr-2 text-xl">
                        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                        type="text"
                        placeholder="Search by Name, Email, Phone, Role..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                    />
                </div>
                
                <button
                    onClick={() => {
                        reset();
                        setOpenAddModal(true);
                    }}
                    className="bg-[#4318ff] text-white px-6 py-2 rounded-full text-lg font-medium flex items-center ml-auto"
                >
                    <FaPlus className="mr-2" /> Add User
                </button>
            </div>

            {/* Add/Edit Modal */}
            {(openAddModal || openEditModal) && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50" onClick={() => {
                    setOpenAddModal(false);
                    setOpenEditModal(false);
                    setSelectedUser(null);
                    reset();
                }}>
                    <div className="bg-white rounded-lg shadow-2xl p-12 w-[50%] max-h-[85%] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            {openEditModal ? 'Edit User' : 'Add New User'}
                        </h2>
                        
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Name"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="email"
                                                placeholder="Enter Email"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        {openEditModal ? 'New Password (optional)' : 'Password'} <span className="text-red-500">{!openEditModal && '*'}</span>
                                    </label>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="password"
                                                placeholder={openEditModal ? "Leave blank to keep current password" : "Enter Password"}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Phone</label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Phone"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="role"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="ecommerce_admin">Ecommerce Admin</option>
                                                <option value="grocery_admin">Grocery Admin</option>
                                                <option value="taxi_admin">Taxi Admin</option>
                                                <option value="hotel_admin">Hotel Admin</option>
                                            </select>
                                        )}
                                    />
                                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        )}
                                    />
                                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenAddModal(false);
                                        setOpenEditModal(false);
                                        setSelectedUser(null);
                                        reset();
                                    }}
                                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-white bg-[#4318ff] rounded-md hover:bg-[#3311db] flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <FaSpinner className="animate-spin mr-2" />
                                    ) : null}
                                    {openEditModal ? 'Update User' : 'Create User'}
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
                                        checked={selectedRows.length === getPaginatedData().length && getPaginatedData().length > 0}
                                        onChange={() => {
                                            if (selectedRows.length === getPaginatedData().length) {
                                                setSelectedRows([]);
                                            } else {
                                                setSelectedRows(getPaginatedData().map((row) => row.id));
                                            }
                                        }}
                                    />
                                    {selectedRows.length > 0 && (
                                        <button
                                            onClick={handleBulkDelete}
                                            className={`text-gray-600 hover:text-red-600 text-xl flex items-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaTrashAlt />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left">Date</th>
                            <th className="px-6 py-4 text-left">Name</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-left">Phone</th>
                            <th className="px-6 py-4 text-left">Role</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPaginatedData().length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    {loading ? 'Loading...' : 'No Users found'}
                                </td>
                            </tr>
                        ) : (
                            getPaginatedData().map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(user.id)}
                                            onChange={() => handleRowSelection(user.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDateWithOrdinal(user.created_at || user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.phone || user.mobile_number || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                            user.role === 'ecommerce_admin' ? 'bg-blue-100 text-blue-800' :
                                            user.role === 'grocery_admin' ? 'bg-green-100 text-green-800' :
                                            user.role === 'taxi_admin' ? 'bg-yellow-100 text-yellow-800' :
                                            user.role === 'hotel_admin' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="relative inline-block group">
                                            <button
                                                onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            <div
                                                className="absolute right-10 flex space-x-2 opacity-0 group-hover:opacity-100 group-hover:flex transition-all duration-200"
                                                style={{ marginTop: "-30px" }}
                                            >
                                                <div
                                                    onClick={() => {
                                                        handleEditUser(user);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="flex items-center px-4 py-2 text-navy-700 hover:bg-gray-200 cursor-pointer"
                                                >
                                                    <FaEdit className="mr-2 text-black" />
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        handleDeleteUser(user);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-200 cursor-pointer"
                                                >
                                                    <FaTrashAlt className="mr-2" />
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

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                    <span className="mr-2">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="border border-gray-300 px-4 py-2 rounded-md"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="ml-2">entries</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {openDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this user?</h2>
                        <p className="text-gray-600 mb-4">This action cannot be undone.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setOpenDeleteDialog(false)}
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

export default Users;
