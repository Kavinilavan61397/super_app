const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const User = require('../models/User');

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user_id: userId })
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id', model: 'Product' },
          { path: 'variation_id', model: 'ProductVariation' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, user_id: userId })
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id', model: 'Product' },
          { path: 'variation_id', model: 'ProductVariation' }
        ]
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shipping_address, payment_method, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user_id: userId })
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id', model: 'Product' },
          { path: 'variation_id', model: 'ProductVariation' }
        ]
      });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate order total
    let total = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product_id;
      const itemTotal = product.price * cartItem.quantity;
      total += itemTotal;

      // Create order item
      const orderItem = new OrderItem({
        product_id: product._id,
        variation_id: cartItem.variation_id || null,
        quantity: cartItem.quantity,
        price: product.price,
        total_price: itemTotal
      });
      await orderItem.save();
      orderItems.push(orderItem._id);
    }

    // Create order
    const order = new Order({
      user_id: userId,
      order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: orderItems,
      total_amount: total,
      shipping_address,
      payment_method: payment_method || 'cod',
      status: 'pending',
      notes
    });

    await order.save();

    // Clear cart
    await CartItem.deleteMany({ cart_id: cart._id });
    cart.items = [];
    await cart.save();

    // Return created order with populated items
    const createdOrder = await Order.findById(order._id)
      .populate({
        path: 'items',
        populate: [
          { path: 'product_id', model: 'Product' },
          { path: 'variation_id', model: 'ProductVariation' }
        ]
      });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, user_id: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has been shipped or delivered'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// Get order status
exports.getOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, user_id: userId })
      .select('status order_number total_amount createdAt');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order status',
      error: error.message
    });
  }
}; 