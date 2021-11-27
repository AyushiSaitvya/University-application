
import React from 'react';
import AppRouter from './router/AppRouter';
import '../../entry.css'


export default function postQuestion(props){
 
  return(
    <div>
      
    <div className="outer">
    <div className="inner">
    
    <AppRouter profId={props.profId}/>
    </div>
    </div>
    </div>
  )
}