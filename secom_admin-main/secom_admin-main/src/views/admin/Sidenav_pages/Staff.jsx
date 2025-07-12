import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV, FaCheckCircle, FaTimesCircle, FaUser, FaBuilding, FaBriefcase } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { TokenExpiration } from 'views/auth/TokenExpiration ';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from 'components/navbar';
import { staffService } from 'services/staffService';
import { userService } from 'services/userService';
import UserModuleHeader from 'components/common/UserModuleHeader';
import UserManagementInfo from 'components/common/UserManagementInfo';

function Staff() {
    const [tableData, setTableData] = useState([]);
    const [users, setUsers] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('active');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    // Yup validation schema
    const validationSchema = Yup.object({
        user_id: Yup.string().required('User is required'),
        department: Yup.string().required('Department is required'),
        position: Yup.string().required('Position is required'),
        hire_date: Yup.date().nullable(),
        salary: Yup.number().typeError('Salary must be a number').nullable(),
        status: Yup.boolean().required('Status is required')
    });

    const { reset, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            user_id: '',
            department: '',
            position: '',
            hire_date: '',
            salary: '',
            status: true
        }
    });

    // Fetch staff and users
    const fetchStaffData = async () => {
        try {
            setLoading(true);
            // Always fetch all staff, filter on frontend for instant UI like GroceryTable
            const response = await staffService.getAllStaff('?status=all');
            if (response.success) {
                setTableData(response.data);
                setFilteredData(response.data);
                setTotalItems(response.data.length);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch staff');
        } finally {
            setLoading(false);
        }
    };
    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers({ limit: 1000 });
            if (response.success) {
                setUsers(response.data.users || response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchStaffData();
        fetchUsers();
    }, []);

    // Get unique departments for filter
    const getUniqueDepartments = () => {
        const departments = tableData.map(staff => staff.department).filter(Boolean);
        return [...new Set(departments)];
    };

    // Search and status filter
    useEffect(() => {
        let filtered = tableData;
        
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter((staff) => {
                const user = staff.user || {};
                const lowercasedSearchQuery = searchQuery.toLowerCase();
                return (
                    user.name?.toLowerCase().includes(lowercasedSearchQuery) ||
                    user.email?.toLowerCase().includes(lowercasedSearchQuery) ||
                    staff.department?.toLowerCase().includes(lowercasedSearchQuery) ||
                    staff.position?.toLowerCase().includes(lowercasedSearchQuery)
                );
            });
        }
        
        // Apply status filter
        if (statusFilter === 'active') {
            filtered = filtered.filter(staff => staff.status === true);
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter(staff => staff.status === false);
        }

        // Apply department filter
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(staff => staff.department === departmentFilter);
        }
        
        // Sort by creation date (newest first)
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setFilteredData(filtered);
        setTotalItems(filtered.length);
        setCurrentPage(1);
    }, [searchQuery, statusFilter, departmentFilter, tableData]);

    // Pagination
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const getPaginatedData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    };
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Row selection
    const handleRowSelection = (id) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
    };

    // Form submit
    const handleFormSubmit = async (data) => {
        try {
            setLoading(true);
            if (openEditModal && selectedStaff) {
                await staffService.updateStaff(selectedStaff.id, data);
                toast.success('User assignment updated successfully!');
            } else {
                await staffService.createStaff(data);
                toast.success('User assigned to role successfully!');
            }
            setOpenAddModal(false);
            setOpenEditModal(false);
            setSelectedStaff(null);
            reset();
            fetchStaffData();
        } catch (error) {
            toast.error(error.message || 'Failed to save user assignment');
        } finally {
            setLoading(false);
        }
    };

    // Edit staff
    const handleEditStaff = (staff) => {
        setSelectedStaff(staff);
        setValue('user_id', staff.user_id);
        setValue('department', staff.department || '');
        setValue('position', staff.position || '');
        setValue('hire_date', staff.hire_date ? staff.hire_date.split('T')[0] : '');
        setValue('salary', staff.salary || '');
        setValue('status', staff.status);
        setOpenEditModal(true);
    };

    // Delete staff
    const handleDeleteStaff = (staff) => {
        setSelectedStaff(staff);
        setOpenDeleteDialog(true);
    };
    const handleDeleteConfirmation = async () => {
        if (!selectedStaff) return;
        try {
            setIsDeleting(true);
            await staffService.deleteStaff(selectedStaff.id);
            toast.success('User assignment removed successfully!');
            setOpenDeleteDialog(false);
            setSelectedStaff(null);
            fetchStaffData();
        } catch (error) {
            toast.error(error.message || 'Failed to remove user assignment');
        } finally {
            setIsDeleting(false);
        }
    };

    // Dropdown ref for outside click
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

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="p-6">
            <Navbar brandText={"User Assignments"} />
            <TokenExpiration />
            <ToastContainer />
            
            {/* <UserManagementInfo currentModule="staff" /> */}
            
            {/* Enhanced Header with Department Filter */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">User Assignments</h1>
                        <p className="text-gray-600 mt-1">Manage organizational roles and department assignments for users</p>
                    </div>
                    <button
                        onClick={() => {
                            reset();
                            setOpenAddModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Assign User to Role
                    </button>
                </div>
                
                {/* Search and Filters */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, department, or position..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Departments</option>
                        {getUniqueDepartments().map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <FaSpinner className="animate-spin text-4xl text-blue-500" />
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {getPaginatedData().length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        {loading ? 'Loading...' : 'No user assignments found'}
                                    </td>
                                </tr>
                            ) : (
                                getPaginatedData().map((staff) => (
                                    <tr key={staff.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                {staff.user?.profile_picture ? (
                                                    <img
                                                        src={staff.user.profile_picture}
                                                        alt={staff.user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                                                        {getInitials(staff.user?.name)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{staff.user?.name || 'Unknown User'}</div>
                                                    <div className="text-sm text-gray-500">{staff.user?.email || 'No email'}</div>
                                                    <div className="text-xs text-gray-400">
                                                        <FaUser className="inline mr-1" />
                                                        {staff.user?.role?.replace('_', ' ').toUpperCase() || 'No role'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <FaBuilding className="text-gray-400 mr-2" />
                                                <span className="text-gray-700">{staff.department || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <FaBriefcase className="text-gray-400 mr-2" />
                                                <span className="text-gray-700">{staff.position || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {staff.hire_date ? new Date(staff.hire_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {staff.salary !== null && staff.salary !== undefined ? `$${staff.salary.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {staff.status ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FaCheckCircle className="mr-1" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <FaTimesCircle className="mr-1" />
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditStaff(staff)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Edit Assignment"
                                                >
                                                    <FaEdit className="text-lg" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStaff(staff)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Remove Assignment"
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
                    setSelectedStaff(null);
                    reset();
                }}>
                    <div className="bg-white rounded-lg shadow-2xl p-12 w-[50%] max-h-[85%] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            {openEditModal ? 'Edit User Assignment' : 'Assign User to Role'}
                        </h2>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">User <span className="text-red-500">*</span></label>
                                    <Controller
                                        name="user_id"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            >
                                                <option value="">Select User</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} ({user.email}) - {user.role?.replace('_', ' ').toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                    {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Department <span className="text-red-500">*</span></label>
                                    <Controller
                                        name="department"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Department"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Position <span className="text-red-500">*</span></label>
                                    <Controller
                                        name="position"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="text"
                                                placeholder="Enter Position"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Hire Date</label>
                                    <Controller
                                        name="hire_date"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="date"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Salary</label>
                                    <Controller
                                        name="salary"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="Enter Salary"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none"
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg text-gray-600 font-medium mb-2">Status <span className="text-red-500">*</span></label>
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
                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenAddModal(false);
                                        setOpenEditModal(false);
                                        setSelectedStaff(null);
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
                                    {openEditModal ? 'Update Assignment' : 'Assign User'}
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
                        <h2 className="text-xl font-semibold mb-4">Remove User Assignment?</h2>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to remove {selectedStaff?.user?.name} from their role as {selectedStaff?.position} in {selectedStaff?.department}?
                        </p>
                        <p className="text-sm text-gray-500 mb-4">This will not delete the user account, only their organizational assignment.</p>
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
                                    'Remove Assignment'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Staff;