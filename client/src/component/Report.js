// React imports
import React, { Component } from 'react';
import { CSVLink } from "react-csv";

import ReportTable from './ReportTable';


// Report component
class Report extends Component {
    constructor(props){
        super(props);
        this.state = {
            report: {}, 
            csvData: []
        };

        // Combine the two file data into one JSON object
        this.generateReport = this.generateReport.bind(this);

        // Function to map JSON Object report to a 2D array for exporting
        this.exportMap = this.exportMap.bind(this);
    }

    // Format file data props to be used by report component when mounted
    componentDidMount(){
        this.setState({report: this.generateReport(this.props.data[0], this.props.data[1])});
    }

    // Function to map JSON Object report to a 2D array for exporting
    /**
     * The current export map does not like fields with double quotes
     * When uploading the WW export, you need to remove double quotes to make the export report work
     * TODO : find a way for the export to work with double quotes, or remove the quotes when making the file
     */
    exportMap(){
        let tempCSV = [];
        let headers = Object.keys(this.state.report[0]);

        tempCSV.push(headers);

        this.state.report.forEach(part => {
            /**
             * Dev Note : Object.values is a good function, but because some fields are blank, it wont add an empty string to that column
             */
            //tempCSV.push(Object.values(part));

            let row = []

            headers.forEach( h => {
                row.push(part[h]);
            });
            
            row.push(row[7] - row[8]);

            tempCSV.push(row);

        })
        //Add the difference header after the array has been looped so that i can push the calculated value at the end of the row in the loop
        // Since I'm getting the value from part from the header (which is the keys) it wouldn't find a value for difference
        // I can add the calculated value in the forEach loop, then add the difference header at the end
        tempCSV[0].push("difference");

        this.setState({csvData: tempCSV});
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
        
        // DEV NOTE : might need to do 'actual_qty - expected_qty' and not 'expected_qty - actual_qty'
        //              -Check with end user
        Object.keys(r).forEach(part =>{
            r[part].difference = r[part].expected_qty - r[part].actual_qty;
        })
        
        return r;
    }

    
    // Render 
    render() {
        return (<>
            <h2>Report</h2>
            <ReportTable values={this.state.report} />
            < br /><CSVLink data={this.state.csvData} filename={"report.csv"} className="btn btn-primary" onClick={this.exportMap} >Export</CSVLink>
        </>);
      };
    }
    export default Report;