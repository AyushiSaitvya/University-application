import React, { useState, useEffect } from 'react';
import {axiosInstance} from "../../../config"
import PropTypes from "prop-types";
import "../../tables.css"
import {useNavigate} from "react-router-dom";
import Question from '../Questions/questions';
import { connect } from "react-redux";
import { logoutUser } from "../../Authentication/actions/authActions";
import Upload from './uploadAssignment'
import AssignmentList from './assignmentList'
import {Button} from 'react-bootstrap'



const ProfessorsList = (props) => {
  const [professorsList, setProfessorsList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [professorId,setProfessorId]=useState(null);
  const [discuss,setDiscuss]=useState(false);
  const [upload,setUpload]=useState(false);
  const [viewAssignment,setViewAssignment]=useState(false);
  const [loading,setLoading]=useState(true)
  


  const navigate=useNavigate();

  const onLogoutClick = e => {
    e.preventDefault();
    props.logoutUser();
    navigate("/login")

  };
  useEffect(() => {
    
    const getProfessorsList = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/getAllProfessors`);
        setErrorMsg('');
        setLoading(false);
        setProfessorsList(data);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };
    getProfessorsList();
  }, []);



  if(professorId==null)
{  return (
      
    <div className="files-container">
    <Button onClick={onLogoutClick}>
              Logout
      </Button>
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      {loading?
      <div class="d-flex justify-content-center">
        <div class="spinner-grow text-info" role="status"></div>
        <div class="spinner-grow text-info" role="status"></div>
         <div class="spinner-grow text-info" role="status"></div>
      </div>:
      <table id="professors">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Email</th>
            <th>Discussion</th>
            <th>Assignment</th>
          </tr>
        </thead>
        <tbody>
          {professorsList.length > 0 ? (
            professorsList.map(
              ({ _id, name, department, email}) => (
                <tr key={_id}>
                  <td className="file-title">{name}</td>
                  <td className="file-description">{department}</td>
                  <td className="file-description">{email}</td>
                  <td>
                   {
                     (props.auth.user.role!=='Professor' || props.auth.user.email==email)?
                    <button onClick={() =>
                        {setProfessorId(email)
                        setDiscuss(true)}
                      }>Discuss
                   </button>:<div></div>
                   }
                  </td>
              
                  <td>
                 {(props.auth.user.role==='Professor'&& props.auth.user.email==email)?
                    <button  onClick={() =>
                        {
                          setProfessorId(email)
                          setUpload(true)
                        }
                      }>Upload Assignment
                   </button>:<div></div>
                    }
                    {
                     (props.auth.user.role!=='Professor' || props.auth.user.email==email)?
                   <button onClick={() =>
                        {
                          setProfessorId(email)
                          setViewAssignment(true)
                        }
                      }>View Assignments
                   </button>:<div></div>
                   }
                  </td>

                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={5} style={{ fontWeight: '300' }}>
                No files found. Please add some.
              </td>
            </tr>
          )}
        </tbody>
      </table>}
      
    </div>
  );
          }
          else{
            if(discuss)  
            return (
              <div>
               
                <Question profId={professorId} setProfessorId={setProfessorId} setDiscuss={setDiscuss}/>
              </div>  
            )
            else if(upload)
            {
              return (
                <div>
                 <Button onClick={()=>{
                   setProfessorId(null)
                   setUpload(false)
                   }}>Go back</Button>
                <Upload profId={professorId} />
                 </div>
              )
            }
            else 
            {
              return (
                <div>
                <AssignmentList profId={professorId} setProfessorId={setProfessorId}
                setViewAssignment={setViewAssignment} />
                 </div>
              )
            }
          }
};

ProfessorsList.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,

});
export default connect(
  mapStateToProps,
  { logoutUser}
)(ProfessorsList);


