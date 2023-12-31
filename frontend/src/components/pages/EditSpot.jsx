import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import * as spotActions from '../../store/spots'
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function EditSpot(){
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const sessionUser = useSelector(state => state.session.user);
    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)
    const navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault()
        setSubmitted(!submitted)
    }

    const containsOnlyDigits = (input) => {
        for (let i = 0; i < input.length; i++) {
          const charCode = input.charCodeAt(i);
          if (charCode < 48 || charCode > 57) {
            return false;
          }
        }
        return true;
    }

    const handlePriceChange = (e) => {
        const newValue = e.target.value
        const parsedValue = parseFloat(newValue)
        if(containsOnlyDigits(parsedValue)){
            setPrice(parsedValue)
        }
    }

    let spot = useSelector(state => state.spots)

    useEffect(() => {
        let editSpot = spot[spotId]
        setCountry(editSpot?.country)
        setAddress(editSpot?.address)
        setCity(editSpot?.city)
        setState(editSpot?.state)
        setDescription(editSpot?.description)
        setName(editSpot?.name)
        setPrice(editSpot?.price)
        // hasLoaded.current = true
    }, [spot])

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

            if (Object.keys(errors).length === 0) {
                let lat = 40.010
                let lng = 45.010
                const spot = { name, address, city, state, country, price, description, lat, lng }

                setIsLoading(!isLoading)
                dispatch(spotActions.updateSpot(spotId, spot))
                navigate(`/spots/${spotId}`)
            }

            setErrors(errors)
        }

        checkInputsOnSubmit()
    }, [submitted])

    useEffect(() => {
        // dispatch(spotActions.getSpotsById(spotId))
        dispatch(spotActions.getSpots())
    }, [])

    return(
        <div className="spot-container">
            <div className="spot-form">
            <h2>Update your Spot</h2>
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
                        maxLength={50}
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
                        maxLength={50}
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
                            maxLength={50}
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
                            maxLength={50}
                        />
                    </div>
                </div>
                <hr/>
                <h3>Describe your place to guests</h3>
                <h4>Mention the best features of your space, any special amentities like fast wif or parking, and what you love about the neighborhood</h4>
                <textarea
                value={description}
                className="spot-textarea"
                onChange={(e) => setDescription(e.target.value)}
                name='description'
                placeholder='Description'
                rows='10'
                maxLength={200}
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
                    maxLength={50}
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
                <button className="theme-button">{isLoading ? "Loading..." : "Update your Spot"}</button>
            </form>
            </div>
        </div>
    )
}

export default EditSpot