import Table from 'react-bootstrap/Table';

function ViewOldOrders(props) {

    return (
      <>
          <h2>ViewOldOrders</h2>
          

            <Table striped bordered hover>
            <thead>
            <tr>
                <th>Rep</th>
                <th>Order Number</th>
                <th>Comment</th>
            </tr>
            </thead>
            <tbody>
            {props.data.map((part, i) => {
                
                return <tr key={i}>
                            <td>{part.rep}</td>
                            <td>{part.orderNumber}</td>
                            <td>{part.comment}</td>
                        </tr>
            })}
            </tbody>
          </Table>
      </>
    );
  }
  
  export default ViewOldOrders;