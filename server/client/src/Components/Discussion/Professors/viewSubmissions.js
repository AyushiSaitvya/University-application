import React, { useState, useEffect } from 'react';
import download from 'downloadjs';
import {axiosInstance} from "../../../config"
import "../../tables.css"
import PropTypes from "prop-types";
import { connect } from "react-redux";

const SubmissionsList = (props) => {
  const [submissionsList, setSubmissionsList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const getSubmissionsList = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/viewSubmissions/${props.assignmentId}`);
        setErrorMsg('');
        setSubmissionsList(data);
        setLoading(false);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };
    getSubmissionsList();
  }, [loading]);

  const downloadFile = async (regCode,assiCode, path, mimetype) => {
    try {
      const result = await axiosInstance.get(`/api/download/${assiCode}/${regCode}`, {
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

  const removeSolution = async (id,assiCode) => {
    try {
      const { data } = await axiosInstance.delete(`/api/deleteSolution/${assiCode}/${id}`);
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
    
  };

  return (
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
            <th>Registration No.</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissionsList.length > 0 ? (
            submissionsList.map(
              ({ _id, regCode, file_path, file_mimetype }) => (
                <tr key={_id}>
                  <td className="file-title">{regCode}</td>
                  <td>
                   {props.auth.user.role==='Professor'?
                    <button  onClick={() =>
                        downloadFile(regCode,props.assignmentId,file_path, file_mimetype)
                      }>
                      Download
                    </button>:<div></div>
                   }
                    {props.auth.user.email.substr(0,11)===regCode.toLowerCase()?
                    <button  onClick={() =>
                        {
                          setLoading(true);
                          removeSolution(_id,props.assignmentId)
                        }
                      }>
                      Remove
                    </button>:<div></div>
                    }
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={2} style={{ fontWeight: '300' }}>
                No Submissions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>}
    </div>
  );
};

SubmissionsList.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  {}
)(SubmissionsList);

