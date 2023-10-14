import React, { Component } from 'react';
import UploadFile from './UploadFile';
import OldOrders from './OldOrders';


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

/**
 * Plan of Action
 * - Delete all data from database
 * - Parse given NEW order file (columns should be order number and rep)
 * - compare NEW orders with OLD orders (from database)
 * - - If NEW order.order_number is in OLD orders
 * - - - Add NEW order to return list
 * - - If NEW order.order_number is not in OLD orders
 * - - - Add NEW order to return list
 * - - If OLD order.order_number is not in NEW orders
 * - - - Delete from server
 */


class StaleOrder extends Component  {
    constructor(props){
      super(props);
      this.state = {
        orders: []
      };
      

    }

    componentDidMount(){
      fetch("http://localhost:8080/orders")
      .then(response => {
        return response.json();
      }).then(data => {
        //console.log(data.data);
        this.setState({orders: data.data});
        //return data;
      })
      .catch(error => {
        console.error(error);
      });
    }

    render() {
        return (<>
            <h1>StaleOrder</h1>
            <UploadFile setter={this.setState} />
            
            <OldOrders data={this.state.orders} />
        </>);
      }
  }
  
  export default StaleOrder;