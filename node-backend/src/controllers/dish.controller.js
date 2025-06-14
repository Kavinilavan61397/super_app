const { Dish, Restaurant } = require('../models');

module.exports = {
  // List all dishes (optionally filter by restaurantId)
  async getAll(req, res) {
    try {
      const where = {};
      if (req.query.restaurantId) {
        where.restaurantId = req.query.restaurantId;
      }
      const dishes = await Dish.findAll({
        where,
        include: [{ model: Restaurant, as: 'restaurant' }]
      });
      res.json(dishes);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch dishes', details: err.message });
    }
  },

  // Get dish by ID
  async getById(req, res) {
    try {
      const dish = await Dish.findByPk(req.params.id, {
        include: [{ model: Restaurant, as: 'restaurant' }]
      });
      if (!dish) return res.status(404).json({ error: 'Dish not found' });
      res.json(dish);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch dish', details: err.message });
    }
  },

  // Create dish
  async create(req, res) {
    try {
      const { name, price, description, image, restaurantId } = req.body;
      const dish = await Dish.create({ name, price, description, image, restaurantId });
      res.status(201).json(dish);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create dish', details: err.message });
    }
  },

  // Update dish
  async update(req, res) {
    try {
      const { name, price, description, image, restaurantId } = req.body;
      const dish = await Dish.findByPk(req.params.id);
      if (!dish) return res.status(404).json({ error: 'Dish not found' });
      await dish.update({ name, price, description, image, restaurantId });
      res.json(dish);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update dish', details: err.message });
    }
  },

  // Delete dish
  async delete(req, res) {
    try {
      const dish = await Dish.findByPk(req.params.id);
      if (!dish) return res.status(404).json({ error: 'Dish not found' });
      await dish.destroy();
      res.json({ message: 'Dish deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete dish', details: err.message });
    }
  }
}; 