const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorizeSpot } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isNumeric()
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isNumeric()
      .withMessage('Longitude is not valid'),
    check('name')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Price per day is required'),
    handleValidationErrors
  ];

router.get('/', async(req, res) => {
    const Spots = await Spot.findAll({})

    const updatedSpots = [];

    for (const spot of Spots) {
        const stars = await spot.getReviews({
            attributes: ['stars']
        })
        const totalStars = stars.reduce((sum, item) => {
            return sum + item.stars;
          }, 0)

        const image = await spot.getSpotImages({
            attributes: ['url']
        })
        
        updatedSpots.push({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: totalStars / stars.length,
            previewImage: image[0]?.url,
      });
    }

    res.json({
        Spots: updatedSpots
    })
})

router.get('/current', requireAuth, async(req, res) => {
    const Spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })

    const updatedSpots = [];

    for (const spot of Spots) {
        const stars = await spot.getReviews({
            attributes: ['stars']
        })
        const totalStars = stars.reduce((sum, item) => {
            return sum + item.stars;
          }, 0)

        const image = await spot.getSpotImages({
            attributes: ['url']
        })
        
        updatedSpots.push({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: totalStars / stars.length,
            previewImage: image[0]?.url,
      });
    }

    res.json({
        Spots: updatedSpots
    })
})

router.get('/:spotId', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include:[{
            model: User,
            attributes: ["id", "firstName", "lastName"],
            as: 'Owner'
        },
        {
            model: SpotImage,
            attributes: ["id", "url", "preview"]
        }]
    })

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    res.json({spot})
})

router.post('/', requireAuth, validateSpot, async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    
    const spot = await Spot.create({
        address, city, state, country, lat, lng, name, description, price
    })

    res.status(201).json(spot)
})

router.post('/:spotId/images', requireAuth, authorizeSpot, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    const { url, preview } = req.body

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    const newSpot = await spot.createSpotImage({
        url, preview
    })

    res.json({
        id: newSpot.id,
        url: newSpot.url,
        preview: newSpot.preview
    })
})

router.put('/:spotId', requireAuth, authorizeSpot, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    spot.address = address || spot.address
    spot.city = city || spot.city
    spot.state = state || spot.state
    spot.country = country || spot.country
    spot.lat = lat || spot.lat
    spot.lng = lng || spot.lng
    spot.name = name || spot.name
    spot.description = description || spot.description
    spot.price = price || spot.price

    await spot.save()

    res.json(spot)
})

router.delete('/:spotId', requireAuth, authorizeSpot, async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    await spot.destroy()

    res.json({
        "message": "Successfully deleted"
    })
})

module.exports = router;