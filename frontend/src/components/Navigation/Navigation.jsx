import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from '../../images/logo.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
        <NavLink exact to="/"><img src={logo} className='logo' alt='logo'/></NavLink>
      {isLoaded && (
        <ProfileButton user={sessionUser} />
      )}
    </nav>
  );
}

export default Navigation;