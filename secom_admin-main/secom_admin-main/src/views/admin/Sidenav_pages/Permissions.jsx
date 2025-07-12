import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV, FaEye, FaShieldAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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
import UserModuleHeader from 'components/common/UserModuleHeader';

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
    const [statusFilter, setStatusFilter] = useState('all');

    // Simplified validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Permission name is required'),
        description: Yup.string().required('Description is required'),
        module: Yup.string().required('Module is required'),
        actions: Yup.array().min(1, 'At least one action must be selected').required('Actions are required')
    });

    const { reset, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            description: '',
            module: '',
            actions: []
        }
    });

    const watchedActions = watch('actions');

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
                    permission.module?.toLowerCase().includes(lowercasedSearchQuery)
                );
            });
        }

        // Apply module filter
        if (moduleFilter !== 'all') {
            filtered = filtered.filter(permission => permission.module === moduleFilter);
        }

        setFilteredData(filtered);
        setTotalItems(filtered.length);
        setCurrentPage(1);
    }, [searchQuery, moduleFilter, tableData]);

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

    // Mapping from UI module to backend enums
    const MODULE_MAPPING = {
      users: { resource: 'users', module: 'admin', category: 'all' },
      products: { resource: 'products', module: 'ecommerce', category: 'electronics' },
      orders: { resource: 'orders', module: 'taxi', category: 'taxi' },
      categories: { resource: 'categories', module: 'admin', category: 'all' },
      hotels: { resource: 'products', module: 'hotel', category: 'hotels' },
      restaurants: { resource: 'products', module: 'restaurant', category: 'restaurants' },
      taxi: { resource: 'orders', module: 'taxi', category: 'taxi' },
      grocery: { resource: 'products', module: 'grocery', category: 'groceries' },
      system: { resource: 'users', module: 'admin', category: 'all' }
    };

    // Action mapping from UI to backend
    const ACTION_MAPPING = {
      view: 'read',
      create: 'create',
      edit: 'update',
      delete: 'delete',
      manage: 'manage'
    };

    const ACTION_REVERSE_MAPPING = {
      read: 'view',
      create: 'create',
      update: 'edit',
      delete: 'delete',
      manage: 'manage'
    };

    // Handle form submission
    const handleFormSubmit = async (data) => {
        try {
            setLoading(true);
            const selectedModule = moduleOptions.find(opt => opt.value === data.module);
            const mapping = MODULE_MAPPING[data.module] || MODULE_MAPPING['users'];
            const actions = data.actions || [];
            let successCount = 0;
            let errorCount = 0;
            for (const action of actions) {
                const backendAction = ACTION_MAPPING[action] || action;
                const permissionData = {
                    name: `${data.name} - ${backendAction}`,
                    description: data.description,
                    resource: mapping.resource,
                    action: backendAction,
                    category: mapping.category,
                    module: mapping.module
                };
                if (openEditModal && selectedPermission) {
                    await permissionService.updatePermission(selectedPermission._id, permissionData);
                    successCount++;
                } else {
                    try {
                        await permissionService.createPermission(permissionData);
                        successCount++;
                    } catch (err) {
                        errorCount++;
                    }
                }
            }
            if (successCount > 0) toast.success(`${successCount} permission(s) saved successfully!`);
            if (errorCount > 0) toast.error(`${errorCount} permission(s) failed to save.`);
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
        setValue('name', permission.name || '');
        setValue('description', permission.description || '');
        setValue('module', permission.module || permission.resource || '');
        // Map backend actions to UI values for checkboxes
        let actions = [];
        if (permission.actions) {
          actions = permission.actions.split(',').map(a => ACTION_REVERSE_MAPPING[a] || a);
        } else if (permission.action) {
          actions = [ACTION_REVERSE_MAPPING[permission.action] || permission.action];
        }
        setValue('actions', actions);
        setOpenEditModal(true);
    };

    // Handle delete permission
    const handleDeletePermission = (permission) => {
        setSelectedPermission(permission);
        setOpenDeleteDialog(true);
    };

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
            toast.warning('Please select permissions to delete');
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

    // Simplified module options
    const moduleOptions = [
        { value: 'users', label: 'User Management', icon: '👥' },
        { value: 'products', label: 'Product Management', icon: '📦' },
        { value: 'orders', label: 'Order Management', icon: '📋' },
        { value: 'categories', label: 'Category Management', icon: '📂' },
        { value: 'hotels', label: 'Hotel Management', icon: '🏨' },
        { value: 'restaurants', label: 'Restaurant Management', icon: '🍽️' },
        { value: 'taxi', label: 'Taxi Management', icon: '🚕' },
        { value: 'grocery', label: 'Grocery Management', icon: '🛒' },
        { value: 'system', label: 'System Settings', icon: '⚙️' }
    ];

    // Simplified action options
    const actionOptions = [
        { value: 'view', label: 'View', description: 'Can view items' },
        { value: 'create', label: 'Create', description: 'Can create new items' },
        { value: 'edit', label: 'Edit', description: 'Can modify existing items' },
        { value: 'delete', label: 'Delete', description: 'Can remove items' },
        { value: 'manage', label: 'Manage', description: 'Full access to all operations' }
    ];

    // Handle action selection
    const handleActionToggle = (action) => {
        const currentActions = watchedActions || [];
        const newActions = currentActions.includes(action)
            ? currentActions.filter(a => a !== action)
            : [...currentActions, action];
        setValue('actions', newActions);
    };

    // Get unique modules for filter
    const getUniqueModules = () => {
        const modules = tableData.map(permission => permission.module || permission.resource).filter(Boolean);
        return [...new Set(modules)];
    };

    return (
        <div className="min-h-screen pt-6">
            <Navbar brandText={"Permissions"} />
            <TokenExpiration />
            <ToastContainer />
            
            {/* Enhanced Header with Info */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Permission Management</h1>
                        <p className="text-gray-600 mt-1">Control what users can access and modify in different modules</p>
                    </div>
                    <button
                        onClick={() => {
                            reset();
                            setOpenAddModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Add Permission
                    </button>
                </div>
                
                {/* Search and Filters */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search permissions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                    
                    <select
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Modules</option>
                        {getUniqueModules().map(module => (
                            <option key={module} value={module}>{module}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <FaSpinner className="animate-spin text-4xl text-blue-500" />
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {getPaginatedData().length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        {loading ? 'Loading...' : 'No permissions found'}
                                    </td>
                                </tr>
                            ) : (
                                getPaginatedData().map((permission) => (
                                    <tr key={permission._id || permission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{permission.name}</div>
                                                <div className="text-sm text-gray-500">{permission.description}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <FaShieldAlt className="mr-1" />
                                                {permission.module || permission.resource || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(permission.actions ? permission.actions.split(',') : []).map((action, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        {action}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {formatDateWithOrdinal(permission.createdAt || permission.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditPermission(permission)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Edit Permission"
                                                >
                                                    <FaEdit className="text-lg" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePermission(permission)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete Permission"
                                                >
                                                    <FaTrashAlt className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
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

            {/* Add/Edit Modal */}
            {(openAddModal || openEditModal) && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50" onClick={() => {
                    setOpenAddModal(false);
                    setOpenEditModal(false);
                    setSelectedPermission(null);
                    reset();
                }}>
                    <div className="bg-white rounded-lg shadow-2xl p-8 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            {openEditModal ? 'Edit Permission' : 'Add New Permission'}
                        </h2>
                        
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Permission Name <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., Manage Products"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                rows={3}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Describe what this permission allows users to do..."
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Module <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="module"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            >
                                                <option value="">Select Module</option>
                                                {moduleOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.icon} {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                    {errors.module && <p className="text-red-500 text-sm mt-1">{errors.module.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Allowed Actions <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {actionOptions.map(option => (
                                            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={watchedActions?.includes(option.value) || false}
                                                    onChange={() => handleActionToggle(option.value)}
                                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900">{option.label}</div>
                                                    <div className="text-sm text-gray-500">{option.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.actions && <p className="text-red-500 text-sm mt-1">{errors.actions.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t">
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
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                >
                                    {loading ? (
                                        <FaSpinner className="animate-spin mr-2" />
                                    ) : (
                                        <FaPlus className="mr-2" />
                                    )}
                                    {openEditModal ? 'Update Permission' : 'Create Permission'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {openDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Delete Permission?</h2>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete the permission "{selectedPermission?.name}"?
                        </p>
                        <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
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
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Permissions; 