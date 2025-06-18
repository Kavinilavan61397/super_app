const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  brand_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'brands',
  underscored: true
});

// Define associations
Brand.associate = (models) => {
  Brand.hasMany(models.Product, {
    foreignKey: 'brand_id',
    as: 'products'
  });
};

module.exports = Brand; 