// React imports
import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

async function readUploadedFileAsText(inputFile) {
  const fr = new FileReader();
  return new Promise((resolve, reject) => {
    fr.onerror = () => {
      fr.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    fr.onloadend = () => {
      resolve(fr.result);
    };
    fr.readAsText(inputFile);
  });
};

function formatCSVData(data){

  // CSV files were showing '\r' and '\n' when file was parsed
  // Remove '\r' and split rows on '\n'
  data = data.replaceAll("\r","");
  const csv = data.split('\n');

  // First row of file should be headers
  // Headers will be used as keys for the JSON object array
  // Remove headers CSV array
  const headers = csv.shift().split(',');
  const table = [];

  // Format CSV file into an array
  csv.forEach((row) => {
      if(row === "") return; //skip row if row is empty, will continue parsing the file
      table.push(row.split(','));
  });
  
  // Build JSON array using headers as keys
  const tempData = []
  table.forEach((row, i) => {
      tempData[i] = {};
      row.forEach((cell, j) =>{
          tempData[i][headers[j]] =  cell;
      });
  });


  return tempData;
};


  class UploadOldOrders extends Component {
    constructor(props){
        super(props);
        this.state = {
            uploadFilePath: {},
        };

        this.uploadFilePathOnChange = this.uploadFilePathOnChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    // OnChange functions
  uploadFilePathOnChange(e){
      this.setState({uploadFilePath: e.target.files[0]});
  }

  async submit(){       
    this.props.set(formatCSVData( await readUploadedFileAsText(this.state.uploadFilePath)));
  }
    
    render() {
      return (
      <>
          <h2>Upload File Componenet</h2>
          <Form>
              <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Expected Inventory file</Form.Label>
                  <Form.Control type="file" onChange={this.uploadFilePathOnChange}  />
              </Form.Group>
              <Button variant="primary" type="button" onClick={this.submit}>Submit</Button>
          </Form>
      </>
    )};
  }

  
  
  export default UploadOldOrders;