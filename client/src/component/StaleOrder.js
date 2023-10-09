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
        orders: []
      };

    }

    componentDidMount(){
      //let table = await getServerData()
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
            <ul>
            {this.state.orders.map((order, i) => {
                return <li key={i}>{order.orderNumber}</li>
            })}
            </ul>
        </>);
      }
  }
  
  export default StaleOrder;