// React imports
import React, { Component } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

// Helper Class
import FileReaderHelper from '../class/FileReaderHelper';

// Upload component
// Render two file inputs, and submit button
class Upload extends Component {
  
    // Store two file paths and two file data as JSON array
    constructor(props){
        super(props);
        this.state = {
            expectedFilePath: {},
            actualFilePath: {},
        };

        // OnChange functions
        this.expectedFileOnChange = this.expectedFileOnChange.bind(this);
        this.actualFileOnChange = this.actualFileOnChange.bind(this);

        //Submit function
        this.submit = this.submit.bind(this);
    }

    // Submit input files paths to be parsed
    submit(){       
       FileReaderHelper.getFileContent(this.state.expectedFilePath, 
                                        this.state.actualFilePath,
                                        this.props.setters, 
                                        "Please select an expected inventory file",
                                        "Please select an actual inventory file"
                                        );
      
       
    }

    // OnChange functions
    expectedFileOnChange(e){
        this.setState({expectedFilePath: e.target.files[0]});
    }
    actualFileOnChange(e){
        this.setState({actualFilePath: e.target.files[0]});
    }
    
    // Render two file inputs and submit button.
    render() {
        return (<>
            <h2>Upload COMPONENT</h2>
            <Row>
                <Col>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Expected Inventory file</Form.Label>
                        <Form.Control type="file" onChange={this.expectedFileOnChange}  />
                        <Form.Label>Actual Inventory file</Form.Label>
                        <Form.Control type="file" onChange={this.actualFileOnChange} />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.submit}>Submit</Button>
                </Form>
                </Col>
            </Row>
        </>);
      };
    }
    export default Upload;