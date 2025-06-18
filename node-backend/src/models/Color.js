const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Color = sequelize.define('Color', {
  color_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  color_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'colors'
});

module.exports = Color; 