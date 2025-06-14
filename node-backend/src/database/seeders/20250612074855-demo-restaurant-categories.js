'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurant_categories', [
      {
        id: 1,
        name: 'Italian',
        description: 'Italian cuisine and pasta dishes',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Indian',
        description: 'Traditional Indian cuisine',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Chinese',
        description: 'Chinese cuisine and noodles',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurant_categories', null, {});
  }
};
