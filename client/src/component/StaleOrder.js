import React, { Component } from 'react';


/**
 * Stale Order Tool
 * - Scan order that are sitting on a shelf
 * - Compare current list with previous list
 * - If the order is new, save the order
 * - If the order is in the previous list, keep the order
 * - If the order is not in the new list, delete it (?)
 * - Show a list of orders on the shelf, highlighting orders that have been sitting on the shelf from previous order audit
 * -
 */

/**
 * V1
 * - Use input file to complete task
 */

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