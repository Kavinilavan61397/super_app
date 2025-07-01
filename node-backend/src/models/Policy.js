const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Policy = sequelize.define('Policy', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
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
  tableName: 'policies',
  underscored: true
});

Policy.associate = (models) => {
  Policy.belongsToMany(models.Hotel, { 
    through: 'hotel_policies', 
    foreignKey: 'policy_id', 
    otherKey: 'hotel_id',
    as: 'hotels',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};

module.exports = Policy; 