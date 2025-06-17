const express = require('express');
const router = express.Router();
const { Product } = require('../models');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        category: {
          [Op.like]: '%Men Uniforms%'
        }
      }
    });
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

module.exports = router;
