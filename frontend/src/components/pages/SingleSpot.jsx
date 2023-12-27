import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import * as spotActions from '../../store/spots'
import { useParams, useNavigate } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import Reviews from "./Reviews";

function SingleSpot(){
    const dispatch = useDispatch()
    const { spotId } = useParams()
    let spot = useSelector(state => state.spots)
    const [previewImage, setPreviewImage] = useState("")
    const [images, setImages] = useState("")
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()

    spot = spot[spotId]
    console.log(spot)

    useEffect(() => {
        const findSpot = async () => {
            const res = await dispatch(spotActions.getSpotsById(spotId))
            if(!res?.ok){
                if(res?.errors || res?.message){
                    navigate('/')
                }
            }
        }
        findSpot()
    }, [])

    useEffect(() => {
        if(!spot?.SpotImages) return
        const spotImages = Object.values(spot.SpotImages)
        
        const preview = spotImages.find((spot) => spot.preview === true)
        const images = spotImages
        .filter((spot) => spot.preview === false)
        .map((image) => image.url)
        setPreviewImage(preview.url)
        setImages(images)
    }, [spot])

    const closeMenu = () => setShowMenu(!showMenu);

    const ComingSoon = () => {
        return(
            <div className="centered">
                <h2>Feature coming soon!</h2>
            </div>
        )
    }

    return(
        <div className="spot-container">
        <div className="spot-body">
        <>
            <h2>{spot?.name}</h2>
            <h3>{spot?.city}, {spot?.state}, {spot?.country}</h3>
            <div className="spot-images">
                <div>
                    <img className="spot-image" src={previewImage}/>
                </div>
                <div>
                    <div>
                        <div>
                            <img className="spot-image" src={images[0]}/>
                        </div>
                        <div>
                            <img className="spot-image" src={images[1]}/>
                        </div>
                    </div>
                    <div>
                        <div>
                            <img className="spot-image" src={images[2]}/>
                        </div>
                        <div>
                            <img className="spot-image" src={images[3]}/>
                        </div>
                    </div>
                </div>
            </div>
            <div  className="spot-content">
                <div className="spot-inner-content">
                    <h3>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</h3>
                    <h4>{spot?.description}</h4>
                </div>
                <div className="spot-reservation">
                    <div className="spot-header">
                    <span> <span className="lrg">${spot?.price}</span> night</span>

                    <div className="spot-stats">
                        {spot?.numReviews == 0 ? 
                        <span><b>New</b></span>
                        :
                        <>
                            <span><i className="fas fa-star stars" /><b>{Number(spot?.avgRating).toFixed(1)}</b></span>
                            <div>·</div>
                            <div>{spot?.numReviews <= 1 ? `${spot?.numReviews} review` : `${spot?.numReviews} reviews`}</div>
                        </>
                        }
                    </div>
                    </div>
                    <button className="reserve">
                        <OpenModalMenuItem
                            itemText="Reserve"
                            onItemClick={closeMenu}
                            modalComponent={<ComingSoon/>}
                        /></button>
                </div>
            </div>
            <hr></hr>
            <Reviews spotId={spotId} ownerId={spot?.Owner?.id} avgRating={spot?.avgRating}/>
            </>
        </div>
        </div>
    )

}

export default SingleSpot