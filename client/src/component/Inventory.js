import React, { Component } from 'react';

class Inventory extends Component {
  constructor(props){
    super(props);
    this.state = {
     
    };
  }
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
      return (
        <h1>Inventory Screen</h1>
        
      );
    }
  }
  
  export default Inventory;