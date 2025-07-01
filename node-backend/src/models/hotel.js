const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
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
  main_image: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: 'hotels',
  underscored: true
});

Hotel.associate = (models) => {
  Hotel.hasMany(models.Room, { foreignKey: 'hotel_id', as: 'rooms' });
  
  // Many-to-many associations with Policy and Location
  Hotel.belongsToMany(models.Policy, { 
    through: 'hotel_policies', 
    foreignKey: 'hotel_id', 
    otherKey: 'policy_id',
    as: 'policies',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Hotel.belongsToMany(models.Location, { 
    through: 'hotel_locations', 
    foreignKey: 'hotel_id', 
    otherKey: 'location_id',
    as: 'locations',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};

module.exports = Hotel; 