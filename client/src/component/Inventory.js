import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import Upload from './Upload';


const  UPLOAD = 0;
const  REPORT = 1;

class Inventory extends Component {
  constructor(props){
    super(props);
    this.state = {
      expectedFilePath: {},
      expectedFileData: [],
      excpectedTable:[],
      view: UPLOAD
    };

    this.testButtonClicked = this.testButtonClicked.bind(this);
  }

  //Button to test state values
  testButtonClicked(){
    console.log("Test Button clicked");
    console.log(this.state.view);
    this.setState({view: REPORT});
    console.log(this.state.view);
    console.log(this.state.excpectedTable);
  }
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
    render() {
      return (<>
        <h1>Inventory Screen</h1>
        {this.state.view === UPLOAD && <Upload />}
        {this.state.view === REPORT && <h2>REPORT</h2>}
        <br /><Button variant="primary" type="button" onClick={this.testButtonClicked}>INVENTORY TEST</Button>
        </>);
    }
  }
  
  export default Inventory;