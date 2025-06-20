'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroceryOrder = sequelize.define('GroceryOrder', {
    user_id: DataTypes.BIGINT.UNSIGNED,
    total_amount: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
    payment_status: DataTypes.ENUM('pending', 'paid', 'failed'),
    shipping_address: DataTypes.TEXT
  }, {
    tableName: 'grocery_orders',
    underscored: true
  });

  GroceryOrder.associate = function(models) {
    GroceryOrder.belongsTo(models.User, { foreignKey: 'user_id' });
    GroceryOrder.hasMany(models.GroceryOrderItem, { foreignKey: 'order_id' });
  };

  return GroceryOrder;
};
