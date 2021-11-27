import React, { useState,useEffect } from "react";
import PropTypes from "prop-types";
import {axiosInstance} from "../../../config"
import { connect } from "react-redux";
import { Form, Row, Col, Button } from 'react-bootstrap';
import { registerUser,setCurrentUser,setError } from "../actions/authActions";
import { notify } from 'react-notify-toast'
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../entry.css'
import _ from 'lodash';

function Register(props) {
  const [state, setState] = useState({
    name: "",
    email: "",
    role:"",
    password: "",
    password2: "",
    errors: {},
  });
  const [sendingEmail,setSendingEmail]=useState(false);
 
  
  useEffect( () => {
    if (props.errors) {
      setState({
        ...state,
        errors: props.errors,
      });
    }
}, [props.errors])


const navigate = useNavigate();
  useEffect( () => {
 console.log(props)
 
    if (props.auth.isAuthenticated) {
      navigate('/discussions/professors');
    }
}, [props.auth.isAuthenticated])

const handleInputChange = event => {
  setState({...state,
  [event.target.name]: event.target.value})
  };
 
const handleClose = () => setShow(false);

const  handleOnSubmit =e => {
    e.preventDefault();
    setSendingEmail(true)
const newUser = {
      name:state.name,
      email:state.email,
      password2:state.password2,
      password:state.password,
      role:state.role
    };

    // props.registerUser(newUser, props.history)
    const registerUser = async () => {
      await axiosInstance.post("/api/register", newUser)
    .then(res =>{
      setSendingEmail(false)
      notify.show(res.data.msg)
      
    })
    .catch(err =>{
      props.setError(err.response.data)
     
    });
    };
    registerUser();
   
  };

const { errors } = state;

return (
 
  <div className="outer">
  <div className="inner">

  <React.Fragment>
      <Form noValidate className="search-form" onSubmit={handleOnSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="name">
              <Form.Control
                type="text"
                name="name"
                value={state.name || ''}
                placeholder="Enter Name"
                onChange={handleInputChange}
                error={errors.name}
                className={classnames("", {
                    invalid: errors.name
                  })}
              />
            </Form.Group>
          </Col>
        </Row>
                <span>
                  {errors.name}
                </span>
        
        <Row>
          <Col>
            <Form.Group controlId="email">
              <Form.Control
                type="text"
                name="email"
                value={state.email || ''}
                placeholder="Enter Email"
                onChange={handleInputChange}
                error={errors.email}
                className={classnames("", {
                    invalid:errors.email })}
              />
            </Form.Group>
          </Col>
        </Row>
        <span>
                {errors.email}
              </span>


        <Row>
          <Col>
            <Form.Group controlId="role">
              <Form.Control as="select"
                type="text"
                name="role"
                value={state.role || ''}
                placeholder="Enter Role"
                onChange={handleInputChange}
                error={errors.role}
                className={classnames("", {
                    invalid: errors.role })}>
                         <option>Select Role</option>             
                        <option value="Student">Student</option>
                        <option value="Professor">Professor</option>
</Form.Control>
             
            </Form.Group>
          </Col>
        </Row>
       
              <span>
                {errors.role}
              </span>

         <Row>
          <Col>
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                name="password"
                value={state.password || ''}
                placeholder="Enter Password"
                onChange={handleInputChange}
                error={errors.password}
                className={classnames("", {
                    invalid: errors.password })}
              />
            </Form.Group>
          </Col>
        </Row>
       
              <span>
                {errors.password}
              </span>     
          <Row>
          <Col>
            <Form.Group controlId="password2">
              <Form.Control
                 type="password"
                 name="password2"
                value={state.password2 || ''}
                placeholder="Confirm Password"
                onChange={handleInputChange}
                error={errors.password2}
                className={classnames("", {
                    invalid: errors.password2 })}
              />
            </Form.Group>
          </Col>
        
        </Row>
        <span>
                {errors.password2}
              </span>
              
        <Button variant="primary" type="submit">
          Submit
        </Button>
    
                <p className="forgot-password text-right">
                    Already a user <a href="/login">logIn?</a>
                </p>
      </Form>

      
    </React.Fragment>
    
    </div>
    </div>
      
    );
  }



Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  setCurrentUser:PropTypes.func.isRequired,
  setError:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps =(state) =>{
  return {
    auth: state.auth,
   errors: state.errors,
}
};
export default connect(
  mapStateToProps,
  { registerUser,setCurrentUser,setError }
)(Register);