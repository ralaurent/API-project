import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false);
  const divRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!divRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/")
  };

  const divClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <> 
      <div className='profile-body'>
        {user && (<div onClick={() => navigate("/spots/new")} className='create-spot'>Create a New Spot</div>)}
        <button className="profile" onClick={toggleMenu}>
            <i className="fas fa-bars icons" />
            <i className="fas fa-user-circle icons lrg" />
            <div>test</div>
        </button>
      </div>
      <div className={divClassName} ref={divRef}>
        {user ? (
          <>
            <div>Hello, {user.username}!</div>
            <div>email: {user.email}</div>
            <div>
            <hr></hr>
            <div className='clickable' onClick={() => navigate("/spots/current")}>Manage Spots</div>
            {/* <div className='clickable' onClick={() => navigate("/")}>Manage Reviews</div> */}
            <hr></hr>
              <div className='logout'>
              <button className="theme-button" onClick={logout}>Log Out</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;