
import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const res = await dispatch(sessionActions.login({ credential, password }))

    if(!res?.ok){
      if (res?.errors) {
        return setErrors(res.errors);
      }
    }
    closeModal()
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const res = await dispatch(sessionActions.login({ 
      credential: "Demo-lition", 
      password: "password" 
    }))

    if(!res?.ok){
      if (res?.errors) {
        return setErrors(res.errors);
      }
    }
    closeModal()
  };
  return (
    <>
      <h2>Log In</h2>
        {errors.credential && (
          <p className='errors'>{errors.credential}</p>
        )}
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            className='modal-input'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Username'
            required
          />
        </label>
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
        <button disabled={credential.length < 4 || password.length < 6}  className='modal-button' type="submit">Log In</button>
        <br></br>
        <br></br>
        <hr></hr>
        <button className='modal-theme-button' onClick={handleDemoSubmit} type="submit">Login as Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
