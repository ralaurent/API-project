import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/reviews'
import * as spotActions from '../../store/spots'
import './pages.css';

function ReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [stars, setStars] = useState([])
  const [reviewText, setReviewText] = useState("");
  const [currentStars, setCurrentStars] = useState(0);
  const [newStars, setNewStars] = useState(0);
  const { closeModal } = useModal();

  const createReview = async (e) => {
    e.stopPropagation()
    const firstRes = await dispatch(reviewActions.addReview(spotId, { review: reviewText, stars: currentStars }))

    if(!firstRes?.ok){
        if(firstRes?.errors){
            return setErrors(firstRes.errors);
        }
    }
    closeModal()
    await dispatch(spotActions.getSpotsById(spotId))
  }

  useEffect(() => {
    setStars(Array(5).fill(false))
  }, [])

  return (
    <div className='review-modal'>
      <h2>How was your stay?</h2>
        {errors.stars && (
          <p className='errors'>{errors.stars}</p>
        )}
        {errors.id && (
          <p className='errors'>{errors.id}</p>
        )}
        {errors.review && (
          <p className='errors'>{errors.review}</p>
        )}
        {errors.message && (
          <p className='errors'>{errors.message}</p>
        )}
        <textarea
        value={reviewText}
        className="review-textarea"
        onChange={(e) => setReviewText(e.target.value)}
        name='review'
        placeholder='Leave your review here...'
        rows='10'
        ></textarea>
        <div onMouseLeave={() => !currentStars ? setNewStars(0) : setNewStars(currentStars)} className='review-stars'>
            <div>
            {stars.map((star, index) => (
                <i key={index} onClick={() => {setCurrentStars(index + 1)}} onMouseEnter={() => setNewStars(index + 1)} className={`${index + 1 <= newStars ? "fas" : "far"} fa-star stars lrg r-m` }/>
            ))}
            </div>
            <h4>Stars</h4>
        </div>
        
        <button disabled={reviewText.length < 30 || !currentStars} onClick={(e) => createReview(e)} className='modal-theme-button'>Submit Your Review</button>
    </div>
  );
}

export default ReviewModal;
