'use strict';
/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require('../models');

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
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://example.com/review1"
      },
      {
        reviewId: 1,
        url: "https://example.com/review2"
      },
      {
        reviewId: 1,
        url: "https://example.com/review3"
      },
      {
        reviewId: 1,
        url: "https://example.com/review4"
      },
      {
        reviewId: 1,
        url: "https://example.com/review5"
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
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1] }
    }, {});
  }
};
