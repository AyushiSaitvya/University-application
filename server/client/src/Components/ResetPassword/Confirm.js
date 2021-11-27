import React, {useState, useEffect} from 'react'
import { notify } from 'react-notify-toast'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useParams } from 'react-router-dom';
import classnames from "classnames";
import { Form, Row, Col, Button } from 'react-bootstrap';
import {axiosInstance} from "../../config"

 function Confirm () {
 
  const [confirming,setConfirming]=useState(true)
  const { id } =useParams();
  const [state, setState] = useState({
       password: "",
       errors: {},
  });
  const handleInputChange = event => {
    setState({...state,
    [event.target.name]: event.target.value})
    };

    useEffect( () => {
      if (props.errors) {
        setState({
          ...state,
          errors: props.errors,
        });
      }
    }, [props.errors])   

const handleOnSubmit=(e)=>{
  e.preventDefault();
  const resetPassword  = async () => {
    console.log('ds')
    await axiosInstance.post("/api/email/resetPassword", {id,password:state.password})
  .then(res =>{
    
    notify.show(res.data.msg)
  })
   
  }
  resetPassword();
};
  
const {errors}=state

    return(
    <div >
      <Form noValidate className="search-form" onSubmit={
        handleOnSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                name="password"
                value={
                  state.password || ''}
                placeholder="Enter New Password"
                onChange={
                  handleInputChange}
                error={errors.password}
                className={classnames("", {
                    invalid: errors.password
                  })}
              />
            </Form.Group>
          </Col>
        </Row>
              <span>
                {errors.password}
              </span>
        <Button variant="primary" type="submit">
          Submit
        </Button>
     </Form> 
    </div>
    )
  
}

Confirm.propTypes = {
 
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors
});
export default connect(
  mapStateToProps,
  {}
)(Confirm);