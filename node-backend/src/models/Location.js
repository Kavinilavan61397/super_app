const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'locations',
  underscored: true
});

Location.associate = (models) => {
  Location.belongsToMany(models.Hotel, { 
    through: 'hotel_locations', 
    foreignKey: 'location_id', 
    otherKey: 'hotel_id',
    as: 'hotels',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};

module.exports = Location; 