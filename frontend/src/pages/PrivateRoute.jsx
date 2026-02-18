import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // നിങ്ങളുടെ ലോഗിൻ സിസ്റ്റം അനുസരിച്ച് ഇത് മാറ്റുക (ഉദാഹരണത്തിന് localStorage-ൽ ടോക്കൺ ഉണ്ടോ എന്ന് നോക്കാം)
  const isAuthenticated = localStorage.getItem('token'); 

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;