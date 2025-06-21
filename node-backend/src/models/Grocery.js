'use strict';
module.exports = (sequelize, DataTypes) => {
  const Grocery = sequelize.define('Grocery', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    original_price: DataTypes.DECIMAL(10, 2),
    discounted_price: DataTypes.DECIMAL(10, 2),
    image: DataTypes.STRING,
    rating: DataTypes.DECIMAL(3, 2),
    is_best_seller: DataTypes.BOOLEAN,
    quantity: DataTypes.INTEGER,
    category: DataTypes.STRING,
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'groceries',
    timestamps: true,
    underscored: true
  });

  Grocery.associate = function(models) {
    // Add associations if needed
  };

  return Grocery;
};
