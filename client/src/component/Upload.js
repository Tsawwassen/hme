import React, { Component } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

import FileReaderHelper from '../class/FileReaderHelper';

class Upload extends Component {
  
    constructor(props){
        super(props);
        this.state = {
            expectedFilePath: {},
            expectedFileData: [],
            actualFilePath: {},
            actualFileData: []
        };

        this.expectedFileOnChange = this.expectedFileOnChange.bind(this);
        this.actualFileOnChange = this.actualFileOnChange.bind(this);

        this.submit = this.submit.bind(this);
        this.testButtonClicked = this.testButtonClicked.bind(this);
        
        this.setExpectedFileData = this.setExpectedFileData.bind(this);
        this.setActualFileData = this.setActualFileData.bind(this);
    }

    testButtonClicked(){  
        console.log(this.state.expectedFileData);
        console.log(this.state.actualFileData);
    }

    setExpectedFileData(data){
        this.setState({expectedFileData: data});
    }

    setActualFileData(data){
        this.setState({actualFileData: data});
    }

    submit(){
       FileReaderHelper.getFileContent(this.state.expectedFilePath, this.setExpectedFileData, "Please select an expected inventory file");
       FileReaderHelper.getFileContent(this.state.actualFilePath, this.setActualFileData, "Please select an actual inventory file");
       
       //TODO : Get the FileData to parent component, and show data on screen
    }

    expectedFileOnChange(e){
        this.setState({expectedFilePath: e.target.files[0]});
    }

    actualFileOnChange(e){
        this.setState({actualFilePath: e.target.files[0]});
    }
    
    render() {
        return (<>
            <h2>Upload COMPONENT</h2>
            <Row>
                <Col>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Input CSV file</Form.Label>
                        <Form.Control type="file" onChange={this.expectedFileOnChange}  />
                        <Form.Control type="file" onChange={this.actualFileOnChange} />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.submit}>Submit</Button>
                    
                </Form>
                </Col>
            </Row>
            <Button variant="primary" type="button" onClick={this.testButtonClicked}>UPLOAD TEST</Button>
        </>);
      };
    }
    export default Upload;