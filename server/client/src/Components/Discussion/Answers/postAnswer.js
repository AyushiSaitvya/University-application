import React from 'react';
import AppRouter from './router/AppRouter';
import '../../entry.css'
import {Button} from "react-bootstrap";

export default function postQuestion(props){
  return(
    <div className="outer">
    <div className="inner">
    <AppRouter questionId={props.questionId} />
    </div>
    </div>
  )
}