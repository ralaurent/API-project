const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

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
            previewImage: previewImage?.url || "No preview image available"
        }

        updatedBookings.push(updatedBooking)
    }

    res.json({
        Bookings: updatedBookings
    })
})

router.put('/:bookingId', requireAuth, authorizeBooking, validateBooking, async(req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId)

    let { startDate, endDate } = req.body
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    
    if(booking.endDate < new Date()){
        return res.status(403).json({
            "message": "Past bookings can't be modified"
        })
    }

    booking.startDate = startDate || booking.startDate
    booking.endDate = endDate || booking.endDatex

    const conflict = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id: {
                [Op.not]: req.params.bookingId
            },
            [Op.or]: [
              {
                startDate: {
                  [Op.gte]: startDate
                },
                endDate: {
                  [Op.lte]: endDate
                }
              },
              {
                startDate: {
                  [Op.lte]: startDate
                },
                endDate: {
                  [Op.gte]: endDate
                }
              },
              {
                endDate: {
                  [Op.between]: [startDate, endDate]
                }
              },
              {
                startDate: {
                  [Op.between]: [startDate, endDate]
                }
              },
            ]
        }
    })

    const errors = {}

    if (conflict.some((booking) => (booking.startDate <= startDate && endDate <= booking.endDate) || (booking.startDate >= startDate && endDate >= booking.endDate))) {
        errors.startDate = "Start date conflicts with an existing booking"
        errors.endDate = "End date conflicts with an existing booking"
    }else if (conflict.some((booking) => booking.startDate <= startDate && startDate <= booking.endDate)) {
        errors.startDate = "Start date conflicts with an existing booking"
    } else if (conflict.some((booking) => booking.startDate <= endDate && endDate <= booking.endDate)) {
        errors.endDate = "End date conflicts with an existing booking"
    }

    if(!conflict.length){
        await booking.save()

        return res.json(booking)
    }
        const error = new Error("Sorry, this spot is already booked for the specified dates");
        error.errors = errors
        error.status = 403;
        error.title = "Bad request.";
        return next(error);
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