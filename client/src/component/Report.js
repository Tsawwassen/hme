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
        let r = this.generateReport(this.props.data[0], this.props.data[1])
        this.setState({report: r});
    }

    /**
     * Export Report Table to CSV file
     * Handles cells with quotes, double quotes, and commas
     * 
     */
    exportMap(){
        /** Resolve issue with excel changing cells with only numbers to exponential function */
        /** Probably a better way to check serial number and unit no, but doing a double if ensures they are both checked */
        //loop report array
        var report = this.state.report.map((line) => {
            // Check if line has SN and Unit key
            if(line.hasOwnProperty("Serial #")){
                //Check if SN and Unit have value with only numbers
                if(/^\d+$/.test(line["Serial #"])){
                    //add ` to the start of the number
                    line["Serial #"] = "`" + line["Serial #"];
                }
            }
            if(line.hasOwnProperty("(Unit No)")){
                //Check if SN and Unit have value with only numbers
                if(/^\d+$/.test(line["(Unit No)"])){
                    //add ` to the start of the number
                    line["(Unit No)"] = "`" + line["(Unit No)"];
                }
            }
            return line;
        })

        const csvBlob = new Blob([Papa.unparse(report, {
            quotes: true,      // Enable quoting of all values
            quoteChar: '"',    // Use double quotes as the quote character
            delimiter: ',',     // Use a comma as the delimiter
            columns: ["Category",	
                        "Inventory Part",	
                        "Make",	
                        "Model",	
                        "Serial #",	
                        "(Unit No)",	
                        "expected",	
                        "actual",	
                        "difference"]
          })], { type: 'text/csv;charset=utf-8' });
          
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(csvBlob);
          downloadLink.download = 'Inventory-Report.csv';
          downloadLink.click();
    }


    // Combine the two file data into one JSON object.
    generateReport(expected, actual){ 

        //Get the counts of each item in the actual file, then build it into a JSON object array [..., {part:"", quantity: n },...]
        let scanCounts = actual.reduce((acc, part) => {
            acc[part] = (acc[part] || 0) + 1;
            return acc;
        }, {});
        let scanCountsArray = Object.entries(scanCounts).map(([part, quantity]) => ({
            part,
            quantity
        }));

        //Loop the expected array.
        let r = expected.map((part) => {
            //set index to -1 so handle if the first item searched is not in the list.
            let index = -1;

            //check if the current part has the unit no key.
            // if it does, use that key:value to find the index in the scannedCountsArray.
            // Else use the inventory part key:value.
            if(part.hasOwnProperty("(Unit No)")){
                index = scanCountsArray.findIndex( obj => obj['part'] === part['(Unit No)']);
            } else {
                index = scanCountsArray.findIndex( obj => obj['part'] === part['Inventory Part']);
            }
          
            // if the part is not found in the scannedCountsArray, set the actual to 0, and calculate difference.
            // Else, use the index to find the quantity in the scannedCountsArray, set actual, calculate the difference, and remove the part from the scanCountsArray.
            if(index === -1){
                return {...part, actual: 0, difference: part["expected"] - 0 };
            } else {
                let foundPart = scanCountsArray.splice(index, 1);
                return {...part, actual: foundPart[0].quantity, difference: part["expected"] - foundPart[0].quantity};

            }
        });

        //Add remaining scanCountsArray items to return array since they were not expected but were scanned.
        scanCountsArray.forEach((scan) => {
            let temp = {
                         "Inventory Part": "",
                         "Make": "",
                         "Model": "",
                         "Serial #": "",
                         "(Unit No)": scan.part,
                         "Inventory Desc": "",
                         "Department": "",
                         "expected": 0,
                         "actual": scan.quantity,
                         "difference": 0 - scan.quantity
                     }
            r.push(temp);

        })

        return r;
    }

    
    // Render 
    render() {
        return (<>
            <h2>Report</h2>
            <Button onClick={this.exportMap} >Export</Button><br />
            {this.state.report.length > 0 && <ReportTable values={this.state.report} />}
           
        </>);
      };
    }
    export default Report;