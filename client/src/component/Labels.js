// React imports
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';



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
  
    render() {
        return (<>
            <h2>Labels</h2>
        </>);
      };
    }
    export default Labels;