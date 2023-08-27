import React, { Component } from 'react';

import { Col, Row, Form, Button } from 'react-bootstrap';

let fileReader = new FileReader();

class Upload extends Component {
  
    constructor(props){
        super(props);
        this.state = {
            tempData: [],
            expectedFilePath: {},
            expectedFileData: []//,
            /**actualFilePath: {},
            actualFileData: [] */
        };

        this.expectedFileOnChange = this.expectedFileOnChange.bind(this);
        this.submit = this.submit.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);
        this.testButtonClicked = this.testButtonClicked.bind(this);
        

    }

    testButtonClicked(){
       // console.log(this.state.expectedFilePath);
        console.log(this.state.tempData);
    }

    handleFileRead(e){ 
        /**
        * TODO : this code can probably be cleaned up A LOT, but it is working
        *      The first CSV forEach loop can probably be added into the other forEach loops
        */
        let content = fileReader.result;
        //Upload file kept having \r at the end of a row, and \n at the stat of a row
        //Remove all the \r and split the array on \n
        content = content.replaceAll("\r","");
        const csv = content.split('\n');


        const headers = csv.shift().split(',');
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

        tempData.forEach((row, i)=>{
            //Convert quantity column values to int
            tempData[i].quantity = parseInt(tempData[i].quantity);
        });
     
       // console.log(tempData); // Stub test uploaded data
        //return ("hello world");
        this.setState({tempData: tempData});
        //this.props.onClick(tempData);

    }
    
  
    

    submit(){ //Not sure if I can put the handleFileRead function code in this block, and reduce the amount of code tracing, but it works.
        //console.log(this.state.expectedFilePath);
        //console.log("Submit");
        fileReader.onloadend = this.handleFileRead;
        
        try{
            //fileReader.readAsText(this.state.expectedFilePath);
           fileReader.readAsText(this.state.expectedFilePath);
           
                console.log("temp data read");
                console.log(this.state.tempData);
          
 
            //this.setState(expectedFileData: this.state.tempData);
        } 
        catch(error){ }; //Would be nice to have something better then this try catch
           
           
          
  
    }

    expectedFileOnChange(e){
        //console.log(`file changed ${e.target.files[0].name}`);
        this.setState({expectedFilePath: e.target.files[0]});
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