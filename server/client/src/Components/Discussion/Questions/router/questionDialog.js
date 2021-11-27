
import React, { useState, useRef } from 'react';
import {Alert,Button} from "react-bootstrap"


export default function AlertDismissibleExample(props) {
  
  console.log(props.show);
   return(
    <Alert show={props.show} variant="success">
    <Alert.Heading>How's it going?!</Alert.Heading>
    <p>
      Question Posted successfully!!!
    </p>
    <hr />
    <div className="d-flex justify-content-end">
      <Button onClick={() => props.setShow(false)} variant="outline-success">
        Ok
      </Button>
    </div>
  </Alert>
      );
    }