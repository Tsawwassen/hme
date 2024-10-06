// React imports
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';

import ShelfLabel from './ShelfLabel.js';
import InventoryLabel from './InventoryLabel.js';
import InventoryLabelV2 from './InventoryLabelV2.js';

// Upload component
// Render two file inputs, and submit button
class Labels extends Component {
  
    // Store two file paths and two file data as JSON array
    constructor(props){
        super(props);
        this.state = {
            selectedLabelType: "0",
        };

        this.labelOnChange = this.labelOnChange.bind(this);
    }
    
    labelOnChange(e){
        //console.log(e.target.value);
        this.setState({selectedLabelType: e.target.value});
        
    }
  
    //ToDo : Create url so that you can auto load a label type
    //      able to use localhost:3000/labels?type="1" and still load the page
    //      maybe use 'componentDidMount' and check the url to set the state.selectedLabelType
    render() {
        return (<>
            <div id="label-select">
                <h2>Labels</h2>
                <Form>
                <Form.Group className="mb-3" controlId="formLabelSelection">
                    <Form.Label>Select Label to Print</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={this.labelOnChange}>
                        <option value="0" >Select Label to Print</option>
                        <option value="1" >Shelf Label Single</option>
                        <option value="2" >Shelf Label Batch</option>
                        <option value="3">Inventory Label Single</option>
                        <option value="4">Inventory Label Batch</option>
                        <option value="5">North Van - Inventory Label Single</option>
                        <option value="6">North Van - Inventory Label Batch</option>
                        {/**<option value="999">--TEST - Picture --</option>   Use this option for testing new labels */}
                    </Form.Select>
                </Form.Group>
                </Form>
            </div>
            {this.state.selectedLabelType === "0"}
            {this.state.selectedLabelType === "1" && <ShelfLabel batch="false"/>}
            {this.state.selectedLabelType === "2" && <ShelfLabel batch="true"/>}
            {this.state.selectedLabelType === "3" && <InventoryLabel batch="false" />}
            {this.state.selectedLabelType === "4" && <InventoryLabel batch="true" />}
            {this.state.selectedLabelType === "5" && <InventoryLabelV2 batch="false" />}
            {this.state.selectedLabelType === "6" && <InventoryLabelV2 batch="true" />}
            {/**{this.state.selectedLabelType === "999" && <InventoryLabel batch="false" imageTest="true" />} Use this option for testing new labels */}
        
        </>);
      };
    }
    export default Labels;