const Brand = require('../models/Brand');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs').promises;

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message
    });
  }
};

// Get brand by ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    res.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brand',
      error: error.message
    });
  }
};

// Create brand
exports.createBrand = async (req, res) => {
  try {
    const { brand_name } = req.body;
    let processedImagePath = null;

    // Process image if uploaded
    if (req.file) {
      processedImagePath = await processImage(req.file, 'brands');
    }

    const brand = await Brand.create({
      brand_name,
      photo: processedImagePath
    });

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating brand',
      error: error.message
    });
  }
};

// Update brand
exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    const { brand_name } = req.body;
    let processedImagePath = brand.photo;

    // Process new image if uploaded
    if (req.file) {
      // Delete old image if exists
      if (brand.photo) {
        const oldImagePath = path.join(__dirname, '../../uploads/brands', path.basename(brand.photo));
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      processedImagePath = await processImage(req.file, 'brands');
    }

    await brand.update({
      brand_name: brand_name || brand.brand_name,
      photo: processedImagePath
    });

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating brand',
      error: error.message
    });
  }
};

// Delete brand
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Delete brand image if exists
    if (brand.photo) {
      const imagePath = path.join(__dirname, '../../uploads/brands', path.basename(brand.photo));
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting brand image:', error);
      }
    }

    await brand.destroy();

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting brand',
      error: error.message
    });
  }
};

// Bulk delete brands
exports.bulkDeleteBrands = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of brand IDs'
      });
    }

    // Find all brands to get their image paths
    const brands = await Brand.findAll({
      where: {
        id: ids
      }
    });

    // Delete brand images
    for (const brand of brands) {
      if (brand.photo) {
        const imagePath = path.join(__dirname, '../../uploads/brands', path.basename(brand.photo));
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.error(`Error deleting image for brand ${brand.id}:`, error);
        }
      }
    }

    // Delete brands from database
    await Brand.destroy({
      where: {
        id: ids
      }
    });

    res.json({
      success: true,
      message: 'Brands deleted successfully'
    });
  } catch (error) {
    console.error('Error bulk deleting brands:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting brands',
      error: error.message
    });
  }
}; 