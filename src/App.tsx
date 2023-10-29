import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { RequireAuth, useIsAuthenticated } from 'react-auth-kit';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import SignupCard from './components/RegisterForm';
import EventView from './containers/EventView';
import ReservationView from './containers/ReservationView';
import ClientPage from './containers/ClientPage';
import Admin from './Admin';
const Donors = React.lazy(() => import('./containers/Donors'));
const Events = React.lazy(() => import('./containers/Events'));
const Reservations = React.lazy(() => import('./containers/Reservations'));
const Clients = React.lazy(() => import('./containers/Clients'));
const ProfileView = React.lazy(() => import('./containers/ProfileView'));
const Donations = React.lazy(() => import('./containers/Donations'));

import './App.scss';
import LoadingPage from './components/LoadingPage';

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
          <Route
            path="/"
            element={
              <Suspense>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="events"
            element={
              <RequireAuth loginPath="login">
                <Suspense fallback={<LoadingPage />}>
                  <Events />
                </Suspense>
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
          <Route path="events/create" element={<>test</>} />
          <Route
            path="/events/:eventId/reservation/:reservationId"
            element={
              <RequireAuth loginPath="login">
                <ReservationView />
              </RequireAuth>
            }
          />
          <Route
            path="clients"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Clients />
              </Suspense>
            }
          />
          <Route
            path="clients/:clientId"
            element={
              <RequireAuth loginPath="login">
                <ClientPage />
              </RequireAuth>
            }
          />
          <Route
            path="donors"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Donors />
              </Suspense>
            }
          />
          <Route
            path="donations"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Donations />
              </Suspense>
            }
          />
          <Route path="donations/list" element={<>DonationList</>} />
          {/* <Route path="statistics" element={<>Statistics</>} /> */}
          <Route
            path="reservations"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Reservations />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProfileView authState={null} />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            isAuthenticated() ? <Navigate to="/" replace /> : <Navigate to="login" replace />
          }
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <SignupCard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
