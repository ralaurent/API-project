import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots'
import './pages.css';

function Spots(){
    const dispatch = useDispatch()
    let spots = useSelector(state => state.spots)

    console.log("Normalized data: ", spots)

    spots = Object.values(spots)

    console.log("Array data: ", spots)

    useEffect(() => {
        dispatch(spotActions.getSpots())
    }, [])


    return(
        <div className="spots-body">
            <div className="inner"></div>
        </div>
    )

}

export default Spots