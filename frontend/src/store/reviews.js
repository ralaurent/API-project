import { csrfFetch } from "../store/csrf";

export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
export const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
});
  
  export const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
});

export const removeReview = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId
});

export const getReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
  
    if(response.ok){
      const reviews = await response.json()
      dispatch(loadReviews(reviews))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const addReview = (spotId, review) =>  async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    })

    if(response.ok){
        const review = await response.json()
        dispatch(createReview(review))
        return response
    }else{
        if(response.status >= 500){
            let errors = {}
            try{
                errors.errors = await response.json()
                return errors
            }catch(err){
                errors.errors = { message: "Something went wrong!" }
                return errors
            }
        }
        const errors = await response.json()
        return errors
    }
}

export const deleteReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
  
    if(response.ok){
      await response.json()
      dispatch(removeReview(reviewId))
    }else{
        const errors = await response.json()
        return errors
    }
}

const spotsReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAD_REVIEWS: {
        const reviewsState = {};
        if(action.reviews.Reviews.length){
            action.reviews.Reviews.forEach((review) => {
              reviewsState[review.id] = review;
            });
        }
        return reviewsState;
      }
      case CREATE_REVIEW:
        return { ...state, [action.review.id]: action.review };
      case REMOVE_REVIEW: {
        const newState = { ...state };
        delete newState[action.reviewId];
        return newState;
      }
      default:
        return state;
    }
  };
  
  export default spotsReducer;
  