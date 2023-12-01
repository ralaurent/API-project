const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorizeSpot } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');

const router = express.Router();

const { check, body } = require('express-validator');
const { handleValidationErrors, handleBookingValidationErrors } = require('../../utils/validation');

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

const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Review text is required'),
    check('stars')
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

const validateBooking = [
    body('endDate')
      .custom((value, { req }) => { return value > req.body.startDate })
      .withMessage('endDate cannot be on or before startDate'),
    handleValidationErrors
  ];

const validateFilters = [
    check('page')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isInt({ min: 1, max: 10 })
      .withMessage('Page must be greater than or equal to 1'),
    check('size')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isInt({ min: 1, max: 20 })
      .withMessage('Size must be greater than or equal to 1'),
    check('minLat')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isNumeric()
      .withMessage('Maximum latitude is invalid'),
    check('maxLat')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isNumeric()
      .withMessage('Minimum latitude is invalid'),
    check('minLng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isNumeric()
      .withMessage('Maximum longitude is invalid'),
    check('maxLng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isNumeric()
      .withMessage('Minimum longitude is invalid'),
    check('minPrice')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
  ];

router.get('/', validateFilters, async(req, res) => {
    const { page, size } = req.params

    const pagination = {
        limit: size,
        offset: size * (page - 1)
    }

    const Spots = await Spot.findAll({
        ...pagination
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
            where: { 
                preview: true
            },
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
        Spots: updatedSpots,
        page,
        size
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

    res.json(spot)
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

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    const { url, preview } = req.body

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

router.get('/:spotId/reviews', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    const Reviews = await spot.getReviews({
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            },
        ]
    })

    res.json({
        Reviews
    })
})

router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
    const userId = req.user.id

    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    const usersReviews = await spot.getReviews({
        where: {
            userId: userId
        }
    })

    if(usersReviews.length){
        return res.status(500).json({
            "message": "User already has a review for this spot"
        })
    }

    const { review, stars } = req.body

    const newReview = await spot.createReview({
        review, stars, userId
    })

    res.json(newReview)
})

router.get('/:spotId/bookings', requireAuth, async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    let params = {
        attributes: {},
        include: []
    }

    if(spot.ownerId == req.user.id){
        params.include = [{
            model: User,
            attributes: ["id", "firstName", "lastName"] 
        }]
    }else{
        params.attributes = { exclude: ["id", "userId", "createdAt", "updatedAt"] }
    }

    const Bookings = await spot.getBookings({
        ...params
    })

    res.json({
        Bookings
    })

})

router.post('/:spotId/bookings', requireAuth, validateBooking, async(req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
        })
    }

    const { startDate, endDate } = req.body
    const userId = req.user.id

    try{
        const booking = await spot.createBooking({
            startDate, endDate, userId
        })
    }catch(err){
        const error = new Error("Sorry, this spot is already booked for the specified dates");
        error.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
        };
        error.status = 403;
        error.title = "Bad request.";
        return next(error);
    }

    res.json(booking)
})

module.exports = router;