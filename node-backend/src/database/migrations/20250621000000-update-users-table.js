'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to users table
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });

    await queryInterface.addColumn('users', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Update role enum to include new role types
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin', 'ecommerce_admin', 'grocery_admin', 'taxi_admin', 'hotel_admin'),
      defaultValue: 'user',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added columns
    await queryInterface.removeColumn('users', 'status');
    await queryInterface.removeColumn('users', 'last_login');

    // Revert role enum to original
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    });
  }
}; 