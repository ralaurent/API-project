import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';

import Spots from './components/pages/Spots'
import SingleSpot from './components/pages/SingleSpot'
import CurrentSpot from './components/pages/CurrentSpot'
import NewSpot from './components/pages/NewSpot'
import EditSpot from './components/pages/EditSpot'

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots/>
      },
      {
        path: '/spots/:spotId',
        element: <SingleSpot/> 
      },
      {
        path: '/spots/new',
        element: <NewSpot/>
      },
      {
        path: '/spots/current',
        element: <CurrentSpot/>
      },
      {
        path: '/spots/:spotId/edit',
        element: <EditSpot/>
      },
      {
        path: '*',
        element: <h1>404</h1>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;