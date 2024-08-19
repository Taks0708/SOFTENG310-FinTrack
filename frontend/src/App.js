import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import axios from 'axios';
import { TransactionContextProvider } from './context/TransactionContextProvider.jsx';


function App() {

  // This interceptor adds the Authorization header to all requests if a token is present in local storage
  axios.interceptors.request.use ( (config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* If the user is logged in, redirect them to the dashboard, otherwise redirect them to the login page. This way
            already logged in users won't have to keep re-loggin in. */}
      <Route path="/" element={localStorage.getItem("token") ? <Navigate to="/dashboard" replace={true} /> : <Navigate to="/login" replace={true} />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard" element={
          <TransactionContextProvider>
          <Dashboard />
          </TransactionContextProvider> // context provider gives access to the context in the dashboard
          } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
