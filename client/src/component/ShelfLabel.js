import React, { Component } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';

import ShelfLabelPrint from './ShelfLabelPrint.js';

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



  fileOnChange(event){
    //console.log(`file changed ${event.target.files[0].name}`);
    this.setState({filePath: event.target.files[0]});
  }

  handleFileRead(e)  {

    const content = fileReader.result;

    //Remove \r character that appears when file is parsed, then split rows on \n
    const csv = content.replaceAll('\r', '').split('\n');

    //First row is headers
    const headers = csv.shift().split(',');

    /**
     * -Create return table
     * -Add rows to return table, skipping empty rows
     *
     * TODO : this code can probably be cleaned up A LOT, but it is working
     *    The first CSV forEach loop can probably be added into the other forEach loops
     */
    const table = [];
    csv.forEach((row) => {
      if(row === "") return; //skip row if row is empty, will continue parsing the file
      table.push(row.split(','));
    });
    
    const tempData = []
    table.forEach((row, i) => {
      tempData[i] = {};
      row.forEach((cell, j) =>{
        tempData[i][headers[j]] =  cell;
      });
    });
     
    this.setState({fileData: tempData});
  };

  buttonClicked(){ //Not sure if I can put the handleFileRead function code in this block, and reduce the amount of code tracing, but it works.
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
  