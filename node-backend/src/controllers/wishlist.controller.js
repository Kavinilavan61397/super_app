const { Wishlist, Product, ProductVariation, Category, Brand } = require('../models');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: Category,
              as: 'category'
            },
            {
              model: Brand,
              as: 'brand'
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      where: {
        user_id: req.user.id,
        product_id
      }
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item already exists in wishlist'
      });
    }

    // Create new wishlist item
    const wishlistItem = await Wishlist.create({
      user_id: req.user.id,
      product_id,
      quantity: quantity || 1
    });

    // Fetch the created item with product details
    const createdItem = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: Category,
              as: 'category'
            },
            {
              model: Brand,
              as: 'brand'
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Item added to wishlist successfully',
      data: createdItem
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: {
        id: itemId,
        user_id: req.user.id
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }

    await wishlistItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.destroy({
      where: { user_id: req.user.id }
    });

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 