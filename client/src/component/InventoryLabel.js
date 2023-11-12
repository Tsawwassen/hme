import React, { Component } from 'react';

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
            return (
                <div className='label' key={index}> 
                    <table>
                    <tbody>
                        <tr>
                            <td className="Make">{label.makeInput}</td>
                            <td className="Model">{label.modelInput}</td>
                        </tr>
                        <tr ><td className="serialNumber" colSpan="2">{label.serialNumberInput}</td></tr>
                        <tr><td className="assetNumber" colSpan="2"><Barcode value={label.assetNumberInput} {...barcodeOptions} /></td></tr>
                    </tbody>
                    </table>
                </div>
            )
        })}
    </>)
}

function LabelForm(props)
{
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        
        // Read the form data - KEEP STEP BY STEP FOR REFERENCE. Flattened down the code to one line
        //const form = e.target;
        //const formData = new FormData(e.target);
        //const formJson = Object.fromEntries((new FormData(e.target)).entries());
        //console.log(formJson);
        //let returnArray = [Object.fromEntries((new FormData(e.target)).entries())];

        props.setter([Object.fromEntries((new FormData(e.target)).entries())]);
        // For the rest of the app to work, the setter input needs to be an array. 
        // Just making it an array here since the batch version will return an array by default
    }
    
    return(<>
        <form onSubmit={handleSubmit}>
            <label>
                Make: <input name="makeInput" />
            </label>
            <hr />
            <label>
                Model: <input name="modelInput" />
            </label>
            <hr />
            <label>
                Serial Number: <input name="serialNumberInput" />
            </label>
            <hr />
            <label>
                Asset Number: <input name="assetNumberInput" />
            </label>
            <hr />
            <button type="submit">Submit form</button>
        </form>
    </>) ;
} 

function LabelBatch(){
    return <h1>Label Batch</h1>;
}

class InventoryLabel extends Component {
  
    // Store two file paths and two file data as JSON array
    constructor(props){
        super(props);
        this.state = {
         labels: []
        };

        //this.labelOnChange = this.labelOnChange.bind(this);
        this.setLabels = this.setLabels.bind(this);
    }
    
    setLabels(inputLabels){
        this.setState({labels: inputLabels});
    }
  
    render() {
        
        return (<>
            { (this.props.batch === "false") && <LabelForm />}
            { (this.props.batch === "true") && <LabelBatch />}
            <Label make="Make Props" model="Model Props" serialNumber="Serial Number Props" assetNumber="123-Props" />
           
            
        
        </>);
      };
    }
    export default InventoryLabel;