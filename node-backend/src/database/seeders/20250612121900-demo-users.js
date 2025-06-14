'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Test User 1',
        email: 'user1@example.com',
        password: await bcrypt.hash('password1', salt),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Test User 2',
        email: 'user2@example.com',
        password: await bcrypt.hash('password2', salt),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: ['user1@example.com', 'user2@example.com']
    }, {});
  }
}; 