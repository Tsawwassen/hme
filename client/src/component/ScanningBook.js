import React, { Component } from 'react';
import { useState } from 'react'
import {Button, Alert} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FileReaderHelper from '../class/FileReaderHelper';
import ReportMapperHelper from '../class/ReportMapperHelper.js';
import Papa from 'papaparse';

import '../styles/ScanningBook.scss';

const Barcode = require('react-barcode');
    const ROWS = 10;
    const COLS = 2;

function Label(props){
    let index = props.col + (props.row * COLS) + (props.page * ROWS * COLS); 
    
    const barcodeOptions = {
        width: 1.5,
        height: 18,
        format: "CODE128",
        displayValue: true,
        fontOptions: "",
        font: "monospace",
        textAlign: "center",
        textPosition: "bottom",
        textMargin: 1,
        fontSize: 15,
        background: "#ffffff",
        lineColor: "#000000",
        margin:5,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
    };


    if(index >= props.data.length) return <div></div>; //Return empty label div to avoid array out of bounds error
      //change header keys here to display correct info from csv file
      return (<div className='label_book' > 
                <table className="table_book">
                  <tbody>
                    <tr><td className="category_book">{props.data[index]['Category']}</td>
                    <td className="description_book">{props.data[index]['Description']}</td></tr>
                    {/**<tr><td className="barcode"><Barcode value={props.table[index].part_number.replace(/\s+/g, '')} {...barcodeOptions} /></td></tr> */}
                    <tr><td className="barcode_book" colSpan="2"><Barcode value={props.data[index]["Part Number - New"]} {...barcodeOptions} /></td></tr>
                  </tbody>
                </table>
                </div>);
    
}

function Row(props){
    let labels = []
    for(let i = 0 ; i < COLS ; i++){
      labels.push(<Label key={i} col={i} {...props} />);
    }
  
    return (<div className='label_row_book'> {labels} </div>)
  }
function Page(props){
  
    let rows_data = [];
    for(let i = 0 ; i < ROWS ; i++){
        rows_data.push(<Row key={i} row={i} {...props} />);
    }
    return (<div className='label_page_book'> {rows_data} </div>)
  }

function Render(props){
   
    formatDataWithHeaders(props.data);
   
    let numberOfPages = parseInt(props.data.length / (ROWS * COLS));
    if((props.data.length % (ROWS * COLS)) !== 0) numberOfPages += 1;
        
    let pages = [];
    for (let i = 0 ; i < numberOfPages ; i++){
        pages.push(<Page key={i} page={i} {...props }/>);
    }
    
    return(<>
        <Button variant="primary" type="button" className="clearButton" onClick={props.onClick}>Clear</Button>
        {pages}
    </>)
}
function formatDataWithHeaders(data){
    
    const resultMap = {};

    data.forEach(item => {
        const { Category, Description, "Part Number - New": newPN, "Part Number - Rental": rentalPN } = item;

        // Initialize groups if not already present
        if (!resultMap[Category]) resultMap[Category] = [];
        if (!resultMap[`${Category}-Rental`]) resultMap[`${Category}-Rental`] = [];

        // Add new part
        resultMap[Category].push({
            Description,
            "Part Number": newPN
        });

        // Add rental part
        resultMap[`${Category}-Rental`].push({
            Description: `Rental ${Description}`,
            "Part Number": rentalPN
        });
    });

    // Flatten to an array
    const finalArray = Object.entries(resultMap).map(([Category, items]) => ({
        Category,
        Items: items
    }));

    console.log(finalArray);
    
}


function LabelBatch(props){

    const [path, setPath] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    
    const updatePath = e => {
        setPath(e.target.files[0]);
        setErrorMessage("");
    }

    const getTemplateFile = e => {
        const csvBlob = new Blob([Papa.unparse([{"Category":"",	"Description":"",	"Part Number - New":"",	"Part Number - Rental":"" }], {
          quotes: true,      // Enable quoting of all values
          quoteChar: '"',    // Use double quotes as the quote character
          delimiter: ','     // Use a comma as the delimiter
        })], { type: 'text/csv;charset=utf-8' });
       
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(csvBlob);
        downloadLink.download = 'ScanningBookTemplate.csv';
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
    </>)
}

class ScanningBook extends Component {

    constructor(props){
        super(props);
        this.state = {
         labels: []
        };

        this.setLabels = this.setLabels.bind(this);
        this.clearClick = this.clearClick.bind(this);
    }
    
    setLabels(inputLabels){
        this.setState({labels: inputLabels});
    }

    clearClick(e){
        e.preventDefault();
        this.setState({labels: []});
    }
    
    render() {
    
        return (<>
            { this.state.labels.length === 0 && <LabelBatch setter={this.setLabels}/>}
            { (this.state.labels.length > 0) && <Render data={this.state.labels} onClick={this.clearClick} /> }
        </>);
      };
    }
    export default ScanningBook;