import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import App from './App';



const AppRouter = (props) => (
  
    <div className="container">
    
      <div className="main-content">
      <App  questionId={props.questionId} />
      </div>
    </div>
  
  
);

export default AppRouter;
