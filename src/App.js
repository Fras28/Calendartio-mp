import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComercio, fetchPrestadores, fetchReservas } from './components/redux/slice.jsx';
import Landing from './components/Landing/Landing.jsx';
import EditUser from './components/Results/EditUser.jsx';
import Exito from './components/Results/Exito.jsx';
import SignupCard from './components/Autenticacion/SignUp.jsx';
import SimpleCard from './components/Autenticacion/LogIn.jsx';
import UserProfile from './components/Autenticacion/Perfil.jsx';
import Error from './components/Results/Error.jsx';
import NotFound from './components/Results/NotFound.jsx';
import PaymentForm from './MercadoPago/PaymentForm.jsx';
import PaymentResult from './MercadoPago/PaymentResult.jsx';
import Admin from './components/Admin/Admin.jsx';

// New component for protected routes
const ProtectedRoute = ({ children }) => {
  const role = useSelector(state => state?.reservas?.role);
  
  if (role?.name !== "Admin") {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchComercio());
    dispatch(fetchReservas());
    dispatch(fetchPrestadores());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="/register" element={<SignupCard />} />
        <Route path="/login" element={<SimpleCard />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/editUser" element={<EditUser />} />
        <Route path="/error" element={<Error />} />
        <Route path="/Exito" element={<Exito />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/payment/result" element={<PaymentResult />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;