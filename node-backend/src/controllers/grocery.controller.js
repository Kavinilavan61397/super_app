const Grocery = require('../models/Grocery');
const path = require('path');
const fs = require('fs').promises;
const { processImage } = require('../utils/imageProcessor');

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
      const processedImage = await processImage(req.file, { dir: 'groceries' });
      const relativePath = path.relative(path.join(__dirname, '../../uploads'), processedImage.path);
      imagePath = `/uploads/${relativePath.replace(/\\/g, '/')}`;
    }
    const grocery = await Grocery.create({
      name,
      description,
      original_price,
      discounted_price,
      rating,
      is_best_seller: is_best_seller === 'true' || is_best_seller === true,
      quantity,
      category,
      status: status === 'true' || status === true,
      image: imagePath
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
    if (!grocery) {
      return res.status(404).json({ success: false, message: 'Grocery not found' });
    }

    const { status, ...otherData } = req.body;
    let imagePath = grocery.image;

    // Case 1: A new image file is uploaded
    if (req.file) {
      // Delete the old image if it exists
      if (grocery.image) {
        const oldImagePath = path.join(__dirname, '../../', grocery.image);
        try {
          if (require('fs').existsSync(oldImagePath)) {
            await fs.unlink(oldImagePath);
          }
        } catch (e) {
          console.error("Error deleting old image:", e);
        }
      }
      // Process and set path for the new image
      const processedImage = await processImage(req.file, { dir: 'groceries' });
      const relativePath = path.relative(path.join(__dirname, '../../uploads'), processedImage.path);
      imagePath = `/uploads/${relativePath.replace(/\\/g, '/')}`;
    }
    // Case 2: No new file is uploaded, so we keep the existing image path.
    // The value of imagePath remains grocery.image.

    const updatedData = {
      ...otherData,
      image: imagePath,
    };

    // Handle numeric fields that might be empty strings
    ['original_price', 'discounted_price', 'rating', 'quantity'].forEach(field => {
      if (updatedData[field] === '' || updatedData[field] === null || updatedData[field] === 'null') {
        updatedData[field] = null;
      }
    });

    if (status !== undefined) {
      updatedData.status = status === 'true' || status === true;
    }

    // Handle is_best_seller boolean
    updatedData.is_best_seller = otherData.is_best_seller === 'true' || otherData.is_best_seller === true;

    await grocery.update(updatedData);
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