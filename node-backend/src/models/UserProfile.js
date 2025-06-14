const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  address_line1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address_line2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  pincode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'user_profiles',
  timestamps: true,
  underscored: true
});

module.exports = UserProfile; 