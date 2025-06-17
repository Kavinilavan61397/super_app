const { Category } = require('../models');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const slugify = require('slugify');
const fs = require('fs');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: [
            {
              model: Category,
              as: 'subcategories'
            }
          ]
        }
      ],
      where: {
        parent_id: null
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: [
            {
              model: Category,
              as: 'subcategories'
            }
          ]
        }
      ]
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
    const { name, description, parent_id, status } = req.body;
    let image = null;

    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      });
      image = path.join('uploads', 'categories', processedImage.filename);
    }

    const category = await Category.create({
      name,
      description,
      slug: slugify(name, { lower: true }),
      image,
      status: typeof status === 'undefined' ? true : status === 'true' || status === true,
      parent_id: parent_id || null
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Category creation error:', error);
    if (error && typeof error === 'object') {
      Object.getOwnPropertyNames(error).forEach(key => {
        console.error(`${key}:`, error[key]);
      });
    }
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    return res.status(500).json({
      message: error.message,
      stack: error.stack,
      fullError: error
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, parent_id, status } = req.body;
    let image = category.image;

    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      });
      image = path.join('uploads', 'categories', processedImage.filename);
    }

    await category.update({
      name,
      description,
      slug: slugify(name, { lower: true }),
      image,
      status: status || category.status,
      parent_id: parent_id || category.parent_id
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'subcategories'
        }
      ]
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.'
      });
    }

    // Check if category has associated products
    const hasProducts = await category.hasProducts(); // Assuming there's a products association
    if (hasProducts) {
      return res.status(400).json({
        message: 'Cannot delete category with associated products. Please delete or reassign products first.'
      });
    }

    // Delete category image if exists
    if (category.image) {
      const imagePath = path.join(__dirname, '..', '..', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Cannot delete category because it has associated items (products or subcategories). Please remove these associations first.'
      });
    }
    res.status(500).json({ 
      message: 'Failed to delete category. ' + error.message,
      error: error.name
    });
  }
};

// Toggle category status
exports.toggleStatus = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.status = category.status === 'active' ? 'inactive' : 'active';
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 