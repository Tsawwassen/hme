// React imports
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

// Upload component
import Upload from './Upload';

// Variables to change loaded component
const UPLOAD = 0;
const REPORT = 1;

    //-----PLAN OF ACTION ----
    //-----V1----
    //Upload two different CSV files
    //Compare the two files (Both files will have part number and quantity columns)
    //Show report comparing the two files

    //-----V2----
    //Upload expected values (file will contain part number and quantity columns)
    //Scan items and create a list with part number and update quantity as they are scanned
    //Show report comparing the two files

    //----V3----
    //Get expected values from database
    //Scan items and create a list with part number and update quantity as they are scanned
    //Show report comparing the two files

    //----V4----
    //Get expected values from database
    //Scan items and create a list with part number and update quantity as they are scanned
    //Show report comparing the two files and give option to export report

    //TODO : The two variables used to hold the file data should probably be placed somwhere else...
    let EFD = [];
    let AFD = [];
class Inventory extends Component {
  constructor(props){
    super(props);
    this.state = {
      view: UPLOAD
    };

    //Button to test state values
    this.testButtonClicked = this.testButtonClicked.bind(this);

    // Set Functions
    this.setExpectedFileData = this.setExpectedFileData.bind(this);
    this.setActualFileData = this.setActualFileData.bind(this);

    this.checkFileData = this.checkFileData.bind(this);
    
  }

  //Button to test state values
  testButtonClicked(){
    //console.log("Test Button clicked");
    //console.log(this.state.view);
    //this.setState({view: REPORT});
    //console.log(this.state.view);
    //console.log(this.state.excpectedTable);
    //actualFileData([1, 2, 3]);
    //console.log(this.state.expectedFileData);
    //console.log(this.state.actualFileData);
    console.log(EFD);
    console.log(AFD);
  }

  checkFileData(){
    if((EFD.length > 0) || (AFD.length > 0)){
       this.setState({view: REPORT});
    }
  }

  // Set Functions
  setExpectedFileData(data){
    this.checkFileData();
    EFD = data;
  }
  setActualFileData(data){
    this.checkFileData();
    AFD = data;
  }
    
    render() {
      return (<>
        <h1>Inventory Screen</h1>
        {this.state.view === UPLOAD && <Upload setters={[this.setExpectedFileData, this.setActualFileData]} />}
        {this.state.view === REPORT && <h2>REPORT</h2>}
        {/** Test Button to see component state variables */}<br /><Button variant="primary" type="button" onClick={this.testButtonClicked}>INVENTORY TEST</Button>
        </>);
    }
  }
  
  export default Inventory;