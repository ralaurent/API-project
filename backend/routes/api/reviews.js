const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, authorizeReview } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

router.get('/current', requireAuth, async(req, res) => {
    const Reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: Spot,
                attributes: {exclude: ["description", "createdAt", "updatedAt"]}
            }, 
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            },
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            }
        ]
    })

    const updatedReviews = []

    for(review of Reviews){
        const updatedReview = review.toJSON()

        const previewImage = await SpotImage.findOne({
            where: {
                spotId: updatedReview.Spot.id,
                preview: true
            }
        })

        updatedReview.Spot = {
            ...updatedReview.Spot,
            previewImage: previewImage?.url || "No preview image available"
        }

        updatedReviews.push(updatedReview)
    }

    res.json({
        Reviews: updatedReviews
    })
})

router.post('/:reviewId/images', requireAuth, authorizeReview, async(req, res) => {
    const review = await Review.findByPk(req.params.reviewId)

    const { url } = req.body

    const count = await review.getReviewImages()

    if(count.length == 10){
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        })
    }

    const newImage = await review.createReviewImage({
        url
    })

    res.json({
        id: newImage.id,
        url: newImage.url
    })
})

router.put('/:reviewId', requireAuth, authorizeReview,  validateReview,  async(req, res) => {
    const reviews = await Review.findByPk(req.params.reviewId)

    const { review, stars } = req.body

    reviews.review = review || reviews.review
    reviews.stars = stars || reviews.stars

    await reviews.save()

    res.json(reviews)
})

router.delete('/:reviewId', requireAuth, authorizeReview, async(req, res) => {
    const review = await Review.findByPk(req.params.reviewId)

    await review.destroy()

    res.json({
        "message": "Successfully deleted"
      })
})

module.exports = router;