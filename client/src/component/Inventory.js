// React imports
import React, { Component } from 'react';
//import {  Tab, Tabs } from 'react-bootstrap';

// Upload component - Only using V4. Commented out other versions.
//import Upload from './Upload';
//import UploadV2 from './UploadV2';
//import UploadV3 from './UploadV3';
import UploadV4 from './UploadV4';
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
    //Upload expected values (file will contain part number and quantity columns) - DONE in V1
    //Scan items and create a list with part number and update quantity as they are scanned - DONE (09/16/2023)
    //Show report comparing the two files - DONE (09/16/2023)

    //----V3----
    //Get expected values from database - DONE (09/23/2023)
    //Scan items and create a list with part number and update quantity as they are scanned - DONE (09/23/2023)
    //Show report comparing the two files - DONE (09/23/2023)



class Inventory extends Component {
  constructor(props){
    super(props);
    this.state = {
      expectedData: [],
      actualData: [],
      view: UPLOAD
    };


    // Set Functions
    this.setData = this.setData.bind(this);

    // Data Check Function
    this.checkFileData = this.checkFileData.bind(this);
    
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
    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(key){
    this.setState({
      expectedData: [],
      actualData: [],
      view: UPLOAD
    })
  }

    
    render() {
      return (<>
        <h1>Inventory Screen</h1>
        {/* -DEV NOTE: Only using V4. Commented out the other versions to make things easier for user.
        <Tabs
          defaultActiveKey="v1"
          id="uncontrolled-tab-example"
          className="mb-3"
          onSelect={(k) => this.changeTab(k)}
        >
        <Tab eventKey="v1" title="V1">
          {this.state.view === UPLOAD && <Upload setters={this.setData} />}
          {this.state.view === REPORT && <Report data={[this.state.expectedData, this.state.actualData]}/>}
        </Tab>
        <Tab eventKey="v2" title="V2">
          {this.state.view === UPLOAD && <UploadV2 setters={this.setData} />}
          {this.state.view === REPORT && <Report data={[this.state.expectedData, this.state.actualData]}/>}
        </Tab>
        {// Hiding V3 of inventory helper as it is not needed at this time
        /** <Tab eventKey="v3" title="V3">
          {this.state.view === UPLOAD && <UploadV3 setters={this.setData} />}
          {this.state.view === REPORT && <Report data={[this.state.expectedData, this.state.actualData]}/>}
      </Tab> }
        <Tab eventKey="v4" title="V4">
          {this.state.view === UPLOAD && <UploadV4 setters={this.setData} />}
          {this.state.view === REPORT && <Report data={[this.state.expectedData, this.state.actualData]}/>}
        </Tab>
        </Tabs> */}
        {this.state.view === UPLOAD && <UploadV4 setters={this.setData} />}
        {this.state.view === REPORT && <Report data={[this.state.expectedData, this.state.actualData]}/>}
        </>);
        
    }
  }
  
  export default Inventory;