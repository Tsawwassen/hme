// React imports
import React, { Component } from 'react';
import { Col, Row, Form, Button, Alert  } from 'react-bootstrap';

// Helper Class
import ReportMapperHelper from '../class/ReportMapperHelper';
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
            errorMessage: ""
            
        };

        // OnChange functions
        this.expectedFileOnChange = this.expectedFileOnChange.bind(this);
        this.actualFileOnChange = this.actualFileOnChange.bind(this);

        //Submit function
        this.submit = this.submit.bind(this);
    }

    // Submit input files paths to be parsed
    //TODO : Check file paths here, and show error if needed before going into ReportMapperHelper
    submit(){  
        let validExpFile = FileReaderHelper.validFileCheck(this.state.expectedFilePath);   
        let validActFile = FileReaderHelper.validFileCheck(this.state.actualFilePath);  

        if(validExpFile.status && validActFile.status){                            
            ReportMapperHelper.getDoubleFileContent(this.state.expectedFilePath, 
                this.state.actualFilePath,
                this.props.setters, 
                );
        } else {
            //show error message
            // Not the cleanest error message handeling, but needed to consider that one file is valid and the other is not
            let msg = "";
            if(!validExpFile.status) msg = validExpFile.message;
            else msg = validActFile.message;
            this.setState({errorMessage: msg});
        }      
       
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
        {(this.state.errorMessage !== "") && <Alert variant="danger">
                                <Alert.Heading>Error</Alert.Heading>
                                <p>
                                    {this.state.errorMessage}
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button onClick={() =>  this.setState({errorMessage: ""})} >
                                        Close me
                                    </Button>
                                </div>
                            </Alert>}
            <h2>Upload V1 COMPONENT</h2>
            <Row>
                <Col>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>WW Export File</Form.Label>
                        <Form.Control type="file" onChange={this.expectedFileOnChange}  />
                        <Form.Label>Scanned Inventory File</Form.Label>
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