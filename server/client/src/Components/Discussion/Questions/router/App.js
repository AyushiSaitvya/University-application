import React, { useState, useRef } from 'react';
import {axiosInstance} from "../../../../config"
import { Form, Row, Col, Button } from 'react-bootstrap';
import  AlertDismissibleExample from './questionDialog';

const App = (props) => {
  const [show,setShow]=useState(false);  
  const [state, setState] = useState({
    profId:props.profId,
    name: '',
    email:'',
    branch:''
  });
  const [errorMsg, setErrorMsg] = useState('');
  // console.log(props.profId);

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };


  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      const {profId,name,email,branch,question } = state;
      console.log(state)
      if ((name.trim() !== '' && question.trim() !== '')&& (branch.trim() !== ''&&email.trim()!='')) {
          setErrorMsg('');
          await axiosInstance.post('/api/postQuestion',state);
          setShow(true);
        
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
            <Form.Group controlId="name">
              <Form.Control
                type="text"
                name="name"
                value={state.name || ''}
                placeholder="Enter name"
                onChange={handleInputChange}
              />
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
        <Row>
          <Col>
            <Form.Group controlId="email">
              <Form.Control
                type="text"
                name="email"
                value={state.email || ''}
                placeholder="Enter email"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="question">
              <Form.Control as="textarea" rows={5}
                type="text"
                name="question"
                value={state.question || ''}
                placeholder="Enter question"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

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
