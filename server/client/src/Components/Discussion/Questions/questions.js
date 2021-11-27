import React, { useState, useEffect } from 'react';
import PostAnswer from '../Answers/postAnswer'
import {axiosInstance} from "../../../config"
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../../tables.css";
import ViewAnswer from '../Answers/viewAnswer'
import { Button } from 'react-bootstrap';
import PostQuestion from './postQuestion';


const QuestionsList = (props) => {
  const [questionsList, setQuestionsList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [questionId,setQuestionId]=useState(null);
  const [view,setView]=useState(false);
  const [postAnswer,setPostAnswer]=useState(false);
  const [postQuestion,setPostQuestion]=useState(false);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    const getQuestionsList = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/getAllQuestions/${props.profId}`);
        setErrorMsg('');
        setQuestionsList(data);
        setLoading(false);
        
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };
    getQuestionsList();
  }, [postQuestion,loading]);
  
  const removeQuestion=async(id)=>{
    try {
      const { data } = await axiosInstance.delete(`/api/deleteQuestion/${props.profId}/${id}`);
      
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  }

  if(questionId==null&&postQuestion==false)
  {
  return (
    
    <div>
     <Button onClick={()=>{
                  props.setProfessorId(null)
                  props.setDiscuss(false)
                }}>Go back</Button>
        {props.auth.user.role==='Student'?
       <button  onClick={() =>
                       { 
                         setPostQuestion(true)
                        }
                      }>Post Question
                   </button>:<div></div>
          }

    <div className="files-container">
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}

      {loading?
      <div class="d-flex justify-content-center">
        <div class="spinner-grow text-info" role="status"></div>
        <div class="spinner-grow text-info" role="status"></div>
         <div class="spinner-grow text-info" role="status"></div>
      </div>:<table id="questions">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Branch</th>
            <th>Question</th>
            <th>Action</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {questionsList.length > 0 ? (
            questionsList.map(
              ({ _id, name, email, branch,question }) => (
                <tr key={_id}>
                  <td className="file-title">{name}</td>
                  <td className="file-description">{email}</td>
                  <td className="file-description">{branch}</td>
                  <td className="file-description">{question}</td>

                  <td>
                   
                    <button onClick={() =>{
                          setQuestionId(_id)
                          setView(true)}
                      }>
                      View Answer
                    </button>
                    {props.auth.user.role==='Professor'?
                    <button onClick={() =>
                          {
                            setQuestionId(_id)
                            setPostAnswer(true)
                          }
                      }>
                      Post Answer
                    </button>:<div></div>
                    }
                  </td>
                   
                 <td>
                  <button onClick={()=>{
                        setLoading(true);
                        removeQuestion(_id);
                      }}>
                      Remove
                  </button>
                 </td>
                 
                  

                
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={6} style={{ fontWeight: '300' }}>
                No questions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
}
      
    </div>
    </div>
  );
          }
          else
          {
            if(view)
            {
            return (
              <div>
              <Button onClick={()=>{
                setView(false)
                setQuestionId(null)
                }}>Go back</Button>
                  <ViewAnswer questionId={questionId} />
              </div>
            )
            }
            else if(postQuestion)
            {
              return (
                        <div>
                          <Button onClick={()=>{
                            setPostQuestion(false)
                          setQuestionId(null)
                }}>Go back</Button>
                           <PostQuestion profId={props.profId} />
                          </div>
                       )
            }
            else
            {
              return (
                <div>
                     <Button onClick={()=>{
                       setPostAnswer(false)
                       
                     }}>Go back</Button>
                     <PostAnswer questionId={questionId} />
                </div>
              )

            }
            
          }
};
QuestionsList.propTypes = {
  auth: PropTypes.object.isRequired,
 
  
};
const mapStateToProps = state => ({
  auth: state.auth,
  
});
export default connect(
  mapStateToProps,
  {}
)(QuestionsList);

