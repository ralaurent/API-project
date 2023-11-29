'use strict';
/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

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
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "A wonderful experience! The place was amazing and the host was very accommodating.",
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: "Had a great time at this spot. The location was perfect, and the amenities were top-notch.",
        stars: 4
      },
      {
        spotId: 4,
        userId: 3,
        review: "The spot was cozy and comfortable. Enjoyed my stay overall.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 4,
        review: "Not bad, but there were some issues with cleanliness. Could be improved.",
        stars: 2
      },
      {
        spotId: 5,
        userId: 5,
        review: "Unfortunately, my experience wasn't great. The place needs better maintenance.",
        stars: 1
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
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1] }
    }, {});
  }
};
