import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEllipsisV, FaEdit, FaTrashAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { SketchPicker } from 'react-color';

const Color = () => {
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newColor, setNewColor] = useState({ r: 255, g: 255, b: 255 });
    const [editColor, setEditColor] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [colorToDelete, setColorToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const totalItemsToShow = totalItems > 0 ? totalItems : 0;
 


  


    const rgbToHex = (r, g, b) => {
        const toHex = (value) => {
            const hex = Math.max(0, Math.min(255, value)).toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        };
        return `#${toHex(parseInt(r))}${toHex(parseInt(g))}${toHex(parseInt(b))}`;
    };

    const fetchColorData = async () => {
        try {
            const response = await axios.get(
                'https://yrpitsolutions.com/ecom_backend/api/admin/get_all_colours'
            );
            const colorsWithHex = response.data.data.map((color) => ({
                ...color,
                hexCode: rgbToHex(color.r, color.g, color.b),
            }));
            setTableData(colorsWithHex);
      
            setTotalItems(response.data.total); // Set the total number of items from the API response
        } catch (error) {
            console.error('Error fetching data:', error);
            setTableData([]); // Empty array if there's an error
        }
    };

    useEffect(() => {
        fetchColorData(); // Only call fetchColorData once when the component is mounted
    }, []);  // E

    const handleRowSelection = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleEditRow = (color) => {
        setEditColor(color);
        setNewColor({ r: color.r, g: color.g, b: color.b });
        setShowModal(true);
    };

    const handleDeleteRow = (id) => {
        setColorToDelete(id); // Store the id to delete
        setOpenDeleteDialog(true); // Open the delete confirmation dialog
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false); // Close the delete confirmation dialog
        setColorToDelete(null); // Reset color to delete
    };

    const handleDeleteConfirmation = async () => {
        if (!colorToDelete) return; // Prevent deletion if no color selected

        setIsDeleting(true); // Set deleting state to true

        try {
            const token = localStorage.getItem('OnlineShop-accessToken'); // Get the access token
            const response = await axios.delete(
                `https://yrpitsolutions.com/ecom_backend/api/admin/delete_colour_by_id/${colorToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token to request
                    },
                }
            );
            fetchColorData();
            if (response.data.success) {

                setTableData((prevData) => prevData.filter((color) => color.id !== colorToDelete));
            } else {
                console.error('Error deleting color:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting color:', error);
        } finally {
            setIsDeleting(false);
            setOpenDeleteDialog(false);
            setColorToDelete(null);
        }
    };

    const handleAddColor = async () => {
        const newColorHex = rgbToHex(newColor.r, newColor.g, newColor.b);
        const newColorData = {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
            hexCode: newColorHex,
        };

        try {
            const token = localStorage.getItem('OnlineShop-accessToken');
            const response = await axios.post(
                'https://yrpitsolutions.com/ecom_backend/api/admin/save_colour',
                newColorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTableData((prevData) => [
                ...prevData,
                { ...newColorData, id: response.data.data.id },
            ]);
            setShowModal(false);
            fetchColorData();
        } catch (error) {
            console.error('Error adding color:', error);
        }
    };

    const handleUpdateColor = async () => {
        const updatedColorHex = rgbToHex(newColor.r, newColor.g, newColor.b);
        const updatedColorData = {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
            hexCode: updatedColorHex,
        };

        try {
            const token = localStorage.getItem('OnlineShop-accessToken');
            const response = await axios.put(
                `https://yrpitsolutions.com/ecom_backend/api/admin/update_colour_by_id/${editColor.id}`,
                updatedColorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setShowModal(false);
            fetchColorData();
            if (response.data.success) {
                setTableData((prevData) =>
                    prevData.map((color) =>
                        color.id === editColor.id ? { ...color, ...updatedColorData } : color
                    )
                );
            } else {
                console.error('Error updating color:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating color:', error);
        }
    };

  

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return; // Prevent invalid page numbers
        setCurrentPage(page);
      };
      

      const totalPages = Math.ceil(totalItems / itemsPerPage);

      const startItem = (currentPage - 1) * itemsPerPage + 1;
      const endItem = Math.min(currentPage * itemsPerPage, totalItems);
      
      // Function to get paginated data
      const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return tableData.slice(startIndex, endIndex);
      };
      

    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) return; // If no rows are selected, exit early

        setIsDeleting(true); // Disable buttons during the deletion process

        try {
            const token = localStorage.getItem('OnlineShop-accessToken');

            // Loop through selected rows and delete them individually
            for (let colorToDelete of selectedRows) {
                const response = await axios.delete(
                    `https://yrpitsolutions.com/ecom_backend/api/admin/delete_colour_by_id/${colorToDelete}`, // Correctly using template literal
                    {}, // No need to send `ids` for each individual deletion, just the ID in the URL
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {
                    // Remove the deleted row from the table data
                    setTableData((prevData) =>
                        prevData.filter((color) => color.id !== colorToDelete)
                    );
                } else {
                    console.error('Error deleting color with ID:', colorToDelete, response.data.message);
                }
            }

            // Clear selected rows after deletion
            setSelectedRows([]);
        } catch (error) {
            console.error('Error deleting colors:', error);
        } finally {
            setIsDeleting(false); // Enable buttons again after deletion process ends
        }
    };




    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => {
                        setShowModal(true);
                        setEditColor(null);
                        setNewColor({ r: 255, g: 255, b: 255 });
                    }}
                    className="bg-[#4318ff] text-white px-6 py-2 rounded-md text-lg font-medium flex items-center mt-5"
                >
                    <FaPlus className="mr-2" /> Add Color
                </button>
            </div>

            {/* Modal for Adding Color */}
            {showModal && !editColor && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-2xl p-12  w-[35%]  max-h-[80%] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-center">Pick a Color</h3>
                        <div className="flex justify-center mb-4">
                            <SketchPicker
                                color={newColor}
                                onChangeComplete={(color) => setNewColor(color.rgb)}
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddColor}
                                className="bg-[#4318ff] text-white px-4 py-2 rounded-md text-lg font-medium"
                            >
                                Add Color
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Editing Color */}
            {showModal && editColor && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-2xl p-12  w-[35%]  max-h-[80%] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4 text-center">Edit Color</h3>
                        <div className="flex justify-center mb-4">
                            <SketchPicker
                                color={newColor}
                                onChangeComplete={(color) => setNewColor(color.rgb)}
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateColor}
                                className="bg-[#4318ff] text-white px-4 py-2 rounded-md text-lg font-medium"
                            >
                                Update Color
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* table */}
            <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-gray-600">
                            <th className="px-6 py-4 text-left">
                                <div className="flex justify-between items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === getPaginatedData().length}
                                        onChange={() =>
                                            selectedRows.length === getPaginatedData().length
                                                ? setSelectedRows([])
                                                : setSelectedRows(getPaginatedData().map((row) => row.id))
                                        }
                                    />
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left">Color (RGB)</th>
                            <th className="px-6 py-4 text-left">Hex Code</th>
                            <th className="px-6 py-4 text-left" />
                            <th>
                                {selectedRows.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className={`text-gray-600 hover:text-red-600 text-xl flex items-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
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
                            // If no data, show "No Data Found" message
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    <div className="text-lg font-semibold">No Color Data Found</div>
                                </td>
                            </tr>
                        ) : (
                            getPaginatedData().map((color) => (
                                <tr key={color.id} className="border-t">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(color.id)}
                                            onChange={() => handleRowSelection(color.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">{`RGB(${color.r}, ${color.g}, ${color.b})`}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-6 h-6 rounded-full"
                                                style={{ backgroundColor: color.hexCode }}
                                            />
                                            <span>{color.hexCode}</span>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() =>
                                                    setOpenDropdown(openDropdown === color.id ? null : color.id)
                                                }
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            {openDropdown === color.id && (
                                                <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-40 z-10">
                                                    <div
                                                        onClick={() => {
                                                            handleEditRow(color);
                                                            setOpenDropdown(null);
                                                        }}
                                                        className="flex items-center px-4 py-2 text-navy-700 hover:bg-gray-200 cursor-pointer"
                                                    >
                                                        <FaEdit className="mr-2 text-black" />
                                                        Edit
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            setColorToDelete(color.id);
                                                            setOpenDeleteDialog(true);
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
                        )}
                    </tbody>
                </table>
            </div>


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

                <div className="flex space-x-4 items-center">
                    <span className="text-gray-600">
                        {`Showing ${startItem} to ${endItem} of ${totalItemsToShow} items`}
                    </span>

                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1} // Disable if on the first page
                        className={`px-6 py-2 rounded-md ${currentPage === 1
                                ? 'bg-[#4318ff] text-white opacity-50 cursor-not-allowed'
                                : 'bg-[#4318ff] text-white hover:bg-[#3700b3]'
                            }`}
                    >
                        Previous
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || getPaginatedData().length === 0} // Disable if no data on the next page
                        className={`px-6 py-2 rounded-md ${currentPage >= totalPages || getPaginatedData().length === 0
                                ? 'bg-[#4318ff] text-white opacity-50 cursor-not-allowed'
                                : 'bg-[#4318ff] text-white hover:bg-[#3700b3]'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>


            {/* Modal for Deleting Color */}
            {openDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-20 bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this color?</h2>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 mr-4 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirmation} // Trigger the delete API call
                                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center justify-center"
                                disabled={isDeleting} // Disable if deleting is in progress
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
};

export default Color;
