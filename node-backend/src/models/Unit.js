const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Unit = sequelize.define('Unit', {
  unit_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  unit_symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'units'
});

module.exports = Unit; 