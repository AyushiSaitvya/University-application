
import React from 'react';
import AppRouter from './UploadAssignmentRouter/AppRouter';
import '../../entry.css'
import { Button } from 'react-bootstrap';


export default function Upload(props){
  return(
    <div>
    
    <div className="outer">
    <div className="inner">
    <AppRouter  profId={props.profId}/>
    </div>
    </div>
    </div>
  )
}