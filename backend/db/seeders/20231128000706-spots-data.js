'use strict';
/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

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
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Main Street",
        city: "Exampleville",
        state: "EX",
        country: "Exampleland",
        lat: 37.7749,
        lng: -122.4194,
        name: "Cozy Cottage",
        description: "A charming cottage in a quiet neighborhood, perfect for a relaxing getaway.",
        price: 100
      },
      {
        ownerId: 5,
        address: "456 Elm Avenue",
        city: "Sampletown",
        state: "ST",
        country: "Sampleland",
        lat: 34.0522,
        lng: -118.2437,
        name: "Modern Loft",
        description: "Sleek and stylish loft with modern amenities, ideal for urban living.",
        price: 150
      },
      {
        ownerId: 2,
        address: "789 Oak Drive",
        city: "Testville",
        state: "TS",
        country: "Testland",
        lat: 40.7128,
        lng: -74.0060,
        name: "Spacious Retreat",
        description: "A spacious retreat surrounded by nature, great for family vacations.",
        price: 200
      },
      {
        ownerId: 1,
        address: "101 Pine Lane",
        city: "Example Springs",
        state: "ES",
        country: "Exampleland",
        lat: 41.8781,
        lng: -87.6298,
        name: "Luxury Villa",
        description: "Experience luxury in this stunning villa with panoramic views.",
        price: 300
      },
      {
        ownerId: 4,
        address: "202 Cedar Street",
        city: "Sample City",
        state: "SC",
        country: "Sampleland",
        lat: 51.5074,
        lng: -0.1278,
        name: "Downtown Apartment",
        description: "Chic apartment in the heart of the city, close to all the attractions.",
        price: 120
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // city: { [Op.in]: ['Exampleville', 'Sampletown', 'Testville', 'Example Springs', 'Sample City'] }
      ownerId: { [Op.in]: [1] }
    }, {});
  }
};
