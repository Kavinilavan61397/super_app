import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import Navbar from 'components/navbar';

function Users() {
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [filteredData, setFilteredData] = useState([]); // State to store filtered data
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    // Fetch data function
    const fetchOrderData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/user/getAllUsers');
            setTableData(response.data.data);
            setFilteredData(response.data.data); // Initialize filtered data with all users
            setTotalItems(response.data.data.length); // Ensure response.data is an array
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Handle search input change
    // useEffect(() => {
    //     if (searchQuery) {
    //         const filtered = tableData.filter((user) =>
    //             user.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by name
    //         );
    //         setFilteredData(filtered);
    //         setTotalItems(filtered.length);
    //         setCurrentPage(1); // Reset to first page when search query changes
    //     } else {
    //         setFilteredData(tableData); // If no search query, show all users
    //         setTotalItems(tableData.length);
    //     }
    // }, [searchQuery, tableData]);
    
    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((user) => {
                const lowercasedSearchQuery = searchQuery.toLowerCase();
                return (
                    user.name?.toLowerCase().includes(lowercasedSearchQuery) || // Filter by name
                    user.email?.toLowerCase().includes(lowercasedSearchQuery) || // Filter by email
                    user.created_at?.toLowerCase().includes(lowercasedSearchQuery) // Filter by created_at
                );
            });
            setFilteredData(filtered);
            setTotalItems(filtered.length);
            setCurrentPage(1); // Reset to first page when search query changes
        } else {
            setFilteredData(tableData); // If no search query, show all users
            setTotalItems(tableData.length);
        }
    }, [searchQuery, tableData]);
    

    useEffect(() => {
        fetchOrderData();
    }, [itemsPerPage]);

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

    // const formatDate = (timestamp) => {
    //     const date = new Date(timestamp);
    //     return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    // };

    function formatDateWithOrdinal(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }); // Short month name (e.g., "Feb")
        const year = date.getFullYear();
        
        // Get the ordinal suffix
        const ordinal = (n) => {
            if (n > 3 && n < 21) return 'th'; // for 11th, 12th, 13th, etc.
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
    
        return `${day}${ordinal(day)} ${month} ${year}`;
    }
    return (
        <div className="min-h-screen pt-6">
                <Navbar brandText={"Users"} />
            {/* Search bar */}
            <div className="relative mt-4 flex flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
                <div className="flex h-full w-full items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white">
                    <p className="pl-3 pr-2 text-xl">
                        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                        type="text"
                        placeholder="Search by Date, Email, Name..."
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
                        value={searchQuery}
                        className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-gray-600">
                            <th className="px-6 py-4 text-left">Date</th>
                            <th className="px-6 py-4 text-left">Name</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-left">Mobile Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPaginatedData().length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No Users found
                                </td>
                            </tr>
                        ) : (
                            getPaginatedData().map((user) => (
                                <tr key={user.id} className="border-t">
                                    {/* <td className="px-6 py-4">{user.created_at}</td> */}
                                    {/* <td className="px-6 py-4">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td> */}
                                    <td className="px-6 py-4">
                                        {formatDateWithOrdinal(user.created_at)}
                                    </td>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.mobile_number}</td>
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
        </div>
    );
}

export default Users;
