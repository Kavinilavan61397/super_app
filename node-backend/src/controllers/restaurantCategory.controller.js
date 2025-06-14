const { RestaurantCategory } = require('../models');

module.exports = {
  // List all categories
  async getAll(req, res) {
    try {
      const categories = await RestaurantCategory.findAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
    }
  },

  // Get category by ID
  async getById(req, res) {
    try {
      const category = await RestaurantCategory.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch category', details: err.message });
    }
  },

  // Create category
  async create(req, res) {
    try {
      const { name, description, image } = req.body;
      const category = await RestaurantCategory.create({ name, description, image });
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create category', details: err.message });
    }
  },

  // Update category
  async update(req, res) {
    try {
      const { name, description, image } = req.body;
      const category = await RestaurantCategory.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      await category.update({ name, description, image });
      res.json(category);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update category', details: err.message });
    }
  },

  // Delete category
  async delete(req, res) {
    try {
      const category = await RestaurantCategory.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      await category.destroy();
      res.json({ message: 'Category deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete category', details: err.message });
    }
  }
}; 