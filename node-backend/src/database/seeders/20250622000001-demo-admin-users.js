'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = 'password123';
    // The User model's beforeCreate hook will handle hashing,
    // but it's best practice to hash in the seeder if the model logic changes.
    const hashedPassword = await bcrypt.hash(password, 10);

    const users = [
      {
        name: 'Main Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Ecommerce Admin',
        email: 'ecommerce@example.com',
        password: hashedPassword,
        role: 'ecommerce_admin',
        status: 'active',
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Grocery Admin',
        email: 'grocery@example.com',
        password: hashedPassword,
        role: 'grocery_admin',
        status: 'active',
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Taxi Admin',
        email: 'taxi@example.com',
        password: hashedPassword,
        role: 'taxi_admin',
        status: 'active',
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hotel Admin',
        email: 'hotel@example.com',
        password: hashedPassword,
        role: 'hotel_admin',
        status: 'active',
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Insert users, ignoring duplicates based on the 'email' field
    await queryInterface.bulkInsert('users', users, {
       ignoreDuplicates: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // This will remove all users created by this seeder
    await queryInterface.bulkDelete('users', {
      email: [
        'admin@example.com',
        'ecommerce@example.com',
        'grocery@example.com',
        'taxi@example.com',
        'hotel@example.com'
      ]
    });
  }
}; 