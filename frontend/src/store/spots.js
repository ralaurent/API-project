import { csrfFetch } from "../store/csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SPOT = 'spots/LOAD_SPOT';
export const CREATE_SPOT = 'spots/CREATE_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const loadSpot = (spot) => ({
    type: LOAD_SPOT,
    spot
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
        const errors = await response.json()
        return errors
    }
}

export const getSpotsById = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
  
    if(response.ok){
      const spot = await response.json()
      dispatch(loadSpot(spot))
      return response
    }else{
        const errors = await response.json()
        return errors
    }
}

export const getCurrentSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current')
  
    if(response.ok){
      const spots = await response.json()
      dispatch(loadSpots(spots))
    }else{
        const errors = await response.json()
        return errors
    }
}

export const addSpot = (spot, images) => async dispatch => {
    const firstResponse = await csrfFetch(`/api/spots`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })
  
    if(firstResponse.ok){
        const spot = await firstResponse.json()

        // images.forEach(async (image) => {
        //     const secondResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(image)
        //     })

        //     if(!secondResponse.ok){
        //         const errors = await secondResponse.json()
        //         return errors
        //     }
        // })

        await Promise.all(images.map(async (image) => {
            const secondResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(image)
            });
    
            if (!secondResponse.ok) {
                const errors = await secondResponse.json()
                return errors
            }
        }))

        await dispatch(createSpot(spot))
        return spot.id
    }else{
        const errors = await firstResponse.json()
        return errors
    }
}

export const updateSpot = (spotId, spot) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })
  
    if(response.ok){
        const spot = await response.json()
        dispatch(editSpot(spot))
    }else{
        const errors = await response.json()
        return errors
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
        const errors = await response.json()
        return errors
    }
}

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const spotsState = {};
      if(action.spots.Spots.length){
          action.spots.Spots.forEach((spot) => {
            spotsState[spot.id] = spot;
          });
      }
      return spotsState;
    }
    case LOAD_SPOT: {
        const spotState = {}
        spotState[action.spot.id] = action.spot
        return spotState
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
