const { Order, OrderItem, Cart, CartItem, Product, ProductVariation, User } = require('../models');
const { sequelize } = require('../models');

// Create order from cart
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { shipping_address, billing_address, payment_method, notes } = req.body;
    
    // Validate required fields
    if (!shipping_address || !billing_address || !payment_method) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Shipping address, billing address, and payment method are required'
      });
    }

    // Get active cart with items
    const cart = await Cart.findOne({
      where: { user_id: req.user.id, status: 'active' },
      include: [{
        model: CartItem,
        as: 'items',
        include: [
          { model: Product, as: 'product' },
          { model: ProductVariation, as: 'variation' }
        ]
      }],
      transaction
    });

    if (!cart || !cart.items.length) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'No active cart found or cart is empty'
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.total_price, 0);
    const tax_amount = subtotal * 0.1; // 10% tax - can be made configurable
    const shipping_amount = 0; // Free shipping or calculate based on address
    const discount_amount = 0; // Apply any discounts
    const total_amount = subtotal + tax_amount + shipping_amount - discount_amount;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      order_number: orderNumber,
      total_amount,
      subtotal,
      tax_amount,
      shipping_amount,
      discount_amount,
      shipping_address,
      billing_address,
      payment_method,
      notes
    }, { transaction });

    // Create order items with product snapshots
    const orderItems = await Promise.all(cart.items.map(item => {
      const productSnapshot = {
        name: item.product.name,
        sku: item.product.sku,
        price: item.price,
        image: item.product.featured_image,
        category: item.product.category?.name,
        variation: item.variation ? {
          sku: item.variation.sku,
          attributes: item.variation.attributes
        } : null
      };

      // Use product's original and discounted price if available, else fallback to item.price
      const originalPrice = item.product.original_price || item.price;
      const discountedPrice = item.product.discounted_price || item.price;

      return OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total_price,
        product_snapshot: productSnapshot,
        original_price: originalPrice,
        discounted_price: discountedPrice
      }, { transaction });
    }));

    // Update cart status to completed
    await cart.update({ status: 'completed' }, { transaction });

    await transaction.commit();

    // Return complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Order creation error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get user orders with pagination and filtering
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = { user_id: req.user.id };
    if (status) whereClause.status = status;

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: orders.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(orders.count / limit),
        total_items: orders.count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get single order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: OrderItem,
        as: 'items'
      }]
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
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow cancellation for pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled in current status'
      });
    }

    await order.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Get order by order number
exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        order_number: req.params.orderNumber,
        user_id: req.user.id
      },
      include: [{
        model: OrderItem,
        as: 'items'
      }]
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
    console.error('Get order by number error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
}; 