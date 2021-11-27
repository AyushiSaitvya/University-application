import React, {useState, useEffect} from 'react'
import { notify } from 'react-notify-toast'
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import {axiosInstance} from "../../config"

 export default function forgotPassword () {
 
  const [confirming,setConfirming]=useState(true)
  
  const [state, setState] = useState({
       email: "",
       errors: {},
  });
  const handleInputChange = event => {
    setState({...state,
    [event.target.name]: event.target.value})
    };

const handleOnSubmit=(e)=>{
  e.preventDefault();
  setState({...state,errors:{}})

  const changePassword = async () => {
    console.log('dsf')
      await axiosInstance.post("/api/forgotPassword", {email:state.email})
    .then(res =>{
      notify.show(res.data.msg)
      

    }).catch(err=>{
        setState({...state,errors:err.response.data})
        console.log(state.errors.email)
    })
   
   
  }
  changePassword();
}
 
    return(
    <div >
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
                error={state.errors.email}
                className={classnames("", {
                    invalid: state.errors.email
                  })}
              />
            </Form.Group>
          </Col>
        </Row>
        <span>
                {state.errors.email}
              </span>
        
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
     </Form> 
    </div>
    )
}

