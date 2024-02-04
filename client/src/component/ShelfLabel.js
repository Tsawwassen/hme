import React, { Component } from 'react';
import { Col, Container, Row, Form, Button, Alert } from 'react-bootstrap';

import ShelfLabelPrint from './ShelfLabelPrint.js';

import FileReaderHelper from '../class/FileReaderHelper';
import ReportMapperHelper from '../class/ReportMapperHelper.js';

class ShelfLabel extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      filePath: {},
      fileData: [],
      errorMessage: ""
    };

    this.fileOnChange = this.fileOnChange.bind(this);
    this.buttonClicked = this.buttonClicked.bind(this);
 
  }

  //Handle file selected on change
  fileOnChange(event){
    //console.log(`file changed ${event.target.files[0].name}`);
    this.setState({filePath: event.target.files[0], errorMessage:""});
  }


  // Parse file when button is clicked
  async buttonClicked(){
    let validFile = FileReaderHelper.validFileCheck(this.state.filePath);

    if(validFile.status){
      this.setState({fileData: FileReaderHelper.ParseCSV( await ReportMapperHelper.readUploadedFileAsText(this.state.filePath))});
    } else {
      //show error message
      this.setState({errorMessage: validFile.message});
     }
  }

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
        {this.state.fileData.length === 0 && <Container>
            <Row>
                <Col>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Input CSV file</Form.Label>
                        <Form.Control type="file" onChange={this.fileOnChange}  />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.buttonClicked}>Submit</Button>
                </Form>
                </Col>
            </Row>
        </Container>}
        {this.state.fileData.length > 0 && <ShelfLabelPrint table={this.state.fileData}/>}
    </>);
  };
}
  export default ShelfLabel;
  