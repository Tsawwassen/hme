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

function LabelForm()
{
    return <h1>Label Form (single)</h1>;
}

function LabelBatch(){
    return <h1>Label Batch</h1>;
}

class InventoryLabel extends Component {
  
    // Store two file paths and two file data as JSON array
    constructor(props){
        super(props);
        this.state = {
         
        };

        //this.labelOnChange = this.labelOnChange.bind(this);
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