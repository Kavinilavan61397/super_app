const Category = require('../models/Category');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const slugify = require('slugify');
const fs = require('fs');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    // Return only subcategories (categories with a parent_id)
    const subcategories = await Category.find({ parent_id: { $ne: null } })
      .populate('parentCategory');
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate({
        path: 'subcategories',
        populate: {
          path: 'subcategories'
        }
      });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent_id, status, meta_title, meta_description } = req.body;
    let imagePath = null;

    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'categories');
      // Use the web-accessible URL path
      imagePath = `/uploads/categories/${processedImage.filename}`;
    }

    const category = new Category({
      name,
      description,
      slug: slugify(name, { lower: true }),
      image: imagePath,
      status: typeof status !== 'undefined' ? (String(status) === 'true') : true,
      parent_id: parent_id || null,
      meta_title,
      meta_description
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Category creation error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    return res.status(500).json({
      message: 'An unexpected error occurred while creating the category.',
      error: error.message
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, parent_id, status, meta_title, meta_description } = req.body;
    let imagePath = category.image;

    if (req.file) {
      // Delete old image if it exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, '..', '..', 'uploads', category.image.replace('/uploads/', ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'categories');
      // Use the web-accessible URL path
      imagePath = `/uploads/categories/${processedImage.filename}`;
    }

    // Explicitly handle boolean conversion for status
    const newStatus = typeof status !== 'undefined' ? (String(status) === 'true') : category.status;

    category.name = name || category.name;
    category.description = description || category.description;
    category.slug = name ? slugify(name, { lower: true }) : category.slug;
    category.image = imagePath;
    category.status = newStatus;
    category.parent_id = parent_id || category.parent_id;
    category.meta_title = meta_title || category.meta_title;
    category.meta_description = meta_description || category.meta_description;

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Category update error:', error);
    res.status(500).json({ 
        message: 'An unexpected error occurred while updating the category.',
        error: error.message 
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    console.log('Attempting to delete category:', req.params.id);
    
    const category = await Category.findById(req.params.id)
      .populate('subcategories');
    
    if (!category) {
      console.log('Category not found:', req.params.id);
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      console.log('Category has subcategories:', category.subcategories.length);
      return res.status(400).json({
        message: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.'
      });
    }

    // Check if category has associated products
    const productCount = await Product.countDocuments({ category_id: req.params.id });

    console.log('Products count:', productCount);

    if (productCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with associated products. Please delete or reassign products first.'
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Category deletion error:', error);
    res.status(500).json({ 
        message: 'An unexpected error occurred while deleting the category.',
        error: error.message 
    });
  }
};

// Get categories by parent ID
exports.getCategoriesByParent = async (req, res) => {
  try {
    const { parent_id } = req.params;
    const categories = await Category.find({ parent_id })
      .populate('subcategories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search categories
exports.searchCategories = async (req, res) => {
  try {
    const { q } = req.query;
    const categories = await Category.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active categories only
exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: true })
      .populate({
        path: 'subcategories',
        match: { status: true },
        populate: {
          path: 'subcategories',
          match: { status: true }
        }
      });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 