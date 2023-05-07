import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import Login from './containers/Login';

import Dashboard from './containers/Dashboard';
import Donors from './containers/Donors';

import './App.scss';
import { RequireAuth, useAuthUser } from 'react-auth-kit';
import Admin from './Admin';
import SignupCard from './components/RegisterForm';
import Events from './containers/Events';

function App() {
  const auth = useAuthUser();

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
            path="/events"
            element={
              <RequireAuth loginPath="login">
                <Events />
              </RequireAuth>
            }
          />
          <Route path="/donors" element={<Donors />} />
        </Route>
        <Route path="*" element={auth()?.email ? <Navigate to="/" replace /> : <Navigate to="login" replace />} />

        <Route path="/login" element={auth()?.email ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={auth()?.email ? <Navigate to="/" replace /> : <SignupCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
