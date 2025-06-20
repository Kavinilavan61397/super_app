const { GroceryOrder, GroceryOrderItem } = require('../models');

module.exports = {
  // Create Order
  async create(req, res) {
    try {
      const { user_id, total_amount, shipping_address, items } = req.body;

      const order = await GroceryOrder.create({
        user_id,
        total_amount,
        shipping_address
      });

      const orderItems = items.map(item => ({
        ...item,
        order_id: order.id
      }));

      await GroceryOrderItem.bulkCreate(orderItems);

      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get All Orders
  async getAll(req, res) {
    try {
      const orders = await GroceryOrder.findAll({ include: GroceryOrderItem });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get Single Order
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const order = await GroceryOrder.findByPk(id, { include: GroceryOrderItem });

      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update Order
  async update(req, res) {
    try {
      const { id } = req.params;
      const { status, payment_status } = req.body;

      const order = await GroceryOrder.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.status = status ?? order.status;
      order.payment_status = payment_status ?? order.payment_status;
      await order.save();

      res.status(200).json({ message: 'Order updated', order });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete Order
  async delete(req, res) {
    try {
      const { id } = req.params;
      const order = await GroceryOrder.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      await GroceryOrderItem.destroy({ where: { order_id: id } });
      await order.destroy();

      res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
