import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {axiosInstance} from "../../../config"

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,

} from "./types";

// Register User
export  const registerUser =(userData, history) => dispatch => {
 
  axiosInstance
    .post("/api/register", userData)
    .then(res =>{
      // res.json();
      console.log(res.data)
      return res.data.msg;
     
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });

    return '';
    };


// Login - get user token

 export  const loginUser =(userData) =>( dispatch) => {
   console.log('ds');
     axiosInstance
    .post("/api/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
     
     
      dispatch(setCurrentUser(decoded));
      
      
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );

};


// Set logged in user
export const setCurrentUser = decoded => {

  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
export const setError = decoded =>dispatch=> {


    dispatch({
      type: GET_ERRORS,
      payload: decoded
    });
}



// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};


// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};



