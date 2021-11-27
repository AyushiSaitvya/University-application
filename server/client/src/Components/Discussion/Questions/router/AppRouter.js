import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import App from './App';



const AppRouter = (props) => (
  
    <div className="container">
    
      <div className="main-content">
      <App  profId={props.profId} />
      </div>
    </div>
  
  
);

export default AppRouter;
