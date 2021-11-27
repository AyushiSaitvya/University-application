
import React from 'react';
import AppRouter from './uploadSolutionRouter/AppRouter';
import '../../entry.css'


export default function Upload(props){
  return(
    <div className="outer">
    <div className="inner">
    <AppRouter  assignmentId={props.assignmentId}/>
    </div>
    </div>
  )
}