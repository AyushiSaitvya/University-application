import React from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Confirm from './Components/Confirmation/Confirm.js';
import ResetPassword from './Components/ResetPassword/Confirm.js';
import Login from './Components/Authentication/auth/Login'
import Register from './Components/Authentication/auth/Register'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Professor from './Components/Discussion/Professors/professor'
import Notifications from 'react-notify-toast'
import jwt_decode from "jwt-decode";
import setAuthToken from "./Components/Authentication/utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./Components/Authentication/actions/authActions";
import ForgotPassword from './Components/ResetPassword/forgotPassword'
import { Provider } from "react-redux";
import store from "./Components/Authentication/stores/stores";




function App() {
   // Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}


  return (
    <Provider store={store}>
    
      <div>
      <div className='container fadein'>
              <Notifications />
      </div>
          <Routes>
            <Route path='/' element={<Login/>} />
            <Route exact path='/confirm/:id' element={<Confirm/>} />
            <Route exact path='/resetPassword/:id' element={<ResetPassword/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/forgotPassword" element={<ForgotPassword/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/discussions/professors" element={<Professor/>} />
          </Routes>
        </div>
     </Provider>
     
    
  );
}

export default App;
