import React, { useState, useEffect } from 'react';
import {axiosInstance} from "../../../config"



export default function Answer(props){
  const [errorMsg, setErrorMsg] = useState('');
  const [answer,setAnswer]=useState('');

  useEffect(() => {
    const getAnswer = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/getAnswer/${props.questionId}`);
        setErrorMsg('');
        
        setAnswer(data.answer);
        console.log(data.answer);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };
    getAnswer();
  }, []);

  
  return (
    <div>
   
    <div className="files-container">
      <div>{answer}</div>
    </div>
    </div>
  );
        
}



