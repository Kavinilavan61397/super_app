const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Size = sequelize.define('Size', {
  size_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'sizes'
});

module.exports = Size; 