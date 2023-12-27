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
        spotId: 1, // Cottage
        url: "https://i.ibb.co/0GTzgDy/featured-image-351f3b.png",
        preview: true
      },
      {
        spotId: 1,
        url: "https://i.ibb.co/T8ZdV5P/cob1-b19062-1024x682.png",
        preview: false
      },
      {
        spotId: 1,
        url: "https://i.ibb.co/xMscML2/cob3-7760ea-1024x682.png",
        preview: false
      },
      {
        spotId: 1,
        url: "https://i.ibb.co/4Pd0K1w/cob4-67ae26-1024x685.png",
        preview: false
      },
      {
        spotId: 1,
        url: "https://i.ibb.co/BnHdDhx/cob5-ea6f44-e1571679967617-1024x685.png",
        preview: false
      },
      {
        spotId: 3, // Retreat
        url: "https://i.ibb.co/944FVMm/38c1f036378d7f1c9f346bb5c947d5f1-uncropped-scaled-within-1536-1152.png",
        preview: true
      },

      {
        spotId: 3, 
        url: "https://i.ibb.co/7RYJT0F/4ad151f3e3850608f23bec2152114ff2-uncropped-scaled-within-1536-1152.png",
        preview: false
      },

      {
        spotId: 3,
        url: "https://i.ibb.co/5BRvFwp/8d50e7b698822ae66cb4ba150d67de2a-uncropped-scaled-within-1536-1152.png",
        preview: false
      },

      {
        spotId: 3, 
        url: "https://i.ibb.co/6wDpBjj/32dfb1350f422f5a1733a9ef1a63621b-uncropped-scaled-within-1536-1152.png",
        preview: false
      },

      {
        spotId: 3,
        url: "https://i.ibb.co/mGKrL4N/a850dbb61b3e74a3058d7aec7f2ea5bb-uncropped-scaled-within-1536-1152.png",
        preview: false
      },
      {
        spotId: 4, // Villa
        url: "https://i.ibb.co/WtC2XDJ/villa-amalfi-coast-sorrento-italy-luxury-astor-cov-XL.jpg",
        preview: true
      },

      {
        spotId: 4, 
        url: "https://i.ibb.co/Jvjmf7w/villa-amalfi-coast-sorrento-italy-luxury-beach-astor-roof-XL.jpg",
        preview: false
      },

      {
        spotId: 4, 
        url: "https://i.ibb.co/fpSbLG2/villa-amalfi-coast-sorrento-italy-luxury-beach-astor-swim-2-XL.jpg",
        preview: false
      },

      {
        spotId: 4, 
        url: "https://i.ibb.co/CQqkxQ4/villa-amalfi-coast-sorrento-italy-super-luxury-beach-astor-gar-19-XL.jpg",
        preview: false
      },

      {
        spotId: 4, 
        url: "https://i.ibb.co/brZzZ1F/villa-amalfi-coast-sorrento-italy-super-luxury-beach-astor-ter-1-XL.jpg",
        preview: false
      },
      {
        spotId: 5, // Apartment
        url: "https://i.ibb.co/tzC0QqY/4a4f8b7eca231e55afac69e518f1f222-uncropped-scaled-within-1536-1152.png",
        preview: true
      },

      {
        spotId: 5, 
        url: "https://i.ibb.co/frtT5bp/0618d13f0b675dc221782be8d692bbc8-uncropped-scaled-within-1536-1152.png",
        preview: false
      },

      {
        spotId: 5,
        url: "https://i.ibb.co/g9RnT0N/1424b98f3bf86650f084e59a91c93a34-uncropped-scaled-within-1536-1152.png",
        preview: false
      },

      {
        spotId: 5, 
        url: "https://i.ibb.co/17d7HRd/4487f474c3968c18cf87b60447d141ef-uncropped-scaled-within-1536-1152.png",
        preview: false
      },

      {
        spotId: 5, 
        url: "https://i.ibb.co/Zh534HD/dfd0d15180d465902d202c6e223f03f1-uncropped-scaled-within-1536-1152.png",
        preview: false
      },
      {
        spotId: 2, // Loft 
        url: "https://i.ibb.co/p1MFd0H/bdb02d6440c8e48d74f076ad917f79f6-uncropped-scaled-within-1536-1152.png",
        preview: true
      },
      {
        spotId: 2, 
        url: "https://i.ibb.co/xscbwR5/2c8e8a1701cec4dcc9aefd9b7a517afe-uncropped-scaled-within-1536-1152.png",
        preview: false
      },
      {
        spotId: 2, 
        url: "https://i.ibb.co/LtN9thv/2551af3aff8383553a0e0701b79e20ef-cc-ft-1536.png",
        preview: false
      },
      {
        spotId: 2, 
        url: "https://i.ibb.co/mTWjTrx/be3cedd313818e500a64a8a0fdb504ff-uncropped-scaled-within-1536-1152.png",
        preview: false
      },
      {
        spotId: 2, 
        url: "https://i.ibb.co/V2dT4Mp/cfdbc674dd27f0137dd0eff62a2e59c0-uncropped-scaled-within-1536-1152.png",
        preview: false
      },
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
