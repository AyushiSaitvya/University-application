import React, { useState, useEffect } from 'react';
import download from 'downloadjs';
import UploadSolution from './uploadSolution'
import ViewSubmission from './viewSubmissions'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from 'react-bootstrap';
import {axiosInstance} from "../../../config"
import "../../tables.css"


const AssignmentList = (props) => {
  const [assignmentList, setAssignmentList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitAssignment,setSubmitAssignment]=useState('');
  const [viewAssignment,setViewAssignment]=useState('');
  const [assignmentId,setAssignmentId]=useState(null);
  const [loading,setLoading]=useState(true)
   useEffect(() => {
    
    const getAssignmentList = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/getAllAssignments/${props.profId}`);
        setErrorMsg('');
        setAssignmentList(data);
        setLoading(false);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };
    getAssignmentList();
  }, [loading]);

  const downloadFile = async (assiId,code, path, mimetype) => {
    try {
      const result = await axiosInstance.get(`/api/downloadAssignment/${code}/${assiId}`, {
        responseType: 'blob'
      });
      const split = path.split('/');
      const filename = split[split.length - 1];
      setErrorMsg('');
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while downloading file. Try again later');
      }
    }
  };

  
  const deleteAssignment = async (id,code) => {
    try {
      const { data } = await axiosInstance.delete(`/api/deleteAssignment/${code}/${id}`);
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }

  };

  if(assignmentId==null)
  {
  return (
    <div>
      <Button onClick={()=>{
                  props.setProfessorId(null)
                  props.setViewAssignment(false)
                }}>Go back
                </Button>
    <div className="files-container">
    
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      {loading?
      <div class="d-flex justify-content-center">
        <div class="spinner-grow text-info" role="status"></div>
        <div class="spinner-grow text-info" role="status"></div>
         <div class="spinner-grow text-info" role="status"></div>
      </div>:
      <table id="assignments">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Course</th>
            <th>Branch</th>
            <th>Last date</th>
            <th>See</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {assignmentList.length > 0 ? (
            assignmentList.map(
              ({ _id, title, year,course,submissionDate,branch,file_path,file_mimetype }) => (
                <tr key={_id}>
                  <td className="file-title">{title}</td>
                  <td className="file-description">{year}</td>
                  <td className="file-description">{course}</td>
                  <td className="file-description">{branch}</td>
                  <td className="file-description">{submissionDate}</td>
                  <td>
                   
                    <button onClick={() =>
                       {
                            setViewAssignment(true)
                            setAssignmentId(_id)
                       }
                      }>
                      View Submissions
                    </button>
                    {props.auth.user.role==='Student'?
                    <button  onClick={() =>
                       {
                            setSubmitAssignment(true)
                            setAssignmentId(_id)
                       }
                      }>
                       Submit Assignment
                    </button>:<div></div>
                    }
                    {props.auth.user.role==='Professor'?
                    <button onClick={() =>
                         {
                            setLoading(true);
                            const code=year+course+branch+props.profId;
                            deleteAssignment(_id,code);
                         }
                        
                      }>
                       Remove Assignment
                    </button>:<div></div>
                    }
                  </td>
                  <td>
                  <button onClick={() =>
                         {
                            const code=year+course+branch+props.profId;
                            downloadFile(_id,code,file_path, file_mimetype);
                         }
                        
                      }>
                       Download Assignment
                    </button>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={3} style={{ fontWeight: '300' }}>
                No files found.
              </td>
            </tr>
          )}
        </tbody>
      </table>}
    </div>
    </div>
  );
}
 else
 {
    if(submitAssignment)
     return(
       <div>
          <Button onClick={()=>{
                  setAssignmentId(null)
                  setSubmitAssignment(false)
                }}>Go back
                </Button>
         <UploadSolution assignmentId={assignmentId}/>
         </div>
     )
     else
     return(
       <div>
          <Button onClick={()=>{
                  setAssignmentId(null)
                  setViewAssignment(false)
                }}>Go back
                </Button>
        <ViewSubmission assignmentId={assignmentId}/>
        </div>
  )
        
 }
};
AssignmentList.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,

});
export default connect(
  mapStateToProps,
  {}
)(AssignmentList);




