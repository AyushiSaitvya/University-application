
import React, { useState, useRef } from 'react';
import {Alert,Button} from "react-bootstrap"


export default function AlertDismissibleExample(props) {
  
  console.log(props.show);
   return(
    <Alert show={props.show} variant="success">
    <p>
      File Uploaded successfully!!!
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