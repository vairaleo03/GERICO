// src/utils/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { authState } = useContext(AuthContext);

  if (!authState.token) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(authState.user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
