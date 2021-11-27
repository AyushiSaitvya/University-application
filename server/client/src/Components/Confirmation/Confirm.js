import React, {useState, useEffect} from 'react'
import { notify } from 'react-notify-toast'
import {axiosInstance} from "../../config"
import { useParams } from 'react-router-dom';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function Confirm () {

  const { id } =useParams();
  console.log(id);

  useEffect(() => {

    const confirmEmail  = async () => {
      await axiosInstance.post("/api/email/confirm", {id})
    .then(res =>{
      notify.show(res.data.msg)
    })
     
    }
    confirmEmail();

  
   
  }, []);
  


    return(
    <div className='confirm'>
      
      
    </div>)
  
}