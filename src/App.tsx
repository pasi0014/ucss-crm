import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import Donors from './containers/Donors';
import './App.scss';
import { RequireAuth, useIsAuthenticated } from 'react-auth-kit';
import Admin from './Admin';
import SignupCard from './components/RegisterForm';
import Events from './containers/Events';
import EventView from './containers/EventView';
import Reservations from './containers/Reservations';
// import ReservationView from './containers/ReservationView';

function App() {
  const isAuthenticated = useIsAuthenticated();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth loginPath="login">
              <Admin />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route
            path="events"
            element={
              <RequireAuth loginPath="login">
                <Events />
              </RequireAuth>
            }
          />
          <Route
            path="events/:eventId"
            element={
              <RequireAuth loginPath="login">
                <EventView />
              </RequireAuth>
            }
          />
          <Route
            path="/events/:eventId/reservation/:reservationId"
            element={
              <RequireAuth loginPath="login">
                <>ReservationView</>
              </RequireAuth>
            }
          />
          <Route path="donors" element={<Donors />} />
          <Route path="donations" element={<>Donations</>} />
          <Route path="statistics" element={<>Statistics</>} />
          <Route path="clients" element={<>Clients</>} />
          <Route path="reservations" element={<Reservations />} />
        </Route>
        <Route path="*" element={isAuthenticated() ? <Navigate to="/" replace /> : <Navigate to="login" replace />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/" replace /> : <SignupCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
