import React, { Component } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';

import ShelfLabelPrint from './ShelfLabelPrint.js';

import FileReaderHelper from '../class/FileReaderHelper';


let fileReader = new FileReader();

class ShelfLabel extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      filePath: {},
      fileData: []
    };

    this.fileOnChange = this.fileOnChange.bind(this);
    this.buttonClicked = this.buttonClicked.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
  }

  //Handle file selected on change
  fileOnChange(event){
    //console.log(`file changed ${event.target.files[0].name}`);
    this.setState({filePath: event.target.files[0]});
  }

  //Read file of given file path
  handleFileRead(e)  {
    /**
     * --==DEV NOTE==-- 
     * fileReader.result returns content of file
     * Keeping the middle variable here for future reference, but sending it dirently to parse CSV helper function
     * 
     * TODO : this code can probably be cleaned up A LOT, but it is working
     *    The first CSV forEach loop can probably be added into the other forEach loops
    */
    //const content = fileReader.result;
    this.setState({fileData: FileReaderHelper.ParseCSV(fileReader.result)});
  };

  // Parse file when button is clicked
  buttonClicked(){ 
    fileReader.onloadend = this.handleFileRead;
  
   try{
     fileReader.readAsText(this.state.filePath);
    } catch(error){ }; //Would be nice to have something better then this try catch
  }

  render() {
    return (<>
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
  