const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorizeReview } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

module.exports = router;