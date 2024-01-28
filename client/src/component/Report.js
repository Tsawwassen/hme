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
        let r = [];
        let index = 0;
        
        //Loop expected array of parts
        expected.forEach(part => {
            // Add actual value to part
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
            < br /><CSVLink data={this.state.csvData} filename={"report.csv"} className="btn btn-primary" onClick={this.exportMap} >Export</CSVLink>
        </>);
      };
    }
    export default Report;