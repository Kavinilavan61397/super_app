'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, verify that the user exists
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE id = 1;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('User with ID 1 not found. Skipping taxi rides seeder.');
      return;
    }

    await queryInterface.bulkInsert('taxi_rides', [
      {
        id: 1,
        user_id: 1,
        driver_id: 1,
        vehicle_id: 1,
        pickup_location: '123 Main St',
        dropoff_location: '456 Park Ave',
        fare: 25.50,
        status: 1,
        requested_at: new Date(),
        started_at: new Date(),
        completed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('taxi_rides', null, {});
  }
};
