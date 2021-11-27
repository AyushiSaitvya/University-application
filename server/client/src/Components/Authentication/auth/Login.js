import React, { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser,setCurrentUser } from "../actions/authActions";
import { Form, Row, Col, Button } from 'react-bootstrap';
import classnames from "classnames";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../entry.css'

function Login(props) {
  
  const [state, setState] = useState({
    
    email: "",
    password: "",
    errors: {},
  });

const navigate = useNavigate();

useEffect( () => {
  if (props.errors) {
    setState({
      ...state,
      errors: props.errors,
    });
  }
}, [props.errors])

useEffect( () => {
  console.log(props)
     if (props.auth.isAuthenticated) {
      navigate("/discussions/professors")
     }
 }, [props.auth.isAuthenticated])
  

  
const handleInputChange = e => {
  setState({...state,
    [event.target.name]: event.target.value})
  };
const handleOnSubmit = e => {
    e.preventDefault();
    console.log('dsds')
const userData = {
      email:state.email,
      password:state.password
    };
    
    props.loginUser(userData);

};
    const { errors } = state;  
    console.log(errors)
  
return (
  

  <div className="outer">
  <div className="inner">

  <React.Fragment>
      <Form noValidate className="search-form" onSubmit={
        handleOnSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="email">
              <Form.Control
                type="text"
                name="email"
                value={
                  state.email || ''}
                placeholder="Enter Email"
                onChange={
                  handleInputChange}
                error={errors.email}
                className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
              />
            </Form.Group>
          </Col>
        </Row>
                <span>
                  {errors.email}
                  {errors.emailnotfound}
                </span>
        
        <Row>
          <Col>
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                name="password"
                value={
                  state.password || ''}
                placeholder="Enter Password"
                onChange={
                  handleInputChange}
                error={errors.password}
                className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
              />
            </Form.Group>
          </Col>
        </Row>
       
              <span>
                {errors.password}
                {errors.passwordincorrect}
              </span>
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <p className="forgot-password text-right">
                    Forgot <a href="/forgotPassword">password?</a>
                </p>

                <p className="forgot-password text-right">
                    New User <a href="/register">signUp?</a>
                </p>
      </Form>

      
    </React.Fragment>

     </div>
     </div>
      
    );
  }

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  setCurrentUser:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginUser,setCurrentUser }
)(Login);