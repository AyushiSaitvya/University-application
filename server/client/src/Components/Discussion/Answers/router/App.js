import React, { useState, useEffect } from 'react';
import {axiosInstance} from "../../../../config"
import { Form, Row, Col, Button } from 'react-bootstrap';
import  AlertDismissibleExample from './answerDialog';


const App = (props) => {
  const [show,setShow]=useState(false);  
  const [state, setState] = useState({
    questionId:props.questionId,
    answer:''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    const getAnswer = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/getAnswer/${props.questionId}`);
        setErrorMsg('');
        
        setState({
          ...state,
          answer: data.answer
        });
       
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };
    getAnswer();
  }, []);

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      const {questionId,answer } = state;
      console.log(state)
      if (questionId.trim() !== ''&&answer.trim()!='') {
          setErrorMsg('');
          await axiosInstance.post('/api/postAnswer',state);
          setState({answer:''});
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
            <Form.Group controlId="answer">
              <Form.Control as="textarea" rows={5}
                type="text"
                name="answer"
                value={state.answer || ''}
                placeholder="Enter answer"
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
