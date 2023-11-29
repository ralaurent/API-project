'use strict';
/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

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
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://example.com/image1.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://example.com/image2.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: "https://example.com/image3.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "https://example.com/image4.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://example.com/image5.jpg",
        preview: true
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // url: { [Op.in]: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg', 'https://example.com/image4.jpg', 'https://example.com/image5.jpg'] }
      spotId: { [Op.in]: [1] }
    }, {});
  }
};
