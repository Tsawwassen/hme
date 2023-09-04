// React imports
import React, { Component } from 'react';
//import { Col, Row, Form, Button } from 'react-bootstrap';


// Report component
class Report extends Component {
  

    constructor(props){
        super(props);
        this.state = {
            report: []
        };

        this.generateReport = this.generateReport.bind(this);
    }

    componentDidMount(){
        
  
        //console.log(expected);
        //console.log(actual);
        this.generateReport(this.props.data[0], this.props.data[1])

    }

    generateReport(expected, actual){
        let r = [];

        //Loop expected array
        // // Add part_number, expected quantity from expected array, and set actual quantity to 0
        //Loop actual array
        // // Check if part_number is in array
        // // // Update actual quantity from actual array
        // // Else (part number is not in array)
        // // // Add part_number, set expected quantity to 0, set actual quantity from actual array

    }

    
    // Render 
    render() {
        return (<>
            <h2>Report COMPONENT</h2>
            
        </>);
      };
    }
    export default Report;