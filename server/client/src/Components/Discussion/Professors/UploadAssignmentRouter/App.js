import React, { useState, useRef } from 'react';
import Dropzone from 'react-dropzone';
import {axiosInstance} from "../../../../config"
import { Form, Row, Col, Button } from 'react-bootstrap';
import  AlertDismissibleExample from './uploadDialog';

const App = (props) => {
  
  const [show,setShow]=useState(false); 
  const [file, setFile] = useState(null); // state for storing actual image
  const [state, setState] = useState({
    title:'',  
    year: '',
    course: '',
    branch:'',
    profId:props.profId
  });
  const [errorMsg, setErrorMsg] = useState('');
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

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
      const { title, year,course,branch,profId } = state;
      if ((title.trim() !== '' && year.trim() !== '')
      &&(course.trim() !== '' && branch.trim() !== '')) {
        if (file) {

          const formData = new FormData();
          const code=year+course+branch+profId;
          formData.append('file', file);
          formData.append('title', title);
          formData.append('code', code);
          
          setErrorMsg('');
          await axiosInstance.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setFile(null);
          // setState({title:'',year:'',course:'',branch:''});
          setShow(true);
        } else {
          setErrorMsg('Please select a file to add.');
        }
      } else {
        setErrorMsg('Please enter all the field values.');
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
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Control
                type="text"
                name="title"
                value={state.title || ''}
                placeholder="Enter title"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="year">
              <Form.Control as="select"
                type="text"
                name="year"
                value={state.year || ''}
                placeholder="Enter year"
                onChange={handleInputChange}
              >
                         <option>Select Year</option>             
                         <option value="2018">2018</option>
                         <option value="2019">2019</option>
                         <option value="2020">2020</option>
                         <option value="2021">2021</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="course">
              <Form.Control as="select"
                type="text"
                name="course"
                value={state.course || ''}
                placeholder="Enter course"
                onChange={handleInputChange}
              >
                      <option>Select Course</option>             
                      <option value="UG">UG</option>
                      <option value="PG">PG</option>
                        
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="branch">
            <Form.Control  as="select"
                type="text"
                name="branch"
                value={state.branch || ''}
                placeholder="Enter branch"
                onChange={handleInputChange}
              >
                        <option>Select Branch</option>             
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="MME">MME</option>
                        <option value="PIE">PIE</option>
             </Form.Control>    
            </Form.Group>
          </Col>
        </Row>
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

export default App;

