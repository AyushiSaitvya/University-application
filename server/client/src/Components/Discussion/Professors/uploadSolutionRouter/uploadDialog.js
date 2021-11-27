
import React, { useState, useRef } from 'react';
import {Alert,Button} from "react-bootstrap"


export default function AlertDismissibleExample(props) {
  
  
   return(
    <Alert show={props.show} variant="success">
    <p>
      Solution Uploaded successfully!!!
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