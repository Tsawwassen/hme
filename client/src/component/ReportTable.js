//TODO : Work on the CSS for the table. 
//      - Use react-bootstrap tables?
//import '../styles/ReportTable.css';
import Table from 'react-bootstrap/Table';

function ReportTable(props) {

    
    //Need to initialize keys variable to be used in the tbody render
    //Might be a better way of doing this, but not sure how to reference the keys array inside the map function
    
    return (
      <>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>Year</th>
              <th>Make</th>
              <th>Model</th>
              <th>Serial Number</th>
              <th>Unit Number</th>
              <th>Inventory Desc</th>
              <th>Department</th>
              <th>Expected</th>
              <th>Actual</th>
              <th>Difference</th>
            </tr>
            </thead>
            <tbody>
            {props.values.map((part, i) => {
              return <tr key={i}>
                <td>{part['Year']}</td>
                <td>{part['Make']}</td>
                <td>{part['Model']}</td>
                <td>{part['Serial #']}</td>
                <td>{part['(Unit No)']}</td>
                <td>{part['Inventory Desc']}</td>
                <td>{part['Department']}</td>
                <td>{part['expected']}</td>
                <td>{part['actual']}</td>
                <td>{part['expected'] - part['actual']}</td>
              </tr>
            })}
            </tbody>
          </Table>
      </>
    );
  }
  
  export default ReportTable;