const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorizeSpot, authorizeSpotImageDelete, authorizeReviewImageDelete } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');

const router = express.Router();

const { check, body } = require('express-validator');
const { handleValidationErrors, handleBookingValidationErrors } = require('../../utils/validation');


router.delete('/spot-images/:imageId', requireAuth, authorizeSpotImageDelete, async(req, res) => {
    const image = await SpotImage.findByPk(req.params.imageId)

    if(!image){
        return res.status(404).json({
            "message": "Spot Image couldn't be found"
        })
    }

    await image.destroy()

    res.json({
        "message": "Successfully deleted"
    })
})

router.delete('/review-images/:imageId', requireAuth, authorizeReviewImageDelete, async(req, res) => {
    const image = await ReviewImage.findByPk(req.params.imageId)

    if(!image){
        return res.status(404).json({
            "message": "Review Image couldn't be found"
        })
    }

    await image.destroy()

    res.json({
        "message": "Successfully deleted"
    })
})

module.exports = router;