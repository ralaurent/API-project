import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      const res = await dispatch(sessionActions.signup({
        email,
        username,
        firstName,
        lastName,
        password,
      }));

      if(!res?.ok){
        if (res?.errors) {
          return setErrors(res.errors);
        }
      }
      closeModal()
      navigate("/")
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            className='modal-input'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
        </label>
        {errors.email && <p className='errors'>{errors.email}</p>}
        <label>
          Username
          <input
            className='modal-input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
            required
          />
        </label>
        {errors.username && <p className='errors'>{errors.username}</p>}
        <label>
          First Name
          <input
            className='modal-input'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
            required
          />
        </label>
        {errors.firstName && <p className='errors'>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            className='modal-input'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
            required
          />
        </label>
        {errors.lastName && <p className='errors'>{errors.lastName}</p>}
        <label>
          Password
          <input
            className='modal-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        </label>
        {errors.password && <p className='errors'>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            className='modal-input'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className='errors'>{errors.confirmPassword}</p>
        )}
        <button disabled={!email.length || !username.length || !firstName.length || !lastName.length || !password.length || !confirmPassword.length || username.length < 4 || password.length < 6} className='modal-button' type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;