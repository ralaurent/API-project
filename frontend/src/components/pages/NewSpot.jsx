import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import * as spotActions from '../../store/spots'
import { useNavigate } from "react-router-dom";

function NewSpot(){
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);
    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [previewImage, setPreviewImage] = useState("")
    const [image1, setImage1] = useState("")
    const [image2, setImage2] = useState("")
    const [image3, setImage3] = useState("")
    const [image4, setImage4] = useState("")
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)
    const navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault()
        setSubmitted(!submitted)
    }

    useEffect(() => {
        if(!sessionUser?.id) navigate('/')
    })

    useEffect(() => {
        const checkInputsOnSubmit = async () => {
            if(firstLoad) return setFirstLoad(false)

            let errors = {}
            if(!country.length){
                errors.country = "Country is required"
            }
            if(!address.length){
                errors.address = "Address is required"
            }
            if(!city.length){
                errors.city = "City is required"
            }
            if(!state.length){
                errors.state = "State is required" 
            }
            if(description.length < 30){
                errors.description = "Description needs a minimum of 30 characters"
            }
            if(!name){
                errors.name = 'Name is required'
            }
            if(!price){
                errors.price = "Price is required"
            }
            if(!previewImage){
                errors.previewImage = "Preview image is required"
            }

            const allowedExtensions = ["jpg", "jpeg", "png"]
            if (image1 && !allowedExtensions.some((ext) => image1.endsWith(ext))) {
                errors.image1 = "Image URL must end in .png, .jpg, or .jpeg"
            }
            if (image2 && !allowedExtensions.some((ext) => image2.endsWith(ext))) {
                errors.image2 = "Image URL must end in .png, .jpg, or .jpeg"
            }
            if (image3 && !allowedExtensions.some((ext) => image3.endsWith(ext))) {
                errors.image3 = "Image URL must end in .png, .jpg, or .jpeg"
            }
            if (image4 && !allowedExtensions.some((ext) => image4.endsWith(ext))) {
                errors.image4 = "Image URL must end in .png, .jpg, or .jpeg"
            }

            if (Object.keys(errors).length === 0) {
                let lat = 40.010
                let lng = 45.010
                const spot = { name, address, city, state, country, price, description, lat, lng }

                const images = []
                if(previewImage) images.push({ url: previewImage, preview: true })
                if(image1) images.push({ url: image1, preview: false })
                if(image2) images.push({ url: image2, preview: false })
                if(image3) images.push({ url: image3, preview: false })
                if(image4) images.push({ url: image4, preview: false })

                const spotId = await dispatch(spotActions.addSpot(spot, images))
                navigate(`/spots/${spotId}`)
            }

            setErrors(errors)
        }

        checkInputsOnSubmit()
    }, [submitted])

    const handlePriceChange = (e) => {
        if(e.target.value === "") return setPrice("")
        const newValue = e.target.value;
        const parsedValue = parseFloat(newValue);
    
        if (!isNaN(parsedValue)) {
            setPrice(parsedValue);
        } 
    }

    return(
        <div className="spot-container">
            <div className="spot-form">
            <h2>Create a New Spot</h2>
            <h3>Where&rsquo;s your place located?</h3>
            <h4>Guests will only get your exact address once they booked a reservation.</h4>
            <form onSubmit={submit}>
                <label>
                    Country
                    <span className="errors spacing">{errors.country}</span>
                    <input
                        type="text"
                        className="spot-input"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder='Country'
                    />
                </label>
                <label>
                    Street Address
                    <span className="errors spacing">{errors.address}</span>
                    <input
                        type="text"
                        className="spot-input"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Street'
                    />
                </label>
                <div className="spot-split">
                    <div className="spot-city">
                        <label>
                            City
                            <span className="errors spacing">{errors.city}</span>
                        </label>
                        <input
                            type="text"
                            className="spot-input"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='City'
                        />
                    </div>
                    <div className="spot-city">
                        <label>
                            State
                            <span className="errors spacing">{errors.state}</span>
                        </label>
                        <input
                            type="text"
                            className="spot-input"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder='State'
                        />
                    </div>
                </div>
                <hr/>
                <h3>Describe your place to guests</h3>
                <h4>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</h4>
                <textarea
                value={description}
                className="spot-textarea"
                onChange={(e) => setDescription(e.target.value)}
                name='description'
                placeholder='Please write at least 30 characters.'
                rows='10'
                ></textarea>
                <span className="errors">{errors.description}</span>
                <hr/>
                <h3>Create a title for your spot</h3>
                <h4>Catch guests&rsquo; attention with a spot title that highlights what makes your place special.</h4>
                <input
                    type="text"
                    className="spot-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Name of your spot'
                />
                <span className="errors">{errors.name}</span>
                <hr></hr>
                <h3>Set a base price for your spot</h3>
                <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>
                <div className="spot-dollar">
                    <div><b>$</b></div>
                    <input
                        type="number"
                        className="spot-input"
                        value={price}
                        onChange={(e) => handlePriceChange(e)}
                        placeholder='Price per night (USD)'
                    />
                </div>
                <span className="errors">{errors.price}</span>
                <hr></hr>
                <h3>Liven up your spot with photos</h3>
                <h4>Submit a link to at least one photo to publish your spot.</h4>
                <input
                    type="text"
                    className="spot-input"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    placeholder='Preview Image URL'
                />
                <span className="errors">{errors.previewImage}</span>
                <input
                    type="text"
                    className="spot-input"
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                    placeholder='Image URL'
                />
                <span className="errors">{errors.image1}</span>
                <input
                    type="text"
                    className="spot-input"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                    placeholder='Image URL'
                />
                <span className="errors">{errors.image2}</span>
                <input
                    type="text"
                    className="spot-input"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                    placeholder='Image URL'
                />
                <span className="errors">{errors.image3}</span>
                <input
                    type="text"
                    className="spot-input"
                    value={image4}
                    onChange={(e) => setImage4(e.target.value)}
                    placeholder='Image URL'
                />
                <span className="errors">{errors.image4}</span>
                <hr></hr>
                <button className="theme-button">Create Spot</button>
            </form>
            </div>
        </div>
    )

}

export default NewSpot