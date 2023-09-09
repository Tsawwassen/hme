// React imports
import React, { Component } from 'react';


// Helper Class
import FileReaderHelper from '../class/FileReaderHelper';

// Upload component
// Render two file inputs, and submit button
class UploadV2 extends Component {
  
    // Store two file paths and two file data as JSON array
    constructor(props){
        super(props);
        this.state = {
            expectedFilePath: {},
            actualFilePath: {},
        };

        // OnChange functions
        this.expectedFileOnChange = this.expectedFileOnChange.bind(this);
        this.actualFileOnChange = this.actualFileOnChange.bind(this);

        //Submit function
        this.submit = this.submit.bind(this);
    }

    // Submit input files paths to be parsed
    submit(){       
       FileReaderHelper.getFileContent(this.state.expectedFilePath, 
                                        this.state.actualFilePath,
                                        this.props.setters, 
                                        "Please select an expected inventory file",
                                        "Please select an actual inventory file"
                                        );
      
       
    }

    // OnChange functions
    expectedFileOnChange(e){
        this.setState({expectedFilePath: e.target.files[0]});
    }
    actualFileOnChange(e){
        this.setState({actualFilePath: e.target.files[0]});
    }
    
    // Render two file inputs and submit button.
    render() {
        return (<>
            <h2>Upload V2 COMPONENT</h2>
            
        </>);
      };
    }
    export default UploadV2;