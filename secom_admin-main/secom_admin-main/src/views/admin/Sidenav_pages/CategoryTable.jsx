import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaEllipsisV, FaSearch, FaSpinner } from 'react-icons/fa';
import { FiFolder, FiFolderPlus, FiFolderMinus } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { categoryService } from '../../../services/categoryService';
import { authService } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../../config/api.config';

function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active'); // 'all', 'active', 'inactive'
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        navigate("/auth/sign-in");
        return;
      }
      await fetchCategories();
    };
    checkAuth();
  }, [navigate]);

  // Filter categories when search query or status filter changes
  useEffect(() => {
    let filtered = categories;
    if (statusFilter === 'active') filtered = filtered.filter(cat => cat.status === true);
    else if (statusFilter === 'inactive') filtered = filtered.filter(cat => cat.status === false);
    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.parent && category.parent.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    // Sort by createdAt descending
    filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [searchQuery, categories, statusFilter]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAllCategories();
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      
      // Flatten hierarchical data for table display
      const flattenedCategories = flattenCategories(categoriesData);
      setCategories(flattenedCategories);
      setFilteredCategories(flattenedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message || 'Failed to load categories');
      if (error.response?.status === 401) {
        navigate("/auth/sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  // Flatten hierarchical categories for table display
  const flattenCategories = (categories, level = 0, parentName = '') => {
    let flattened = [];
    categories.forEach(category => {
      flattened.push({
        ...category,
        level,
        parentName,
        hasChildren: category.subcategories && category.subcategories.length > 0
      });
      
      if (category.subcategories && category.subcategories.length > 0) {
        flattened = flattened.concat(flattenCategories(category.subcategories, level + 1, category.name));
      }
    });
    return flattened;
  };

  // Group categories by parent_id
  const groupCategories = (categories) => {
    const grouped = {};
    categories.forEach(cat => {
      const parent = cat.parent_id || 'root';
      if (!grouped[parent]) grouped[parent] = [];
      grouped[parent].push(cat);
    });
    return grouped;
  };

  // Sort categories alphabetically by name
  const sortCategoriesByName = (categories) => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  };

  // Sort categories by createdAt (ascending)
  const sortCategoriesByCreatedAt = (categories) => {
    return [...categories].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const groupedCategories = groupCategories(filteredCategories);

  // Get all main categories (parent_id: null), sorted by createdAt
  const mainCategories = groupedCategories['root'] ? sortCategoriesByCreatedAt(groupedCategories['root']) : [];

  // Pagination for main categories only
  const totalPages = Math.ceil(mainCategories.length / itemsPerPage);
  const paginatedMainCategories = mainCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Recursive function to render categories in tree order, sorted by createdAt
  const renderCategoryRows = (categories, level = 0) => {
    if (!categories) return null;
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <input
              type="checkbox"
              checked={selectedRows.includes(category.id)}
              onChange={() => handleRowSelect(category.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div style={{ marginLeft: `${level * 20}px` }} className="flex items-center gap-2">
                {getHierarchyIcon(level, !!groupedCategories[category.id])}
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {category.parent_id ? categoryIdNameMap[category.parent_id] || '-' : '-'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              category.status 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {category.status ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {category.image ? (
              <img
                src={`${API_CONFIG.BASE_URL}${category.image}`}
                alt={category.name}
                className="h-10 w-10 rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">No img</span>
              </div>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                className="text-blue-600 hover:text-blue-900"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-900 disabled:opacity-50"
              >
                {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
              </button>
            </div>
          </td>
        </tr>
        {/* Render children recursively, sorted by createdAt */}
        {groupedCategories[category.id] && renderCategoryRows(sortCategoriesByCreatedAt(groupedCategories[category.id]), level + 1)}
      </React.Fragment>
    ));
  };

  // Get hierarchy icon based on level and children
  const getHierarchyIcon = (level, hasChildren) => {
    if (level === 0) {
      return hasChildren ? <FiFolderPlus className="text-blue-500" /> : <FiFolder className="text-blue-500" />;
    } else if (level === 1) {
      return hasChildren ? <FiFolderPlus className="text-green-500" /> : <FiFolder className="text-green-500" />;
    } else {
      return hasChildren ? <FiFolderPlus className="text-purple-500" /> : <FiFolder className="text-purple-500" />;
    }
  };

  // Handle row selection
  const handleRowSelect = (categoryId) => {
    setSelectedRows(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedRows.length === getPaginatedData().length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(getPaginatedData().map(item => item.id));
    }
  };

  // Handle category deletion
  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(categoryId);
      toast.success('Category deleted successfully!');
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning('Please select categories to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} categories?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete categories one by one (backend doesn't have bulk delete endpoint)
      for (const categoryId of selectedRows) {
        await categoryService.deleteCategory(categoryId);
      }
      toast.success(`${selectedRows.length} categories deleted successfully!`);
      setSelectedRows([]);
      await fetchCategories();
    } catch (error) {
      console.error('Error bulk deleting categories:', error);
      toast.error('Failed to delete some categories');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  };

  // After fetching categories and before renderCategoryRows:
  const categoryIdNameMap = {};
  filteredCategories.forEach(cat => {
    categoryIdNameMap[cat.id] = cat.name;
  });

  // Calculate the range for main categories
  const startMain = (currentPage - 1) * itemsPerPage + 1;
  const endMain = Math.min(currentPage * itemsPerPage, mainCategories.length);
  const totalMain = mainCategories.length;


  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchCategories}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6">
      {/* Header and Search Section */}
      <div className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-600">Manage your product categories and subcategories</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigate('/admin/categories/new')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaPlus /> Add Category
            </button>
            
            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                Delete Selected ({selectedRows.length})
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex gap-2 items-center w-full max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaTrashAlt className="text-sm" />
                Delete Selected ({selectedRows.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow overflow-hidden rounded-lg bg-white shadow-md">
        <div className="h-full overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === getPaginatedData().length && getPaginatedData().length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderCategoryRows(paginatedMainCategories)}
            </tbody>
          </table>

          {getPaginatedData().length === 0 && (
            <div className="text-center py-12">
              <FiFolder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating a new category.'}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/admin/categories/new')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Category
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex-shrink-0">
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startMain}</span>
                  {' '}to{' '}
                  <span className="font-medium">{endMain}</span>
                  {' '}of{' '}
                  <span className="font-medium">{totalMain}</span>
                  {' '}main categories
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default CategoryTable; 