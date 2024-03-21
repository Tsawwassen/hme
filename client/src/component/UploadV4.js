// React imports
import React, { Component } from 'react';
import { Col, Row, Form, Button, Alert  } from 'react-bootstrap';

// Helper Class
import ReportMapperHelper from '../class/ReportMapperHelper';
import FileReaderHelper from '../class/FileReaderHelper';

// UploadV3 component
// Trying to do something with 3 files. Goal is to make the output report look like the finished one we currently do for inventory
// The three files are 
//      - Parts Count
//      - Unit Count
//      - Scanned Count
class UploadV4 extends Component {
  
    // Store two file paths and two file data as JSON array
    constructor(props){
        super(props);
        this.state = {
            PCFilePath: {},
            UnitFilePath:{},
            ScannedFilePath:{},
            errorMessage: ""
        };

        // OnChange functions
        this.PCFileOnChange = this.PCFileOnChange.bind(this);
        this.UnitFileOnChange = this.UnitFileOnChange.bind(this);
        this.ScannedFileOnChange = this.ScannedFileOnChange.bind(this);

        //Submit function
        this.submit = this.submit.bind(this);

        
    }

    // Submit input files paths to be parsed
    submit(){  
        let validPCFile = FileReaderHelper.validFileCheck(this.state.PCFilePath);
        let validUnitFile = FileReaderHelper.validFileCheck(this.state.UnitFilePath);
        let validScannedFile = FileReaderHelper.validFileCheck(this.state.ScannedFilePath);
        
        if(validPCFile.status && validUnitFile.status && validScannedFile.status  ){
            
            ReportMapperHelper.getTripleFileContent(this.state.PCFilePath,
                                                    this.state.UnitFilePath, 
                                                    this.state.ScannedFilePath, 
                                                    this.props.setters, 
                                                );
       } else {
        //show error message
        this.setState({errorMessage: validPCFile.message + '\n' + validUnitFile.message  + '\n' +  validScannedFile.message });
       }
    }

    // OnChange functions
    PCFileOnChange(e){
        this.setState({PCFilePath: e.target.files[0], errorMessage:""});
    }
    UnitFileOnChange(e){
        this.setState({UnitFilePath: e.target.files[0], errorMessage:""});
    }
    ScannedFileOnChange(e){
        this.setState({ScannedFilePath: e.target.files[0], errorMessage:""});
    }



    // Render one file input, text field to add part numbers, and table for added part numbers and submit button.
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
            <h2>Upload V4 COMPONENT</h2>
            <Row>
                <Col>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>WW Parts Count File</Form.Label>
                        <Form.Control type="file" onChange={this.PCFileOnChange}  />
                        <Form.Label>Unit Count File</Form.Label>
                        <Form.Control type="file" onChange={this.UnitFileOnChange}  />
                        <Form.Label>Scanned Count File</Form.Label>
                        <Form.Control type="file" onChange={this.ScannedFileOnChange}  />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.submit}>Submit</Button>
                </Form>
                </Col>
            </Row>
        </>);
      };
    }
    export default UploadV4;