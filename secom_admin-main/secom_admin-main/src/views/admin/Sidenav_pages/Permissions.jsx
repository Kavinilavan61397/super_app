import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV, FaEye } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { TokenExpiration } from 'views/auth/TokenExpiration ';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from 'components/navbar';
import { permissionService } from 'services/permissionService';

function Permissions() {
    const [tableData, setTableData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [moduleFilter, setModuleFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Permission name is required'),
        description: Yup.string().required('Description is required'),
        resource: Yup.string().required('Resource is required'),
        action: Yup.string().required('Action is required'),
        category: Yup.string().required('Category is required'),
        module: Yup.string().required('Module is required')
    });

    const { reset, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            description: '',
            resource: '',
            action: '',
            category: '',
            module: ''
        }
    });

    // Fetch data function
    const fetchPermissionData = async () => {
        try {
            setLoading(true);
            const response = await permissionService.getAllPermissions({
                page: currentPage,
                limit: itemsPerPage
            });
            
            if (response.success) {
                setTableData(response.data || []);
                setFilteredData(response.data || []);
                setTotalItems(response.data?.length || 0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(error.message || 'Failed to fetch permissions');
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

    // Handle search and filter
    useEffect(() => {
        let filtered = tableData;

        // Apply search filter
        if (searchQuery) {
            const lowercasedSearchQuery = searchQuery.toLowerCase();
            filtered = filtered.filter((permission) => {
                return (
                    permission.name?.toLowerCase().includes(lowercasedSearchQuery) ||
                    permission.description?.toLowerCase().includes(lowercasedSearchQuery) ||
                    permission.resource?.toLowerCase().includes(lowercasedSearchQuery) ||
                    permission.action?.toLowerCase().includes(lowercasedSearchQuery) ||
                    permission.category?.toLowerCase().includes(lowercasedSearchQuery) ||
                    permission.module?.toLowerCase().includes(lowercasedSearchQuery)
                );
            });
        }

        // Apply module filter
        if (moduleFilter !== 'all') {
            filtered = filtered.filter(permission => permission.module === moduleFilter);
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(permission => permission.category === categoryFilter);
        }

        setFilteredData(filtered);
        setTotalItems(filtered.length);
        setCurrentPage(1);
    }, [searchQuery, moduleFilter, categoryFilter, tableData]);

    useEffect(() => {
        fetchPermissionData();
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
            
            if (openEditModal) {
                if (!selectedPermission || !selectedPermission._id) {
                    toast.error('No permission selected for update. Please try again.');
                    setLoading(false);
                    return;
                }
                // Update permission
                await permissionService.updatePermission(selectedPermission._id, data);
                toast.success('Permission updated successfully!');
            } else {
                // Create permission
                await permissionService.createPermission(data);
                toast.success('Permission created successfully!');
            }
            
            setOpenAddModal(false);
            setOpenEditModal(false);
            setSelectedPermission(null);
            reset();
            fetchPermissionData();
        } catch (error) {
            console.error('Error saving permission:', error);
            toast.error(error.message || 'Failed to save permission');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit permission
    const handleEditPermission = (permission) => {
        setSelectedPermission(permission);
        setValue('name', permission.name);
        setValue('description', permission.description);
        setValue('resource', permission.resource);
        setValue('action', permission.action);
        setValue('category', permission.category);
        setValue('module', permission.module);
        setOpenEditModal(true);
    };

    // Handle delete permission
    const handleDeletePermission = (permission) => {
        setSelectedPermission(permission);
        setOpenDeleteDialog(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirmation = async () => {
        if (!selectedPermission) return;
        
        try {
            setIsDeleting(true);
            await permissionService.deletePermission(selectedPermission._id);
            toast.success('Permission deleted successfully!');
            setOpenDeleteDialog(false);
            setSelectedPermission(null);
            fetchPermissionData();
        } catch (error) {
            console.error('Error deleting permission:', error);
            toast.error(error.message || 'Failed to delete permission');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) {
            toast.warning('Please select at least one permission to delete!');
            return;
        }

        try {
            setIsDeleting(true);
            
            for (const permissionId of selectedRows) {
                await permissionService.deletePermission(permissionId);
            }
            
            toast.success('Selected permissions deleted successfully!');
            setSelectedRows([]);
            fetchPermissionData();
        } catch (error) {
            console.error('Error deleting permissions:', error);
            toast.error(error.message || 'Failed to delete permissions');
        } finally {
            setIsDeleting(false);
        }
    };

    // Resource options
    const resourceOptions = [
        { value: 'products', label: 'Products' },
        { value: 'orders', label: 'Orders' },
        { value: 'categories', label: 'Categories' },
        { value: 'users', label: 'Users' },
        { value: 'roles', label: 'Roles' },
        { value: 'permissions', label: 'Permissions' },
        { value: 'staff', label: 'Staff' }
    ];

    // Action options
    const actionOptions = [
        { value: 'create', label: 'Create' },
        { value: 'read', label: 'Read' },
        { value: 'update', label: 'Update' },
        { value: 'delete', label: 'Delete' },
        { value: 'manage', label: 'Manage' }
    ];

    // Category options
    const categoryOptions = [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'groceries', label: 'Groceries' },
        { value: 'restaurants', label: 'Restaurants' },
        { value: 'hotels', label: 'Hotels' },
        { value: 'taxi', label: 'Taxi' },
        { value: 'all', label: 'All Categories' }
    ];

    // Module options
    const moduleOptions = [
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'grocery', label: 'Grocery' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'hotel', label: 'Hotel' },
        { value: 'taxi', label: 'Taxi' },
        { value: 'admin', label: 'Admin' }
    ];

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gray-50">
            {/* Top Bar - Card Style */}
            <div className="w-full max-w-6xl mt-8 mb-4 rounded-xl shadow-lg bg-white flex flex-col">
                <div className="flex flex-row items-center justify-between px-8 py-6">
                    {/* Page Title (Breadcrumb) */}
                    <h1 className="text-2xl font-bold text-gray-800">Permissions</h1>
                    {/* Search and Add Button */}
                    <div className="flex flex-row items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by Name, Description, Resource, Action..."
                                onChange={(e) => setSearchQuery(e.target.value)}
                                value={searchQuery}
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:bg-white transition"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            onClick={() => {
                                reset();
                                setOpenAddModal(true);
                            }}
                            className="bg-[#4318ff] hover:bg-[#3300cc] text-white px-6 py-2 rounded-lg text-base font-semibold shadow-md transition"
                        >
                            + Add Permission
                        </button>
                    </div>
                </div>
            </div>
            {/* Table Card */}
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-0">
                {/* Table and rest of the content remain unchanged. Remove the old search/filter bar and duplicate Add Permission button here. */}
                {/* Add/Edit Modal */}
                {(openAddModal || openEditModal) && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50" onClick={() => {
                        setOpenAddModal(false);
                        setOpenEditModal(false);
                        setSelectedPermission(null);
                        reset();
                    }}>
                        <div className="bg-white rounded-lg shadow-2xl p-12 w-[60%] max-h-[85%] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                {openEditModal ? 'Edit Permission' : 'Add New Permission'}
                            </h2>
                            
                            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Permission Name <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                    placeholder="e.g., products:create:electronics"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Description <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                    placeholder="Can create electronics products"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Resource <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="resource"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                    {...field}
                                                >
                                                    <option value="">Select Resource</option>
                                                    {resourceOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.resource && <p className="text-red-500 text-sm mt-1">{errors.resource.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Action <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="action"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                    {...field}
                                                >
                                                    <option value="">Select Action</option>
                                                    {actionOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.action && <p className="text-red-500 text-sm mt-1">{errors.action.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-lg text-gray-600 font-medium mb-2">Category <span className="text-red-500">*</span></label>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                    {...field}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categoryOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Module <span className="text-red-500">*</span></label>
                                    <Controller
                                        name="module"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            >
                                                <option value="">Select Module</option>
                                                {moduleOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                    {errors.module && <p className="text-red-500 text-sm mt-1">{errors.module.message}</p>}
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenAddModal(false);
                                            setOpenEditModal(false);
                                            setSelectedPermission(null);
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
                                        {openEditModal ? 'Update Permission' : 'Create Permission'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Table */}
                {loading && (
                    <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
                        <FaSpinner className="animate-spin text-4xl text-purple-600" />
                    </div>
                )}
                <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                    {selectedRows.length > 0 && (
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={handleBulkDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
                                aria-label="Delete Selected Permissions"
                            >
                                <FaTrashAlt className="inline mr-2" /> Delete Selected
                            </button>
                        </div>
                    )}
                    <table className="w-full table-auto shadow-lg rounded-2xl overflow-hidden">
                        <thead className="sticky top-0 bg-white z-10">
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
                                                    setSelectedRows(getPaginatedData().map((row) => row._id));
                                                }
                                            }}
                                            aria-label="Select all permissions"
                                        />
                                        {selectedRows.length > 0 && (
                                            <button
                                                onClick={handleBulkDelete}
                                                className={`text-gray-600 hover:text-red-600 text-xl flex items-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={isDeleting}
                                                aria-label="Delete selected permissions"
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
                                <th className="px-6 py-4 text-left">Permission Name</th>
                                <th className="px-6 py-4 text-left">Description</th>
                                <th className="px-6 py-4 text-left">Resource</th>
                                <th className="px-6 py-4 text-left">Action</th>
                                <th className="px-6 py-4 text-left">Category</th>
                                <th className="px-6 py-4 text-left">Module</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedData().length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-gray-500">
                                        {loading ? 'Loading...' : 'No Permissions found'}
                                    </td>
                                </tr>
                            ) : (
                                getPaginatedData().map((permission) => (
                                    <tr key={permission._id} className="border-t hover:bg-purple-50 transition group">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(permission._id)}
                                                onChange={() => handleRowSelection(permission._id)}
                                                aria-label={`Select permission ${permission.name}`}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm truncate max-w-xs" title={permission.name}>{permission.name}</td>
                                        <td className="px-6 py-4 truncate max-w-xs" title={permission.description}>{permission.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow-sm">{permission.resource}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                                permission.action === 'create' ? 'bg-green-100 text-green-700' :
                                                permission.action === 'read' ? 'bg-blue-100 text-blue-700' :
                                                permission.action === 'update' ? 'bg-yellow-100 text-yellow-700' :
                                                permission.action === 'delete' ? 'bg-red-100 text-red-700' :
                                                'bg-purple-100 text-purple-700'
                                            }`}>
                                                {permission.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                                permission.category === 'all' ? 'bg-gray-100 text-gray-700' :
                                                permission.category === 'electronics' ? 'bg-blue-100 text-blue-700' :
                                                permission.category === 'clothing' ? 'bg-pink-100 text-pink-700' :
                                                permission.category === 'groceries' ? 'bg-green-100 text-green-700' :
                                                permission.category === 'restaurants' ? 'bg-orange-100 text-orange-700' :
                                                permission.category === 'hotels' ? 'bg-purple-100 text-purple-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {permission.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                                permission.module === 'admin' ? 'bg-red-100 text-red-700' :
                                                permission.module === 'ecommerce' ? 'bg-blue-100 text-blue-700' :
                                                permission.module === 'grocery' ? 'bg-green-100 text-green-700' :
                                                permission.module === 'restaurant' ? 'bg-orange-100 text-orange-700' :
                                                permission.module === 'hotel' ? 'bg-purple-100 text-purple-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {permission.module}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex space-x-2 justify-end">
                                                <button
                                                    onClick={() => handleEditPermission(permission)}
                                                    className="p-2 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    aria-label={`Edit permission ${permission.name}`}
                                                    tabIndex={0}
                                                    title="Edit"
                                                >
                                                    <FaEdit className="text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePermission(permission)}
                                                    className="p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                    aria-label={`Delete permission ${permission.name}`}
                                                    tabIndex={0}
                                                    title="Delete"
                                                >
                                                    <FaTrashAlt className="text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex space-x-2 bg-white rounded-lg shadow px-4 py-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Previous page"
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                        currentPage === page
                                            ? 'bg-purple-600 text-white shadow'
                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                    aria-label={`Go to page ${page}`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Next page"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {openDeleteDialog && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this permission?</h2>
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
        </div>
    );
}

export default Permissions; 