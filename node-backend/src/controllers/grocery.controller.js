const Grocery = require('../models/Grocery');
const path = require('path');
const fs = require('fs').promises;

// Get all groceries
exports.getAllGroceries = async (req, res) => {
  try {
    const groceries = await Grocery.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: groceries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching groceries', error: error.message });
  }
};

// Get grocery by ID
exports.getGroceryById = async (req, res) => {
  try {
    const grocery = await Grocery.findByPk(req.params.id);
    if (!grocery) return res.status(404).json({ success: false, message: 'Grocery not found' });
    res.json({ success: true, data: grocery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching grocery', error: error.message });
  }
};

// Create grocery (with image upload)
exports.createGrocery = async (req, res) => {
  try {
    const { name, description, original_price, discounted_price, rating, is_best_seller, quantity, category, status } = req.body;
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/groceries/${req.file.filename}`;
    }
    const grocery = await Grocery.create({
      name, description, original_price, discounted_price, rating, is_best_seller, quantity, category, status, image: imagePath
    });
    res.status(201).json({ success: true, message: 'Grocery created successfully', data: grocery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating grocery', error: error.message });
  }
};

// Update grocery (with image upload and old image cleanup)
exports.updateGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findByPk(req.params.id);
    if (!grocery) return res.status(404).json({ success: false, message: 'Grocery not found' });
    let imagePath = grocery.image;
    if (req.file) {
      // Delete old image if exists
      if (grocery.image) {
        const oldImagePath = path.join(__dirname, '../../', grocery.image);
        try { await fs.unlink(oldImagePath); } catch (e) {}
      }
      imagePath = `/uploads/groceries/${req.file.filename}`;
    }
    await grocery.update({ ...req.body, image: imagePath });
    res.json({ success: true, message: 'Grocery updated successfully', data: grocery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating grocery', error: error.message });
  }
};

// Delete grocery (with image deletion)
exports.deleteGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findByPk(req.params.id);
    if (!grocery) return res.status(404).json({ success: false, message: 'Grocery not found' });
    if (grocery.image) {
      const imagePath = path.join(__dirname, '../../', grocery.image);
      try { await fs.unlink(imagePath); } catch (e) {}
    }
    await grocery.destroy();
    res.json({ success: true, message: 'Grocery deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting grocery', error: error.message });
  }
}; 