function ViewOldOrders(props) {
    
    //Need to initialize keys variable to be used in the tbody render
    //Might be a better way of doing this, but not sure how to reference the keys array inside the map function
    
    return (
      <>
          <h2>ViewOldOrders</h2>
          <ul>
            {props.data.map((order, i) => {
                return <li key={i}>{order.orderNumber}</li>
            })}
            </ul>
      </>
    );
  }
  
  export default ViewOldOrders;