// React imports
import React, { Component } from 'react';
import {  Button } from 'react-bootstrap';

import ReportTable from './ReportTable';


// Report component
class Report extends Component {
    constructor(props){
        super(props);
        this.state = {
            report: {}
        };

        // Combine the two file data into one JSON object
        this.generateReport = this.generateReport.bind(this);

        // Test Button
        this.testButton = this.testButton.bind(this);
    }

    // Format file data props to be used by report component when mounted
    componentDidMount(){
        this.setState({report: this.generateReport(this.props.data[0], this.props.data[1])});
    }

    // Test Button
    testButton(){
        console.log(this.state.report);
    }

    // Combine the two file data into one JSON object
    // Function does handle if given variables have different part numbers
    generateReport(expected, actual){
        let r = {};

        // Loop expected array
        expected.forEach(part => {
            // Add part_number, expected quantity from expected array, and set actual quantity to 0
            r[part.part_number] = {expected_qty: part.quantity,
                                    actual_qty: 0};
        });

        // Loop actual array
        actual.forEach(part => {
            // Check if part_number is in r object
            if(r.hasOwnProperty(part.part_number)){
                // Update actual quantity from actual array
                r[part.part_number].actual_qty = part.quantity;
            } else { // part number is not in array
                // Add part_number, set expected quantity to 0, set actual quantity from actual array
                r[part.part_number] = {expected_qty: 0,
                    actual_qty: part.quantity};
            }
        });
        //TODO : Add difference quantity? Currently getting calculated in ReportTable component
        return r;
    }

    
    // Render 
    render() {
        return (<>
            <h2>Report COMPONENT</h2>
            <ReportTable values={this.state.report} />
            {/** TODO : Add button to export table to CSV file */}
            {/** Test Button to see component state variables */}<br /><Button variant="primary" type="button" onClick={this.testButton}>REPORT TEST</Button>
        </>);
      };
    }
    export default Report;