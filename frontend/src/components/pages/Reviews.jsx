import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import * as reviewActions from '../../store/reviews'
import * as spotActions from '../../store/spots'
import DeleteModal from "./DeleteModal";
import { useModal } from '../../context/Modal';
import ReviewModal from "./ReviewModal";

function Reviews({ spotId, ownerId, avgRating }){
    const dispatch = useDispatch()
    let reviews = useSelector(state => state.reviews)
    const sessionUser = useSelector(state => state.session.user);
    const [stars, setStars] = useState([])
    const { closeModal } = useModal();
    const [showMenu, setShowMenu] = useState(false)

    reviews = Object.values(reviews)
    reviews = reviews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    const index = reviews.findIndex(review => review?.userId === sessionUser?.id)
    if (index !== -1) {
        reviews.unshift(reviews.splice(index, 1)[0]);
    }

    const deleteReview = async (e, reviewId) => {
        e.stopPropagation()
        await dispatch(reviewActions.deleteReview(reviewId))
        await dispatch(spotActions.getSpotsById(spotId))
        closeModal()
    }

    useEffect(() => {
        dispatch(reviewActions.getReviews(spotId))
    }, [])

    useEffect(() => {
        setStars(Array(5).fill(false))
    }, [])

    const closeMenu = () => setShowMenu(!showMenu);

    return(
        <div className="review-container">
        {!reviews.length ?
        <span className="no-wrap md"><i className="fas fa-star stars md" /><b>New</b></span>
        :
        <div className="reviews-header">
            <span className="no-wrap md"><i className="fas fa-star stars md" /><b>{Number(avgRating).toFixed(1)}</b></span>
            <b><div className="md">·</div></b>
            <b><div className="md">{reviews.length <= 1 ? `${reviews.length} Review` : `${reviews.length} Reviews`}</div></b>
        </div>
        }
        {sessionUser?.id && sessionUser?.id !== ownerId && !reviews.some((review) => review.userId == sessionUser.id) && <button className="theme-button">
        <OpenModalMenuItem
            itemText="Post a Review"
            onItemClick={closeMenu}
            modalComponent={<ReviewModal spotId={spotId}/>}
        />
        </button>}
        {sessionUser?.id && sessionUser?.id !== ownerId && !reviews.length && <h4>Be the first to post a review</h4>}
        {reviews.map((review) => (
            <div key={review.id} className={sessionUser?.id && review.userId == sessionUser.id ? "review-content r-b" : "review-content"}>
                <div className="review-rating">
                {sessionUser?.id && review.userId == sessionUser.id ?
                <b><span>You</span></b>
                :
                <b><span>{review?.User?.firstName} {review?.User?.lastName}</span></b>
                }    
                <div className="review-stars">
                    {stars.map((star, index) => (
                        index <= review.stars - 1 ?
                        <i key={index} className="fas fa-star stars md r-m" />
                        :
                        <i key={index} className="far fa-star stars md r-m" />
                    ))}
                </div>
                </div>
                <span>{new Date(review?.updatedAt).toLocaleString('en-US', { month: 'long' })} {new Date(review?.updatedAt).getFullYear()}</span>
                <span>{review?.review}</span>
                {sessionUser?.id && review.userId == sessionUser.id && <button className="theme-button">
                <OpenModalMenuItem
                    itemText="Delete"
                    onItemClick={closeMenu}
                    modalComponent={<DeleteModal header={"Confirm Delete"} body={"Are you sure you want to delete this review?"} action={(e) => {deleteReview(e, review.id)}}/>}
                />
                </button>}
            </div>
        ))}
        </div>
    )
}

export default Reviews