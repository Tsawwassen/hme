import React, { Component } from 'react';
import UploadOldOrders from './UploadOldOrders';
import ViewOldOrders from './ViewOldOrders';


/**
 * Stale Order Tool
 * - Scan order that are sitting on a shelf
 * - Compare current list with previous list
 * - If the order is new, save the order
 * - If the order is in the previous list, keep the order
 * - If the order is not in the new list, delete it (?)
 * - - Maybe add a database column with a date of when an old order was not on the new order audit
 * - Show a list of orders on the shelf, highlighting orders that have been sitting on the shelf from previous order audit
 * -
 */

/**
 * V1
 * - Use input file to complete task - DONE
 */

/**
 * Plan of Action
 * - Delete all data from database - DONE
 * - Parse given NEW order file (columns should be order number and rep)- DONE
 * - compare NEW orders with OLD orders (from database)- DONE
 * - Add 'weeks old' column to Order model and update order number when file is uploaded, and the other number is in the file (ie its still sitting on the shelf)
 * - Delete order if it is not in the upload file but is on the database
 * - - DEV NOTE : Might be a good idea to learn about testing to make this easier to test
 * - Have rendered table update after file is uploaded
 * - Add function to add comment to stale order
 * - Mark function as complete ??
 */


class StaleOrder extends Component  {
    constructor(props){
      super(props);
      this.state = {
        orders: []
      };
      
      this.setOrders = this.setOrders.bind(this);
      this.removeDuplicates = this.removeDuplicates.bind(this);
      this.compareNewAndOldOrders = this.compareNewAndOldOrders.bind(this);

      this.intersectingOrders = this.intersectingOrders.bind(this);
      this.deliveredOrders = this.deliveredOrders.bind(this);

      this.getOrders = this.getOrders.bind(this);
    }

    removeDuplicates(data){
      return data.filter((data, index, self) =>
        index === self.findIndex((t) => (t.orderNumber === data.orderNumber )))
    }

    //Return list of orders that are in both arrays
    intersectingOrders(oldOrders, newOrders){
      var result = [];
      oldOrders.forEach(oldOrder => {
        // iterating over second array
        newOrders.forEach(newOrder => {
            if (oldOrder.orderNumber === newOrder.orderNumber )  {
                result.push(oldOrder);
            }
        });
      });
      return result;
    }

    //Return list of arrays that are ONLY in oldOrders
    deliveredOrders(oldOrders, newOrders){
      return oldOrders.filter(ar => !newOrders.find(rm => (rm.orderNumber === ar.orderNumber) ))
    }

    compareNewAndOldOrders(newOrders){
      /** 
      * 3. Compare orders with database and update as needed
      * 3a.* - - If NEW order.order_number is in OLD orders
      * - - - Add NEW order to return list (intersecting order)
      * - - If NEW order.order_number is not in OLD orders
      * - - - Add NEW order to return list (keep order / clean keep order)
      * - - If OLD order.order_number is not in NEW orders
      * - - - Delete from server (delivered orders)
      */
      let oldOrders = this.state.orders;

      // Find orders intersecting (orders that where recorded last time the audit was done)
      let intersectingOrders = this.intersectingOrders(oldOrders, newOrders);
      // Find orders that are only in oldOrders (to be deleted)
      let deliveredOrders = this.deliveredOrders(oldOrders, newOrders); // Orders that needs to be deleted / field updated on the database
      // Merge intersection orders and newOrders (remove duplicates, keep comment)
      // Need to add newOrders to intersectingOrders so that the database records is in the array first
      // Dev Note - This logic might not be correct. Need to try some examples to see if this is true.
      let keepOrders = intersectingOrders.concat(newOrders);
      //Need to keep records that have _id key
      let cleanKeepOrders = this.removeDuplicates(keepOrders);

      

      //Loop cleanKeep orders
      // if order has _id key -> update
      // Else add order

      let  requestOptions = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //body: JSON.stringify(order), // body data type must match "Content-Type" header
      };

      cleanKeepOrders.forEach(order => {

        requestOptions.body = JSON.stringify(order);

        if(order.hasOwnProperty('_id')) {
          requestOptions.method = 'PUT';
          
        }else {
          requestOptions.method = 'POST';
        }
  
         fetch('http://localhost:8080/orders', requestOptions)
         .then(response => {
           return response.json();
         }).then(data => {
           return data;
         })
         .catch(error => {
           console.error(error);
         });
         

      });
      //Loop delivered orders
      // delete (?) from database

      
    }
    
    async getOrders(){
      return new Promise((resolve, reject) => {
        fetch("http://localhost:8080/orders")
        .then(response => {
          return response.json();
        }).then(data => {
          //console.log("inside promise");
          this.setState({orders: data.data});
          resolve(data);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
      });
    }

    //Would rather pass the setState function to the UploadOldOrders component and not have a function to handle this
    // // Not sure what way of doing it is good practise.
    setOrders(data){
      this.compareNewAndOldOrders(this.removeDuplicates(data));
    }

    /**  Not sure if this fetch call should be in the UploadOldOrders component or left here
     * The thinking behind leaving it here is that when the component is mounted, it should get the old data, and then updated when a file is uploaded
     * The thinking behind putting it in the UploadOldOrders component is that the component is getting a setState prop that would get used when a file is uploaded
    */
    componentDidMount(){
      fetch("http://localhost:8080/orders")
      .then(response => {
        return response.json();
      }).then(data => {
        this.setState({orders: data.data});
      })
      .catch(error => {
        console.error(error);
      });
    }

    render() {
        return (<>
            <h1>StaleOrder</h1>
            <UploadOldOrders set={this.setOrders} />
            <ViewOldOrders data={this.state.orders} />
        </>);
      }
  }
  
  export default StaleOrder;