const { GCartItem } = require('../models');

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await GCartItem.findAll({
      where: { user_id: userId }
    });

    res.json(items);
  } catch (error) {
    console.error('❌ Error fetching GCartItems:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      groceryId,
      name,
      image,
      category,
      original_price,
      discounted_price,
      quantity
    } = req.body;

    const [item, created] = await GCartItem.findOrCreate({
      where: { user_id: userId, grocery_id: groceryId },
      defaults: {
        name,
        image,
        category,
        original_price,
        discounted_price,
        quantity
      }
    });

    if (!created) {
      item.quantity += quantity;
      await item.save();
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('❌ Error adding to GCartItem:', error);
    res.status(500).json({ error: error.message });
  }
};
