//TODO : Work on the CSS for the table. 
//      - Use react-bootstrap tables?
import '../styles/ReportTable.css';

function ReportTable(props) {
    
    //Need to initialize keys variable to be used in the tbody render
    //Might be a better way of doing this, but not sure how to reference the keys array inside the map function
    let keys = Object.keys(props.values);
    return (
      <>
          <table>
            <thead>
            <tr>
                <th>Part Number</th>
                <th>Expected</th>
                <th>Actual</th>
                <th>Difference</th>
            </tr>
            </thead>
            <tbody>
            {keys.map((part, i) => {
                // DEV NOTE : might need to do 'actual_qty - expected_qty' and not 'expected_qty - actual_qty'
                //              -Check with end user
                return <tr key={i}>
                            <td>{part}</td>
                            <td>{props.values[keys[i]].expected_qty}</td>
                            <td>{props.values[keys[i]].actual_qty}</td>
                            <td>{ props.values[keys[i]].expected_qty - props.values[keys[i]].actual_qty}</td>
                        </tr>
            })}
            </tbody>
          </table>
      </>
    );
  }
  
  export default ReportTable;