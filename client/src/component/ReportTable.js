//TODO : Work on the CSS for the table. 
//      - Use react-bootstrap tables?
//import '../styles/ReportTable.css';
import Table from 'react-bootstrap/Table';

function ReportTable(props) {
    
    // Sort table data by category
    props.values.sort((a, b) => {
      
      let aCat = a.Category || Infinity;
      let bCat = b.Category || Infinity;

      return aCat - bCat;
    });

    debugger
    
    return (
      <>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>Category</th>
              <th>Inventory Part</th>
               <th>Make</th>
              <th>Model</th>
              {/** <th>Inventory Desc</th>  */}
             {/** <th>Unit Description</th>  */}
              <th>Serial Number</th>
              <th>Unit Number</th>
              <th>WW Quantity</th>{/** Formerly Expected quantity */}
              <th>Scanned Quantity</th>{/** Formerly Actual quantity */}
              <th>Difference</th>
            </tr>
            </thead>
            <tbody>
            {props.values.map((part, i) => {
              return <tr key={i}>
                <td>{part['Category']}</td>
                <td>{part['Inventory Part']}</td>
                <td>{part['Make']}</td>
                <td>{part['Model']}</td>
                {/** <td>{part['Inventory Desc']}</td> */}
                {/** <td>{part['Unit Description']}</td>*/}
                <td>{part['Serial #']}</td>
                <td>{part['(Unit No)']}</td>
                <td>{part['expected']}</td>
                <td>{part['actual']}</td>
                <td>{part['difference']}</td>
              </tr>
            })}
            </tbody>
          </Table>
      </>
    );
  }
  
  export default ReportTable;