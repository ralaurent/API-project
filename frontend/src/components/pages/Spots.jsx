import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots'
import { useNavigate } from "react-router-dom";
import './pages.css';

function Spots(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let spots = useSelector(state => state.spots)

    spots = Object.values(spots)

    useEffect(() => {
        dispatch(spotActions.getSpots())
    }, [])

    return(
        <div className="spots-container">
        <div className="spots-body">
            {spots.map((spot) => (
                <div  key={spot.id} onClick={() => navigate(`/spots/${spot.id}`)} className="spot">
                    <div id="box" className="image">
                        <img className="spot-image" src={spot.previewImage}></img>
                        <span>{spot.name}</span>
                    </div>
                    <div className="spot-header">
                        <div className="spot-location">
                            <div className="spot-location-ellipsis">{spot.city}, {spot.state}</div>
                        </div>
                        {spot.avgRating == 0 ?
                        <span><b>New</b></span>
                        :
                        <span className="no-wrap"><i className="fas fa-star stars" /><b>{Number(spot.avgRating).toFixed(1)}</b></span>
                        }
                    </div>
                    <span><b>${spot.price}</b> night</span>
                </div>
            ))}
        </div>
        </div>
    )

}

export default Spots