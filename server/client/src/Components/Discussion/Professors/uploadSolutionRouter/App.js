import React, { useState, useRef } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {axiosInstance} from "../../../../config"
import { Form, Row, Col, Button } from 'react-bootstrap';
import  AlertDismissibleExample from './uploadDialog';

const App = (props) => {
  
  const [show,setShow]=useState(false); 
  const [file, setFile] = useState(null); // state for storing actual image
  
  
  const [errorMsg, setErrorMsg] = useState('');
  
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadedFile);
    dropRef.current.style.border = '2px dashed #e9ebeb';
  };

  const updateBorder = (dragState) => {
    if (dragState === 'over') {
      dropRef.current.style.border = '2px solid #000';
    } else if (dragState === 'leave') {
      dropRef.current.style.border = '2px dashed #e9ebeb';
    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const regNo=props.auth.user.email.substr(0,11).toUpperCase();
        if (file) {
              console.log('dd')
          const formData = new FormData();
          formData.append('file', file);
          formData.append('regCode', regNo);
          formData.append('assiCode', props.assignmentId);
          
          setErrorMsg('');
          await axiosInstance.post('/api/uploadSolution', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setFile(null);
          // setState({regNo:''});
          setShow(true);
        } else {
          setErrorMsg('Please select a file to add.');
        }
      
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  if(!show)
  {
  return (
    <React.Fragment>
      <Form className="search-form" onSubmit={handleOnSubmit}>
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      
        <div className="upload-section">
          <Dropzone
            onDrop={onDrop}
            onDragEnter={() => updateBorder('over')}
            onDragLeave={() => updateBorder('leave')}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
                <input {...getInputProps()} />
                <p>Drag and drop a file OR click here to select a file</p>
                {file && (
                  <div>
                    <strong>Selected file:</strong> {file.name}
                  </div>
                )}
              </div>
            )}
          </Dropzone>
         
        </div>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      
    </React.Fragment>
  );
          }
          else
          {
                   return(
                     <React.Fragment>
                     <AlertDismissibleExample setShow={setShow} show={show} />
                     </React.Fragment>
                   )

          }
};

App.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps =(state) =>{
  return {
    auth: state.auth,
  
}
};
export default connect(
  mapStateToProps,
  {}
)(App);


