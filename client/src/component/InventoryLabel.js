import React, { Component } from 'react';
import { useState } from 'react'
import {Button, Alert} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FileReaderHelper from '../class/FileReaderHelper';
import ReportMapperHelper from '../class/ReportMapperHelper.js';

import '../styles/InventoryLabel.scss';

const Barcode = require('react-barcode');

//Include Serial number, Asset number (demo/rental), Make, Model
function Label(props){
    const barcodeOptions = {
        width: 2,
        height: 30,
        format: "CODE128",
        displayValue: true,
        fontOptions: "",
        font: "monospace",
        textAlign: "center",
        textPosition: "bottom",
        textMargin: 2,
        fontSize: 20,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 10,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
    };
    
    return(<>
        {props.data.map(function(label, index){
            return (<div key={index}>
                <div className='inventory-label' > 
                    <table>
                    <tbody>
                        <tr>
                            <td className="Make">{label.makeInput}</td>
                            <td className="Model">{label.modelInput}</td>
                        </tr>
                        <tr ><td className="serialNumber" colSpan="2">{label.serialNumberInput}</td></tr>
                        <tr><td className="assetNumber" colSpan="2"><Barcode value={label.assetNumberInput.replace(/\s+/g, '')} {...barcodeOptions} /></td></tr>
                    </tbody>
                    </table>
                </div>  
            </div>)
        })}
        <Button variant="primary" type="button" className="clearButton" onClick={props.onClick}>Clear</Button>
    </>)
}

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
            <Form.Group className="mb-3" controlId="makeInput">
                <Form.Label>Make:</Form.Label>
                <Form.Control type="text" onChange={updateData}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="modelInput">
                <Form.Label>Model:</Form.Label>
                <Form.Control type="text" onChange={updateData}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="serialNumberInput">
                <Form.Label>Serial Number:</Form.Label>
                <Form.Control type="text" onChange={updateData}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="assetNumberInput">
                <Form.Label>Asset Number:</Form.Label>
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

    async function handleSubmit(e) {

        let validFile = FileReaderHelper.validFileCheck(path);

        if(validFile.status){
            props.setter(FileReaderHelper.ParseCSV( await ReportMapperHelper.readUploadedFileAsText(path)));
            
        } else {
        setErrorMessage(validFile.message);
        }
    }

    return (<>
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

class InventoryLabel extends Component {

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
            { (this.props.batch === "false") && this.state.labels.length === 0 && <LabelForm setter={this.setLabels} />}
            { (this.props.batch === "true") && this.state.labels.length === 0 && <LabelBatch setter={this.setLabels}/>}
            { (this.state.labels.length > 0) && <Label data={this.state.labels} onClick={this.clearClick} /> }
        </>);
      };
    }
    export default InventoryLabel;