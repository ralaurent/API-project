'use strict';
/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: "2023-11-27",
        endDate: "2023-12-01"
      },
      {
        spotId: 1,
        userId: 1,
        startDate: "2023-12-05",
        endDate: "2023-12-10"
      },
      {
        spotId: 1,
        userId: 1,
        startDate: "2023-12-15",
        endDate: "2023-12-20"
      },
      {
        spotId: 1,
        userId: 1,
        startDate: "2023-12-25",
        endDate: "2023-12-30"
      },
      {
        spotId: 1,
        userId: 1,
        startDate: "2024-01-05",
        endDate: "2024-01-10"
      }    
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1] }
    }, {});
  }
};
