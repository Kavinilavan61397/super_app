const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');

// Get user's cart
exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user_id: userId })
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id', model: 'Product' },
          { path: 'variation_id', model: 'ProductVariation' }
        ]
      });

    if (!cart) {
      cart = new Cart({ user_id: userId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, variation_id, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Validate variation if provided
    if (variation_id) {
      const variation = await ProductVariation.findById(variation_id);
      if (!variation) {
        return res.status(404).json({
          success: false,
          message: 'Product variation not found'
        });
      }
    }

    // Find or create cart
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = new Cart({ user_id: userId, items: [] });
      await cart.save();
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      cart_id: cart._id,
      product_id,
      variation_id: variation_id || null
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity || 1;
      await existingItem.save();
    } else {
      // Create new cart item
      const cartItem = new CartItem({
        cart_id: cart._id,
        product_id,
        variation_id: variation_id || null,
        quantity: quantity || 1,
        price: product.price
      });
      await cartItem.save();
      cart.items.push(cartItem._id);
      await cart.save();
    }

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id', model: 'Product' },
          { path: 'variation_id', model: 'ProductVariation' }
        ]
      });

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_id } = req.params;
    const { quantity } = req.body;

    // Find cart item and verify ownership
    const cartItem = await CartItem.findById(item_id)
      .populate({
        path: 'cart_id',
        match: { user_id: userId }
      });

    if (!cartItem || !cartItem.cart_id) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await CartItem.findByIdAndDelete(item_id);
      
      // Remove from cart items array
      const cart = await Cart.findById(cartItem.cart_id._id);
      cart.items = cart.items.filter(item => item.toString() !== item_id);
      await cart.save();
    } else {
      // Update quantity
      cartItem.quantity = quantity;
      await cartItem.save();
    }

    // Return updated cart
    const updatedCart = await Cart.findById(cartItem.cart_id._id)
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id', model: 'Product' },
          { path: 'variation_id', model: 'ProductVariation' }
        ]
      });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_id } = req.params;

    // Find cart item and verify ownership
    const cartItem = await CartItem.findById(item_id)
      .populate({
        path: 'cart_id',
        match: { user_id: userId }
      });

    if (!cartItem || !cartItem.cart_id) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Remove item
    await CartItem.findByIdAndDelete(item_id);
    
    // Remove from cart items array
    const cart = await Cart.findById(cartItem.cart_id._id);
    cart.items = cart.items.filter(item => item.toString() !== item_id);
    await cart.save();

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id', model: 'Product' },
          { path: 'variation_id', model: 'ProductVariation' }
        ]
      });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove all cart items
    await CartItem.deleteMany({ cart_id: cart._id });
    
    // Clear cart items array
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
}; 