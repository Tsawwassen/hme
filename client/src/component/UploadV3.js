// React imports
import React, { Component } from 'react';
import { Col, Row, Form, Button, ListGroup  } from 'react-bootstrap';

// Helper Class
import ReportMapperHelper from '../class/ReportMapperHelper';

// Upload component
// Render two file inputs, and submit button
class UploadV3 extends Component {
  
    // Store two file paths and two file data as JSON array
    constructor(props){
        super(props);
        this.state = {
            activePartNumber: "",
            actualPartList: []
        };

        // OnChange functions
        this.activePartNumberOnChange = this.activePartNumberOnChange.bind(this);

        //Submit function
        this.submit = this.submit.bind(this);

        
        //Handle enter key stroke to prevent page from submitting 
        //--Mostly for scanner functionality
        this.handleKeyDown = this.handleKeyDown.bind(this);

        
        // OnExit functions
        this.partNumberOnExit = this.partNumberOnExit.bind(this);
    }

    // OnChange functions
    activePartNumberOnChange(e){
        this.setState({activePartNumber: e.target.value});
    }

    
    // OnExit Function
    // -On focus exit of Scanned Part number input field:
    // ---Add new part number to list
    // ---Clear input field
    // ---Set focus back to input field
    partNumberOnExit(e){
        if(this.state.activePartNumber.length !== 0){
            //console.log("onExit Function")
            let temp = this.state.actualPartList;
            temp.push(this.state.activePartNumber);
            e.target.value = "";
            
            this.setState({actualPartList: temp, activePartNumber: ""});
        }
        e.target.focus();
    }

    
    //Handle enter key stroke to prevent page from submitting 
    //--Mostly for scanner functionality
    //--Treat enter key press the same as tab key pressed
    handleKeyDown(e) {
        if (e.keyCode === 13 ) {
            e.preventDefault();
            this.partNumberOnExit(e);
        }
    }

    // Submit input files paths to be parsed
    submit(){
        ReportMapperHelper.mapServerAndScannedData(this.state.actualPartList, this.props.setters)
       /*  ReportMapperHelper.getDoubleFileContent(this.state.expectedFilePath, 
                                        this.state.actualFilePath,
                                        this.props.setters, 
                                        "Please select an expected inventory file",
                                        "Please select an actual inventory file"
                                        ); */
      
       
    }
    
    // Render two file inputs and submit button.
    render() {
        return (<>
            <h2>Upload V3 COMPONENT</h2>
            <Row>
                <Col>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Scanned Part Number</Form.Label>
                        <Form.Control autoFocus type="text" placeholder="Part Number" onChange={this.activePartNumberOnChange} onBlur={this.partNumberOnExit} onKeyDown={this.handleKeyDown}/>
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.submit}>Submit</Button>
                </Form>
                </Col>
            </Row>
            <ListGroup>
                {this.state.actualPartList.map( (l, i) => {
                    return <ListGroup.Item key={i}>{l}</ListGroup.Item>
                })}
            </ListGroup>
        </>);
      };
    }
    export default UploadV3;