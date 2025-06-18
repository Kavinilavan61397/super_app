'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if restaurant categories already exist
    const existingCategories = await queryInterface.sequelize.query(
      'SELECT id FROM restaurant_categories LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // If categories already exist, skip seeding
    if (existingCategories && existingCategories.length > 0) {
      console.log('Restaurant categories already exist, skipping seeding');
      return;
    }
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
    // Only delete the demo restaurant categories
    await queryInterface.bulkDelete('restaurant_categories', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3] // Only delete the demo categories
      }
    });
  }
};
