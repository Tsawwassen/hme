// React imports
import React, { Component } from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';

// Upload component
import Upload from './Upload';
import UploadV2 from './UploadV2';
import Report from './Report';

// Variables to change loaded component
const UPLOAD = 0;
const REPORT = 1;

    //-----PLAN OF ACTION ----
    //-----V1----
    //Upload two different CSV files - DONE (09/04/2023)
    //Compare the two files (Both files will have part number and quantity columns)- DONE (09/04/2023)
    //Show report comparing the two files - DONE (09/04/2023)
    // NOTE : Add export button here? - DONE (09/09/2023)

    //-----V2----
    //Upload expected values (file will contain part number and quantity columns)
    //Scan items and create a list with part number and update quantity as they are scanned
    //Show report comparing the two files

    //----V3----
    //Get expected values from database
    //Scan items and create a list with part number and update quantity as they are scanned
    //Show report comparing the two files



class Inventory extends Component {
  constructor(props){
    super(props);
    this.state = {
      expectedData: [],
      actualData: [],
      view: UPLOAD
    };

    //Button to test state values
    this.testButtonClicked = this.testButtonClicked.bind(this);

    // Set Functions
    this.setData = this.setData.bind(this);

    // Data Check Function
    this.checkFileData = this.checkFileData.bind(this);
    
  }

  //Button to test state values
  testButtonClicked(){
    console.log(this.state.expectedData);
    console.log(this.state.actualData);
  }

  // Check if the received data is not empty
  // Probably could do a better data check, but its working for test files.
  checkFileData(EFD, AFD){
    return ((EFD.length > 0) || (AFD.length > 0))
  }

  //Set expected and actual data (if valid) and change the view
  setData(expected, actual){
    //This data check might be redundant.
    if (this.checkFileData(expected, actual)){
      this.setState({
        expectedData: expected,
        actualData: actual,
        view: REPORT
      })
    }
  }

    
    render() {
      return (<>
        <h1>Inventory Screen</h1>
        <Tabs
          defaultActiveKey="v1"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
        <Tab eventKey="v1" title="V1">
          {this.state.view === UPLOAD && <Upload setters={this.setData} />}
          {this.state.view === REPORT && <Report data={[this.state.expectedData, this.state.actualData]}/>}
        </Tab>
        <Tab eventKey="v2" title="V2">
          {this.state.view === UPLOAD && <UploadV2 setters={this.setData} />}
          {this.state.view === REPORT && <Report data={[this.state.expectedData, this.state.actualData]}/>}
        </Tab>
        {/** Test Button to see component state variables */}<br /><Button variant="primary" type="button" onClick={this.testButtonClicked}>INVENTORY TEST</Button>
        </Tabs>
        </>);
    }
  }
  
  export default Inventory;