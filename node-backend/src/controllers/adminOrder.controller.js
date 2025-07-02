const { Order, OrderItem, User, Product, ProductVariation } = require('../models');
const { Op } = require('sequelize');

// Get all orders with advanced filtering (admin)
exports.getAllOrders = async (req, res) => {
  console.log('ADMIN GET ALL ORDERS HIT', req.user);
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search, 
      date_from, 
      date_to,
      payment_status,
      payment_method,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = {};
    if (status) whereClause.status = status;
    if (payment_status) whereClause.payment_status = payment_status;
    if (payment_method) whereClause.payment_method = payment_method;
    
    // Date range filter
    if (date_from || date_to) {
      whereClause.created_at = {};
      if (date_from) whereClause.created_at[Op.gte] = new Date(date_from);
      if (date_to) whereClause.created_at[Op.lte] = new Date(date_to + ' 23:59:59');
    }

    // Search filter
    let userWhereClause = {};
    if (search) {
      userWhereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const includeClause = [{
      model: OrderItem,
      as: 'items'
    }, {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email', 'phone'],
      where: userWhereClause
    }];

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [[sort_by, sort_order]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });
    if (orders.rows.length > 0) {
      console.log('First order date fields:', orders.rows[0].created_at, orders.rows[0].createdAt, orders.rows[0].updated_at, orders.rows[0].updatedAt);
    }

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
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get single order by ID (admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
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
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, tracking_number, notes } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate status transition
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await order.update({
      status: status || order.status,
      tracking_number: tracking_number || order.tracking_number,
      notes: notes || order.notes
    });

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

// Get order statistics (admin dashboard)
exports.getOrderStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Total orders
    const totalOrders = await Order.count({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      }
    });

    // Orders by status
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      group: ['status']
    });

    // Total revenue
    const totalRevenue = await Order.sum('total_amount', {
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        status: {
          [Op.in]: ['confirmed', 'processing', 'shipped', 'delivered']
        }
      }
    });

    // Average order value
    const avgOrderValue = await Order.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('total_amount')), 'average']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      }
    });

    // Recent orders
    const recentOrders = await Order.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        total_orders: totalOrders,
        total_revenue: totalRevenue || 0,
        average_order_value: parseFloat(avgOrderValue?.dataValues?.average || 0).toFixed(2),
        orders_by_status: ordersByStatus,
        recent_orders: recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};

// Bulk update order statuses (admin)
exports.bulkUpdateOrders = async (req, res) => {
  try {
    const { order_ids, status, tracking_number, notes } = req.body;
    
    if (!order_ids || !Array.isArray(order_ids) || order_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs array is required'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (tracking_number) updateData.tracking_number = tracking_number;
    if (notes) updateData.notes = notes;

    const result = await Order.update(updateData, {
      where: {
        id: {
          [Op.in]: order_ids
        }
      }
    });

    res.json({
      success: true,
      message: `Updated ${result[0]} orders successfully`,
      updated_count: result[0]
    });
  } catch (error) {
    console.error('Bulk update orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update orders',
      error: error.message
    });
  }
};

// Export orders (admin)
exports.exportOrders = async (req, res) => {
  try {
    const { status, date_from, date_to, format = 'json' } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (date_from || date_to) {
      whereClause.created_at = {};
      if (date_from) whereClause.created_at[Op.gte] = new Date(date_from);
      if (date_to) whereClause.created_at[Op.lte] = new Date(date_to + ' 23:59:59');
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [{
        model: OrderItem,
        as: 'items'
      }, {
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'phone']
      }],
      order: [['created_at', 'DESC']]
    });

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = orders.map(order => ({
        'Order Number': order.order_number,
        'Customer': order.user?.name,
        'Email': order.user?.email,
        'Status': order.status,
        'Total Amount': order.total_amount,
        'Payment Method': order.payment_method,
        'Payment Status': order.payment_status,
        'Created Date': order.created_at,
        'Items Count': order.items?.length || 0
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
      
      // Simple CSV conversion
      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: orders,
        total: orders.length
      });
    }
  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export orders',
      error: error.message
    });
  }
}; 