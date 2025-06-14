import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaSpinner } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FiSearch } from 'react-icons/fi';
import Navbar from 'components/navbar';

// function Orders() {
//     const [tableData, setTableData] = useState([]);
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(5);
//     const [totalItems, setTotalItems] = useState(0);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredData, setFilteredData] = useState([]);

//     const fetchOrderData = async () => {
//         try {
//             const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/admin/orders');
//             setTableData(response.data);
//             setFilteredData(response.data);
//             setTotalItems(response.data.length);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     // Handle page change
//     const handlePageChange = (page) => {
//         if (page < 1 || page > totalPages) return;
//         setCurrentPage(page);
//     };

//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//     useEffect(() => {
//         fetchOrderData();
//     }, [itemsPerPage]);

//     // Get paginated data
//     const getPaginatedData = () => {
//         const start = (currentPage - 1) * itemsPerPage;
//         const end = start + itemsPerPage;
//         return filteredData.slice(start, end);
//     };

//     const dropdownRef = useRef(null);

//     const handleRowSelection = (id) => {
//         setSelectedRows((prevSelectedRows) =>
//             prevSelectedRows.includes(id)
//                 ? prevSelectedRows.filter((rowId) => rowId !== id)
//                 : [...prevSelectedRows, id]
//         );
//     };
//     useEffect(() => {
//         if (searchQuery) {
//             const filtered = tableData.filter((orders) => {
//                 // Ensure that each field exists before checking for a match
//                 const invoiceName = orders?.name?.toLowerCase() || '';
//                 const date = orders?.date?.toLowerCase() || '';
//                 const invoiceId = orders?.invoice_id?.toLowerCase() || '';
                
//                 // Perform the filter check on all relevant fields
//                 return (
//                     invoiceName.includes(searchQuery.toLowerCase()) ||
//                     date.includes(searchQuery.toLowerCase()) ||
//                     invoiceId.includes(searchQuery.toLowerCase())
//                 );
//             });
//             setFilteredData(filtered);
//             setTotalItems(filtered.length);
//             setCurrentPage(1);
//         } else {
//             setFilteredData(tableData);
//             setTotalItems(tableData.length);
//         }
//     }, [searchQuery, tableData]);
    
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setOpenDropdown(null);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     // Function to convert RGB to HEX
//     const rgbToHex = (rgb) => {
//         const rgbArr = rgb.match(/\d+/g); // Extracts the RGB numbers from the string
//         const r = parseInt(rgbArr[0], 10);
//         const g = parseInt(rgbArr[1], 10);
//         const b = parseInt(rgbArr[2], 10);

//         const hex = `#${(1 << 24) | (r << 16) | (g << 8) | b
//             .toString(16)
//             .slice(1)
//             .toUpperCase()}`;
//         return hex;
//     };

//     return (
//         <div className=" min-h-screen pt-6">
//             <div className="w-full mx-auto">
//                 {/* Search bar */}
//                 <div className="relative flex mt-4 flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
//                     <div className="flex h-full w-full items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white">
//                         <p className="pl-3 pr-2 text-xl">
//                             <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
//                         </p>
//                         <input
//                             type="text"
//                             placeholder="Search by Date ,Invoice Id, User Name..."
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             value={searchQuery}
//                             className="block w-full rounded-full text-base font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
//                         />
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
//                     <table className="w-full table-auto">
//                         <thead>
//                             <tr className="text-gray-600">
//                                 <th className="px-6 py-4 text-left">Date</th>
//                                 <th className="px-6 py-4 text-left">Invoice Id</th>
//                                 <th className="px-6 py-4 text-left">Name</th>
//                                 <th className="px-6 py-4 text-left">Product Details</th>
//                                 <th className="px-6 py-4 text-left">Shipping Status</th>
//                                 <th className="px-6 py-4 text-left">Payment Type</th>
//                                 <th className="px-6 py-4 text-left">Payment Status</th>
//                                 <th className="px-6 py-4 text-left">Invoice</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {getPaginatedData().map((order) => (
//                                 <tr key={order.id} className="border-t">
//                                     <td className="px-6 py-4">{order.date}</td>
//                                     <td className="px-6 py-4">{order.invoice_id}</td>
//                                     <td className="px-6 py-4">{order.name}</td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center">Product: {order.product_details}</div>
//                                         <div className="flex items-center">{order.variant}</div>
//                                         <div className="flex items-center">Quantity: {order.quantity}</div>
//                                         <div className="flex items-center">Price: {order.price}</div>

//                                         {/* Check if RGB values exist and display color */}
//                                         {order.r_value && order.g_value && order.b_value && (
//                                             <div className="flex items-center mt-2">
//                                                 <span className="mr-2">Color: </span>
//                                                 <span
//                                                     style={{
//                                                         backgroundColor: rgbToHex(order.r_value, order.g_value, order.b_value),
//                                                         display: 'inline-block',
//                                                         width: '20px',
//                                                         height: '20px',
//                                                         borderRadius: '50%',
//                                                     }}
//                                                 ></span>
//                                                 <span className="ml-2">{rgbToHex(order.r_value, order.g_value, order.b_value)}</span>
//                                             </div>
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-4">{order.shipping_status}</td>
//                                     <td className="px-6 py-4">{order.payment_type}</td>
//                                     <td className="px-6 py-4">{order.payment_status}</td>
                                    
//                                     <td className="px-6 py-4">
//                                         <a href={order.invoice} target="_blank" rel="noopener noreferrer">
//                                             <FontAwesomeIcon icon={faDownload} />
//                                         </a>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-4">
//                 <div className="flex items-center">
//                     <span className="mr-2">Show</span>
//                     <select
//                         value={itemsPerPage}
//                         onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                         className="border border-gray-300 px-4 py-2 rounded-md"
//                     >
//                         {[5, 10, 20, 50, 100].map((option) => (
//                             <option key={option} value={option}>
//                                 {option}
//                             </option>
//                         ))}
//                     </select>
//                     <span className="ml-2">entries</span>
//                 </div>

//                 <div className="flex space-x-4">
//                     <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className={`${currentPage === 1
//                                 ? 'bg-[#4318ff] text-white opacity-50 cursor-not-allowed'
//                                 : 'bg-[#4318ff] text-white hover:bg-[#3700b3]'
//                             } px-6 py-2 rounded-[20px]`}
//                     >
//                         Back
//                     </button>
//                     <span className="text-gray-600 mt-2">
//                         {` ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
//                     </span>

//                     <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className={`${currentPage === totalPages || totalItems === 0
//                                 ? 'bg-[#4318ff] text-white opacity-50 cursor-not-allowed'
//                                 : 'bg-[#4318ff] text-white hover:bg-[#3700b3]'
//                             } px-6 py-2 rounded-[20px]`}
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

function RestoOrders() {
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const itemsPerPage = 10; // Fixed to 10 per page

    const fetchOrderData = async () => {
        try {
            const response = await axios.get('https://yrpitsolutions.com/ecom_backend/api/admin/orders');
            setTableData(response.data);
            setFilteredData(response.data);
            setTotalItems(response.data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        fetchOrderData();
    }, []);

    const getPaginatedData = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    };

    useEffect(() => {
        if (searchQuery) {
            const filtered = tableData.filter((orders) => {
                const invoiceName = orders?.name?.toLowerCase() || '';
                const date = orders?.date?.toLowerCase() || '';
                const invoiceId = orders?.invoice_id?.toLowerCase() || '';
                return (
                    invoiceName.includes(searchQuery.toLowerCase()) ||
                    date.includes(searchQuery.toLowerCase()) ||
                    invoiceId.includes(searchQuery.toLowerCase())
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

    return (
        <div className="min-h-screen pt-6">
                <Navbar brandText={"Orders"} />
            <div className="w-full mx-auto">
                <div className="relative flex mt-4 flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-3 shadow-xl">
                    <div className="flex h-full w-full items-center rounded-full text-navy-700">
                        <p className="pl-3 pr-2 text-xl">
                            <FiSearch className="h-4 w-4 text-gray-400" />
                        </p>
                        <input
                            type="text"
                            placeholder="Search by Date ,Invoice Id, User Name..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            className="block w-full rounded-full text-base font-medium text-navy-700 outline-none"
                        />
                    </div>
                </div>
                <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-gray-600">
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Invoice Id</th>
                                <th className="px-6 py-4 text-left">Name</th>
                                <th className="px-6 py-4 text-left">Product Details</th>
                                <th className="px-6 py-4 text-left">Shipping Status</th>
                                <th className="px-6 py-4 text-left">Payment Type</th>
                                <th className="px-6 py-4 text-left">Payment Status</th>
                                <th className="px-6 py-4 text-left">Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedData().map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">{order.invoice_id}</td>
                                    <td className="px-6 py-4">{order.name}</td>
                                    <td className="px-6 py-4">{order.product_details}</td>
                                    <td className="px-6 py-4">{order.shipping_status}</td>
                                    <td className="px-6 py-4">{order.payment_type}</td>
                                    <td className="px-6 py-4">{order.payment_status}</td>
                                    <td className="px-6 py-4">
                                        <a href={order.invoice} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={faDownload} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">
                    {` ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
                </span>
                <div className="flex space-x-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-[20px]"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-[#4318ff] text-white px-6 py-2 rounded-[20px]"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RestoOrders;
