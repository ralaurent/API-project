const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorizeReview, authorizeBooking, authorizeBookingDelete } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');

const router = express.Router();

const { check, body } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateBooking = [
    body('endDate')
      .custom((value, { req }) => { return value > req.body.startDate })
      .withMessage('endDate cannot be on or before startDate'),
    handleValidationErrors
  ];

router.get('/current', requireAuth, async(req, res) => {
    const Bookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: Spot,
                attributes: {exclude: ["description", "createdAt", "updatedAt"]}
            },
        ]
    }) 

    const updatedBookings = []

    for(booking of Bookings){
        const updatedBooking = booking.toJSON()

        const previewImage = await SpotImage.findOne({
            where: {
                spotId: updatedBooking.Spot.id,
                preview: true
            }
        })

        updatedBooking.Spot = {
            ...updatedBooking.Spot,
            previewImage: previewImage?.url
        }

        updatedBookings.push(updatedBooking)
    }

    res.json({
        Bookings: updatedBookings
    })
})

router.put('/:bookingId', validateBooking, requireAuth, authorizeBooking, async(req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId)

    const { startDate, endDate } = req.body

    if(booking.endDate < new Date().toJSON().slice(0, 10)){
        return res.status(403).json({
            "message": "Past bookings can't be modified"
        })
    }

    booking.startDate = startDate || booking.startDate
    booking.endDate = endDate || booking.endDatex

    try{
        await booking.save()
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

    res.json({
        booking
    })
})

router.delete('/:bookingId', requireAuth, authorizeBookingDelete, async(req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId)

    const today = new Date()
    if(booking.startDate < today /*&& today > booking.endDate*/){
        return res.status(403).json({
            "message": "Bookings that have been started can't be deleted"
        })
    }

    await booking.destroy()

    res.json({
        "message": "Successfully deleted"
    })
})

module.exports = router;