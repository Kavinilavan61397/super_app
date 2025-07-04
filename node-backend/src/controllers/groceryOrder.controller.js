const GroceryOrder = require('../models/grocery_order');
const GroceryOrderItem = require('../models/grocery_order_item');
const User = require('../models/User');

// Get user's grocery orders
exports.getUserGroceryOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await GroceryOrder.find({ user_id: userId })
      .populate({
        path: 'items',
        populate: {
          path: 'grocery_id'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching grocery orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery orders',
      error: error.message
    });
  }
};

// Get grocery order by ID
exports.getGroceryOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await GroceryOrder.findOne({ _id: req.params.id, user_id: userId })
      .populate({
        path: 'items',
        populate: {
          path: 'grocery_id'
        }
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Grocery order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching grocery order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery order',
      error: error.message
    });
  }
};

// Create grocery order
exports.createGroceryOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shipping_address, payment_method, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    // Calculate order total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const { grocery_id, quantity, price } = item;
      const itemTotal = price * quantity;
      total += itemTotal;

      // Create order item
      const orderItem = new GroceryOrderItem({
        grocery_id,
        quantity,
        price,
        total_price: itemTotal
      });
      await orderItem.save();
      orderItems.push(orderItem._id);
    }

    // Create order
    const order = new GroceryOrder({
      user_id: userId,
      order_number: `GORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: orderItems,
      total_amount: total,
      shipping_address,
      payment_method: payment_method || 'cod',
      status: 'pending',
      notes
    });

    await order.save();

    // Return created order with populated items
    const createdOrder = await GroceryOrder.findById(order._id)
      .populate({
        path: 'items',
        populate: {
          path: 'grocery_id'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Grocery order created successfully',
      data: createdOrder
    });
  } catch (error) {
    console.error('Error creating grocery order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating grocery order',
      error: error.message
    });
  }
};

// Cancel grocery order
exports.cancelGroceryOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await GroceryOrder.findOne({ _id: req.params.id, user_id: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Grocery order not found'
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
      message: 'Grocery order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling grocery order:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling grocery order',
      error: error.message
    });
  }
};

// Get grocery order status
exports.getGroceryOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await GroceryOrder.findOne({ _id: req.params.id, user_id: userId })
      .select('status order_number total_amount createdAt');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Grocery order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching grocery order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grocery order status',
      error: error.message
    });
  }
};
