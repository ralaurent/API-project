import { csrfFetch } from "../store/csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const CREATE_SPOT = 'spots/CREATE_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot
});

export const editSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot
});

export const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId
});

export const getSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots')
  
    if(response.ok){
      const spots = await response.json()
      dispatch(loadSpots(spots))
    }else{

    }
}

export const getSpotsById = () => async dispatch => {
    const response = await csrfFetch('/api/spots')
  
    if(response.ok){
      const spots = await response.json()
      dispatch(loadSpots(spots))
    }else{

    }
}

export const getCurrentSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current')
  
    if(response.ok){
      const spots = await response.json()
      dispatch(loadSpots(spots))
    }else{

    }
}

export const addSpot = (spot, images) => async dispatch => {
    const response = await csrfFetch(`/api/spots`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })
  
    if(response.ok){
        const spot = await response.json()

        const response = await csrfFetch(`/api/spots/${spot.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(images)
        })

        if(response.ok){
            // dispatch(createSpot(spot))
        }else{

        }
    }else{

    }
}

export const updateSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
  
    if(response.ok){
        const spot = await response.json()
        dispatch(editSpot(spot))
    }else{

    }
}

export const deleteSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
  
    if(response.ok){
        dispatch(removeSpot(spotId))
    }else{

    }
}

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const spotsState = {};
      action.spots.Spots.forEach((spot) => {
        spotsState[spot.id] = spot;
      });
      return spotsState;
    }
    case CREATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case UPDATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case REMOVE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
