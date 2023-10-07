import React, { Component } from 'react';

class StaleOrder extends Component  {
    constructor(props){
      super(props);
      this.state = {
      };
    }
    

    render() {
        return (<>
            {console.log("inside StaleOrder")}
            <h1>StaleOrder</h1>
        </>);
      }
  }
  
  export default StaleOrder;