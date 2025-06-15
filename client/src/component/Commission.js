// Packages
import { useState } from 'react'
import {Button, Alert} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

// Helpers
import FileReaderHelper from '../class/FileReaderHelper';
  
function Commission(){
  
    const [ar_report_path, set_ar_report_path] = useState();
    const [inv_by_rep_path, set_inv_by_rep_path] = useState();
    const [errorMessage, setErrorMessage] = useState("");
 
    // Update file paths when input field is changed
    function updateARPath(e){
        e.preventDefault();
        set_ar_report_path( e.target.files[0]);
        setErrorMessage("");
    }
    function updateInvByRepPath(e){
        e.preventDefault();
        set_inv_by_rep_path( e.target.files[0]);
        setErrorMessage("");
    }

    // On submit, check if the files are valid, then send to formatData function
    function handleSubmit(e){
     
        let validARReport = FileReaderHelper.validExcelFileCheck(ar_report_path)
        let validInvByRepReport = FileReaderHelper.validExcelFileCheck(inv_by_rep_path)
     
        if( validARReport.status && validInvByRepReport.status){
            formatData(ar_report_path, inv_by_rep_path);  
        } else {
            setErrorMessage( validARReport.message + '\n' + validInvByRepReport.message );
        }
    }

    // Show error message if there is an error with either of the files
    function showErrorMessage(){
        return (
            <Alert variant="danger">
                <Alert.Heading>Error</Alert.Heading>
                <pre>{errorMessage}</pre>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() =>  {setErrorMessage("");}} >
                        Close me
                    </Button>
                </div>
            </Alert>
        )
    }

    function handleFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async function exportToExcel(data, customer_rows){

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        // Need to ensure that all rows have keys so that the border shows up correctly
        data.forEach(row => {
            if (!row.hasOwnProperty('Sales Rep')) {
                row['Sales Rep'] = '';
            }
            if (!row.hasOwnProperty('Customer')) {
                row['Customer'] = '';
            }
            if (!row.hasOwnProperty('Total')) {
                row['Total'] = '';
            }
        });

        // Define columns
        worksheet.columns = [
            { header: 'Customer', key: 'Customer', width: 45 },
            { header: 'Sales Rep', key: 'Sales Rep', width: 25 },
            { header: 'Total', key: 'Total', width: 20 },
            { header: 'Current', key: 'Current', width: 20 },
            { header: '30', key: '30', width: 15 },
            { header: '60', key: '60', width: 15 },
            { header: '90', key: '90', width: 15 },
        ];

        // Add rows
        data.forEach(row => worksheet.addRow(row));

        const lastRowNumber = worksheet.rowCount ;
        const lastRow = worksheet.getRow(lastRowNumber);

        lastRow.eachCell(cell => {
            cell.border = {
                ...cell.border,
                bottom: { style: 'thin' }, 
                top: { style: 'thin' }
            };
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1 && rowNumber !== lastRowNumber) { 
                row.getCell('Total').numFmt = '#,##0.00';
                row.getCell('Current').numFmt = '#,##0.00';
                row.getCell('30').numFmt = '#,##0.00';
                row.getCell('60').numFmt = '#,##0.00';
                row.getCell('90').numFmt = '#,##0.00';
            }
        });

        // Set font for header row
        worksheet.getRow(1).font = { name: 'Arial', size: 10, bold: true };

        // Set background color for header row (C0C0C0)
        worksheet.getRow(1).eachCell(cell => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFC0C0C0' } // Note the 'FF' prefix for full opacity
            };
        });

        // Set font for all data rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) { // Skip header, already set above
            row.font = { name: 'Arial', size: 10 };
            }
        });

        // Bold specified rows (customer_rows contains indices of rows to bold, not counting header)
        customer_rows.forEach(idx => {
            const excelRow = worksheet.getRow(idx + 2); // +2 because ExcelJS rows are 1-based and row 1 is header
            excelRow.font = { ...excelRow.font, bold: true }; // Keep Arial and size, add bold
            // Add a top border to each cell in the row
            excelRow.eachCell(cell => {
                cell.border = {
                ...cell.border,
                top: { style: 'thin' }
                };
            });
        });

        

        // Write to buffer and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'ar_report_data.xlsx';
        downloadLink.click();
    }

    // Combine the two files and export the file as excel
    async function formatData(ar_report_path, inv_by_rep_path){

          const [ar_report_data, inv_by_rep_data] = await Promise.all([
            handleFile(ar_report_path),
            handleFile(inv_by_rep_path)
        ]);

        /**
         * From inv_by_rep_data, i need the order number and sales rep
         * * sales rep can be accessed by inv_by_rep_data[i].[" Commission % "]
         * * Order number can be accessed by  inv_by_rep_data[i].[" Invoice # "]
         * 
         * From ar_report_data, I need to map the order number from inv_by_rep_data to add the sales rep to one table
         * * Note. This mapping wont check every line. The input file has the customer and order numbers in the first column.
         * * * * My plan is to do a regex on the first column to see if it has a data.
         * * * * If it does have a data, get the order number thats in the middle of other text, look for the order number on the inv_by_rep_data to get the rep and add it to the same row as the order number
         * * Order number can be found by ar_report_data[i].Customer
         * * * * if the value of this key is like "   A S91092 4/25/2025" (for example) its a row that has an order number and needs to be mapped
         * * * * if the value of this key is NOT like above, skip the line, don't map.
         */
        let customer_rows = [];
        ar_report_data.forEach((row,index) => {
            if (/\s*\d{1,2}\/\d{2}\/\d{4}$/.test(row.Customer)) {
                
                const trimmed = row.Customer.trim();
                const parts = trimmed.split(/\s+/); // splits on one or more spaces
                const valueBetweenSpaces = parts[1]; // index 1 is the part between the first and second space

                const match = inv_by_rep_data.find( item => item[" Invoice # "] === valueBetweenSpaces );

                if (match) {
                    // Found a matching object
                    row["Sales Rep"] = match[" Commission % "];
                }
                
            }else{
                customer_rows.push(index);
            }
            
        });

        exportToExcel(ar_report_data, customer_rows);
        
    }
    
    return (<>
        <h1>Commission Report</h1>

        {(errorMessage !== "") && showErrorMessage()}
        <Form>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>AR Report File</Form.Label>
                <Form.Control type="file" onChange={updateARPath}  />
                <Form.Label>Inv By Rep File</Form.Label>
                <Form.Control type="file" onChange={updateInvByRepPath}  />
            </Form.Group>
            <Button variant="primary" type="button" onClick={handleSubmit}>Submit</Button>
        </Form>
    </>);
        
}
  
export default Commission;