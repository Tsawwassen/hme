import Table from 'react-bootstrap/Table';

function ViewOldOrders(props) {
    return (<>
        <h2>ViewOldOrders</h2>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Rep</th>
                <th>Order Number</th>
                <th>Weeks Old</th>
                <th>Comment</th>

            </tr>
            </thead>
            <tbody>
            {props.data.map((order, i) => {
                return <tr key={i}>
                            <td>{order.rep}</td>
                            <td>{order.orderNumber}</td>
                            <td>{order.weeksOld}</td>
                            <td>{order.comment}</td>
                        </tr>
            })}
            </tbody>
        </Table>
    </>);
  }
  
  export default ViewOldOrders;