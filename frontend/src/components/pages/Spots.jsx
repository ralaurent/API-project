import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots'
import './pages.css';

function Spots(){
    const dispatch = useDispatch()
    let spots = useSelector(state => state.spots)

    console.log("Normalized data: ", spots)

    spots = Object.keys(spots).map(key => {
        return spots[key];
      })
      
    useEffect(() => {
        dispatch(spotActions.getSpots())
    }, [])


    return(
        <div className="spots-body">

        </div>
    )

}

export default Spots