const { Restaurant, RestaurantCategory } = require('../models');

module.exports = {
  // List all restaurants (optionally filter by categoryId)
  async getAll(req, res) {
    try {
      const where = {};
      if (req.query.categoryId) {
        where.categoryId = req.query.categoryId;
      }
      const restaurants = await Restaurant.findAll({
        where,
        include: [{ model: RestaurantCategory, as: 'category' }]
      });
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch restaurants', details: err.message });
    }
  },

  // Get restaurant by ID
  async getById(req, res) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [{ model: RestaurantCategory, as: 'category' }]
      });
      if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch restaurant', details: err.message });
    }
  },

  // Create restaurant
  async create(req, res) {
    try {
      const { name, address, categoryId, image, averageRating } = req.body;
      const restaurant = await Restaurant.create({ name, address, categoryId, image, averageRating });
      res.status(201).json(restaurant);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create restaurant', details: err.message });
    }
  },

  // Update restaurant
  async update(req, res) {
    try {
      const { name, address, categoryId, image, averageRating } = req.body;
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
      await restaurant.update({ name, address, categoryId, image, averageRating });
      res.json(restaurant);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update restaurant', details: err.message });
    }
  },

  // Delete restaurant
  async delete(req, res) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
      await restaurant.destroy();
      res.json({ message: 'Restaurant deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete restaurant', details: err.message });
    }
  }
}; 