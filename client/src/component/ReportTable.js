//import '../styles/ReportTable.scss';
import Table from 'react-bootstrap/Table';

function ReportTable(props) {
    
    // Sort table data by category
    props.values.sort((a, b) => {
      
      /**DEV NOTE -  
       * The below old way or soring worked, but WWs export doesn't sort seem to sort Cat -> PN -> SN 
       * Updated code sorts by line (created when the physical count file is parsed) and then SN
       * 
       * */
      // let aCat = a.Category || Infinity;
      // let bCat = b.Category || Infinity;

      // let aSerialNumber = a["Serial #"]|| Infinity;
      // let bSerialNumber = b["Serial #"]|| Infinity;

      // if (aCat !== undefined && bCat !== undefined) {
      //   if( aCat !== bCat){
      //     return aCat - bCat;
      //   }
      // } else if (aCat !== undefined) {
      //   return -1; 
      // } else if (bCat !== undefined) {
      //   return 1; 
      // } 
      // return aSerialNumber < bSerialNumber ? -1 : aSerialNumber > bSerialNumber ? 1 : 0;
      /** END OLD CODE */

      /** NEW CODE */
      /** Sorts by line then SN. '|| Infinity' handles a or b has an undefined 'line' or 'serial #'  */
      let aLine = a["Line"] || Infinity;
      let bLine = b["Line"] || Infinity;

      let aSerialNumber = a["Serial #"]|| Infinity;
      let bSerialNumber = b["Serial #"]|| Infinity;

        // First compare by line_number
        if (aLine !== bLine) {
          return aLine - bLine;  // Ascending order by line_number
        }
        // If line_number is the same, compare by serial_number
        return aSerialNumber < bSerialNumber ? -1 : aSerialNumber > bSerialNumber ? 1 : 0;
    });
    
    return (
      <>
          <Table striped bordered hover>
            <thead>
            <tr>
              {/** <th>Line</th> */}
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
                {/** <td>{part['Line']}</td> */}
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