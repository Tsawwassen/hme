import React, { Component } from 'react';
import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import Papa from 'papaparse';

import ShelfLabelPrint from './ShelfLabelPrint.js';

import FileReaderHelper from '../class/FileReaderHelper';
import ReportMapperHelper from '../class/ReportMapperHelper.js';

function LabelForm(props)
{
    //Doing the below state variable and setter allows the form data to be easily used when submit button is clicked
    const [data, setData] = useState({});
    
    const updateData = e => {
        setData({
            ...data,
            [e.target.id]: e.target.value
        })
    }

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // For the rest of the app to work, the setter input needs to be an array. 
        // Just making it an array here since the batch version will return an array by default
        props.setter([data]);
    }
    //Clear form
    //Doesn't feel like a React solution, but it clears all fields
    function clearForm(e){
        document.getElementById("inputForm").reset();
    }
    
    return(<>
        <Form onSubmit={handleSubmit} id="inputForm">
            <Form.Group className="mb-3" controlId="part_number">
                <Form.Label>Part Number:</Form.Label>
                <Form.Control type="text" onChange={updateData}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="supplier">
                <Form.Label>Supplier:</Form.Label>
                <Form.Control type="text" onChange={updateData}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description:</Form.Label>
                <Form.Control type="text" onChange={updateData}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            <Button variant="primary" onClick={clearForm}>Clear</Button>
        </Form>
    </>) ;
}

function LabelBatch(props){

  const [path, setPath] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  
  const updatePath = e => {
      setPath(e.target.files[0]);
      setErrorMessage("");
  }

  const getTemplateFile = e => {
    const csvBlob = new Blob([Papa.unparse([{part_number:"",	supplier:"",	description:"" }], {
      quotes: true,      // Enable quoting of all values
      quoteChar: '"',    // Use double quotes as the quote character
      delimiter: ','     // Use a comma as the delimiter
    })], { type: 'text/csv;charset=utf-8' });
   
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(csvBlob);
    downloadLink.download = 'ShelfLabelTemplate.csv';
    downloadLink.click();
     
   }

  async function handleSubmit(e) {

      let validFile = FileReaderHelper.validFileCheck(path);

      if(validFile.status){
          props.setter(FileReaderHelper.ParseCSV( await ReportMapperHelper.readUploadedFileAsText(path)));
          
      } else {
      setErrorMessage(validFile.message);
      }
  }

  return (<>
    <Button onClick={getTemplateFile}>Download Template</Button>
    {(errorMessage !== "") && <Alert variant="danger">
                                <Alert.Heading>Error</Alert.Heading>
                                <p>
                                    {errorMessage}
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                <Button onClick={() =>  {setErrorMessage("");}} >
                                        Close me
                                    </Button>
                                </div>
                            </Alert>}

                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Input CSV file</Form.Label>
                        <Form.Control type="file" onChange={updatePath}  />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={handleSubmit}>Submit</Button>
                </Form>

            
    </>);
}

class ShelfLabel extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      labels: []
    };

    this.setLabels = this.setLabels.bind(this);
  }

  setLabels(inputLabels){
    this.setState({labels: inputLabels});
  }

  render() {
    return (<>
      {  (this.props.batch === "false") && this.state.labels.length === 0 && <LabelForm setter={this.setLabels} /> }
      {  (this.props.batch === "true") && this.state.labels.length === 0 && <LabelBatch setter={this.setLabels}/> }
      {this.state.labels.length > 0 && <ShelfLabelPrint table={this.state.labels}/>}
    </>);
  };
}
  export default ShelfLabel;
  