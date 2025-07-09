// Porter Admin Controller
const Porter = require('../models/Porter');
const PorterOrder = require('../models/PorterOrder');

module.exports = {
  // List all porters
  listAllPorters: async (req, res) => {
    try {
      const porters = await Porter.find().populate('user');
      res.status(200).json({ porters });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching porters', error: error.message });
    }
  },
  // Update porter status (activate/suspend)
  updatePorterStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['active', 'pending', 'suspended'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      const porter = await Porter.findByIdAndUpdate(id, { status }, { new: true }).populate('user');
      if (!porter) {
        return res.status(404).json({ message: 'Porter not found' });
      }
      res.status(200).json({ message: 'Porter status updated', porter });
    } catch (error) {
      res.status(500).json({ message: 'Error updating porter status', error: error.message });
    }
  },
  // List all porter orders
  listAllOrders: async (req, res) => {
    try {
      const orders = await PorterOrder.find()
        .sort({ createdAt: -1 })
        .populate({ path: 'porter', populate: { path: 'user' } })
        .populate('customer');
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
  },
  // Get order details by ID
  getOrderDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await PorterOrder.findById(id)
        .populate({ path: 'porter', populate: { path: 'user' } })
        .populate('customer');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order details', error: error.message });
    }
  }
}; 