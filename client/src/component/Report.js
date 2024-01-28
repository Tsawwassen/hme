// React imports
import React, { Component } from 'react';

import ReportTable from './ReportTable';
import {  Button } from 'react-bootstrap';
import Papa from 'papaparse';


// Report component
class Report extends Component {
    constructor(props){
        super(props);
        this.state = {
            report: [], 
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

    /**
     * Export Report Table to CSV file
     * Handles cells with quotes, double quotes, and commas
     * 
     */
    exportMap(){
        const csvBlob = new Blob([Papa.unparse(this.state.report, {
            quotes: true,      // Enable quoting of all values
            quoteChar: '"',    // Use double quotes as the quote character
            delimiter: ','     // Use a comma as the delimiter
          })], { type: 'text/csv;charset=utf-8' });
          
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(csvBlob);
          downloadLink.download = 'Inventory-Report.csv';
          downloadLink.click();
    }


    // Combine the two file data into one JSON object
    // Function does handle if given variables have different part numbers
    generateReport(expected, actual){ 
        let r = [];
        let index = 0;
        
        //Loop expected array of parts
        expected.forEach(part => {
            // Add actual value to part object
            if(part.actual === undefined){
                part.actual = 0;
            }
            
            //If find index of expected unit number in actual array
            index = actual.indexOf(part['(Unit No)'])

            // if it is, add 1 to actual value. Remove that record from the actual array
            if(index >= 0){
                part.actual += 1;
                actual.splice(index, 1);
            }

            // Add add part to r array
            r.push(part);
        })
        
        // Count the number of occurances of parts in the actual array
        let valueCounts  = {};
        actual.forEach(value =>{
            if (valueCounts[value] === undefined) {
                valueCounts[value] = 1; // Initialize count if the value is encountered for the first time
              } else {
                valueCounts[value]++; // Increment count if the value has been encountered before
              }
        })
        // valueCounts JSON object looks like { ..., partNumber:quantity, ... }

        // Once expected array has been looped, add the remaining values of actual array to r (remember to have the data model correct for the report rendering. Add something to the values to show that it didn't have a record)
        // Use the partNumber keys of the valueCounts array to get the a list of counted parts that were not in the expected file
        // Use the part for unit no field, and use the part as the key in the valueCounts object to get the actual count
        Object.keys(valueCounts).forEach(part => {
            let temp = {
                "Inventory Part": "",
                "Make": "",
                "Model": "",
                "Serial #": "",
                "(Unit No)": part,
                "Inventory Desc": "",
                "Department": "",
                "expected": 0,
                "actual": valueCounts[part]
            }
            r.push(temp);
        })

        //Calculate difference here
        r.forEach(part => {
            part["difference"] = part["expected"] - part["actual"];
        })
      

        return r;
    }

    
    // Render 
    render() {
        return (<>
            <h2>Report</h2>
            {this.state.report.length > 0 && <ReportTable values={this.state.report} />}
            <br /><Button onClick={this.exportMap} >Export</Button>
        </>);
      };
    }
    export default Report;