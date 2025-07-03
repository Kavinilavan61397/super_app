'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // No longer needed: product_data is deprecated in favor of product_snapshot
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    // No-op
    return Promise.resolve();
  }
}; 