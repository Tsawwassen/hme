//Helper class to map input for from different places into a way the report component can render the data

//TODO : All the get functions should be renamed to say what they are mapping.
//      The format function names are clear

import FileReaderHelper from '../class/FileReaderHelper';
import * as XLSX from 'xlsx';

class ReportMapperHelper {

    //Format an array of parts
    // If the part is listed multiple times, increase the quantity
    // return format is [... {part_number: STRING, quantity: INT}...]
    static formatScannedData(data, k){
        //Loop data array
        // //Check if the current part number is in the return array
        // // // if it is, add +1 to quantity
        // // // Else, add current part number to return array, and set quantity to 1

        // Loop data, and make a JSON object of {...,part_number: quantity,...}, then loop that object to make the return format array.
        let temp = {};
        data.forEach(part =>{
            if(temp.hasOwnProperty(part)){
                temp[part] = temp[part] + 1; 
            }
            else{
                temp[part] = 1;
            }
        });
    
        //Parse JSON Object to create return array that will be used in the report component.
        let r = [];
        Object.keys(temp).forEach(function(part) {
            let t = {};
             t[this[0]] = part;
             t[this[1]] = temp[part];
        
            r.push(t)
        }, k); // DEV NOTE : Can't use an arrow function and have the 'thisValue' available inside the block. Need to use 'forEach(function(part ... {}, thisValue))
        
        return r;
    }

    /**
     * Check if a JSON object is empty
     * Code generated from ChatGPT
     * 
     */
    static areAllValuesEmpty(obj){
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
                return false; // If any value is not empty, return false
              }
            }
        }
        return true; // All values are empty
    }

    /**
     * Helper function to see if a given array has a key value pair.
     * If it does, return the index
     * 
     */
    static getIndexForKeyValuePair(array, key, value){
        
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
              return i; // Return the index if found
            }
          }
          return -1; // Return -1 if not found
        
    }
    
    /**
     * Format WW export
     * - Use (Unit No) column of upload file to format data that is used on the report
     * 
     * *** Dev Note ***
     * - This is not an idea use case scenario. Some items on the WW export don't have a unit number
     * - Need to be consistant for scanned inventory and WW export to show an acurate report
     * 
     */
    static formatWWData(data, k){
        let temp = [];
        let index;

        /**
         * TODO
         * 1. DONE - Ignore blank line(s)
         * 2. DONE - Don't break if a cell has double quotes
         * 3. DONE - Input data can't have comma (,) in cell values
         * 4. TEST CASE WORKING - Expected records should be 270
         * DEV NOTE - A lot of these TODOs were solved by PapaParser
         */
        
        data.forEach(part =>{

            if(part['(Unit No)'] === ""){
                if(part['Serial #'] === "") return;
                else part['(Unit No)'] = part['Serial #'];
            }

            index = this.getIndexForKeyValuePair(temp, '(Unit No)', part['(Unit No)']);

            if(index === -1){;
               part['expected'] = 1;
               temp.push(part); 
            } else {
                temp[index]['expected'] += 1;
            }
        });

        return temp;
    }
    
    // Read file asyncronously
    //return promise
    static readUploadedFileAsText(inputFile) {
        const fr = new FileReader();
        return new Promise((resolve, reject) => {
          fr.onerror = () => {
            fr.abort();
            reject(new DOMException("Problem parsing input file."));
          };
      
          fr.onloadend = () => {
            resolve(fr.result);
          };
          fr.readAsText(inputFile);
        });
      };

    // Get content from given files
    // TODO : now that the code is running asyncronously, need to show and catch better error messages. Keeping error message variables for future use.
    // Once both files are parsed, send them both to callback function
    static async getDoubleFileContent(expectedPath, actualPath, callback){ 
        //Need the actual file to look like scanned parts that is used inside getSingleFileContent
        // // Scanned data is just an array of strings -> ['123', '123', '123']
        // console.log(FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(actualPath)))
        // Current FileReaderHelper.ParseCSV is taking the first part as the column header
        // Need to change an the papaparse to not check for headers, then figure out how to make it an array

        //console.log(FileReaderHelper.ParseCSVNoHeader(await this.readUploadedFileAsText(actualPath)))
        // setting header to false returns an array or arrays. with the given test file, each record has one value
        //console.log(FileReaderHelper.ParseCSVNoHeader(await this.readUploadedFileAsText(actualPath)))
        // Papaparse will always return a 2D array. Needed to use a mapping function to get the 2D array into a 1D array to be used by the report

        
        callback(
            this.formatWWData(FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(expectedPath))),
            FileReaderHelper.ParseCSVNoHeader(await this.readUploadedFileAsText(actualPath))
        )
     
    }

    // Get content from given file
    // TODO : now that the code is running asyncronously, need to show and catch better error messages. Keeping error message variables for future use.
    // Once file is parsed, format scannedParts list to be same as expectedPath data, then send them both to callback function
    static async getSingleFileContent(expectedPath, scannedParts, callback){
        callback(
            this.formatWWData(FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(expectedPath))),
            scannedParts
        )
    }

    /** DEV NOTE
     * Decided to make the inventory app just export the processed file rather then render a table then click export
     * Because the data was getting passed from one component to another, I copy pasted the code here and changed the variable names
     * It's 300 lines of code(with comments)... Not ideal. Should move things into functions... but it works :)
     * 
     * 
     */
    static async getTripleFileContentForExport(pcPath, unitPath, scannedPart){
        let pcData =  FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(pcPath));
        let unitData =  this.formatWWData(FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(unitPath)));
        let scannedData =  FileReaderHelper.ParseCSVNoHeader(await this.readUploadedFileAsText(scannedPart));

        // Sort the physical count by category
        //// Seems to be keeping the p# in the correct order while still sorting by category.
        pcData.sort((a,b) => {
            return a[" Category "] < b[" Category "] ? -1 : a[" Category "] > b[" Category "]  ? 1 : 0;
        })

        // Add line number to keep the same order as the physical count sheet
        for(let i = 0 ; i < pcData.length ; i++){
            pcData[i]["Line Number"] = i + 1;
        }

        
        /**
         * Things to remove are : 
         *  - - - Remove lines that are on rental (Rental Stage)
         *  - - - - Only keep lines with "Available" and "Non-Rental Part"
         *  - - - Remove sold items (Stock Status)
         *  - - - - Only keep lines with "In Stock" and "Special Orders Reveived"
         *  - - - Remove lines where the "Serial Number" and "Invetory Part" are the same
         *  - - - - FSG440 is a non-serialized part, but was serialized at one point. looks like legacy data
         *  - - - - This logic also removed the ".R-SEA-MISC"
         */

        let filteredUnitData = [];
        
         unitData.forEach( unit => {
             if(unit["Serial #"] === unit["Inventory Part"]) {
                 return;
             }

             if((unit["Rental Stage"] === "Available") || (unit["Rental Stage"] === "Non-Rental Part")) {
                 if((unit["Stock Status"] === "In Stock") || (unit["Stock Status"] === "Special Order Received")) {
                     filteredUnitData.push(unit);
                    return;
                }
            }
         })

        /**
         * 1. Loop unitData
         * 1.2. Search unit[Inventory Part] in pcData[Part Number]. If found add pc[Category] to unit.
         * 2. Loop pcData
         * 2.1. Search pc[Part Number] in unit[Inventory Part]. If NOT found add pc to unitData (Match the info the best I can). pc[Quantity] will be the expected
         * 3. Send formatted unitData and scannedData to the callback?
         */
        
        let index = 0
        
        //Units get category in this loop.
        //Not sure if I can delete the line in the loop, or i need to filter it out later
        filteredUnitData.forEach( unit =>{
            index = this.getIndexForKeyValuePair(pcData, ' Part Number', unit['Inventory Part']);

            if(index >= 0){
                unit["Category"] = pcData[index][" Category "];
                unit["Line"] = pcData[index]["Line Number"];
            }
        });

        // Remove units that don't have a category
        //      -There is a chance that an item is in the unit table, but it is not on the current physical count file
        //      -DEV NOTE - Not recomended to remove the item in the above for each loop because when the loop starts, it saves the length of the array and does not adjust the length during the loop. 
        //                  - It would probably skip items
        //      - Could probably change the forEach loop to a proper for loop. not sure what is good practise. But this way makes the code loop the array twice.
        filteredUnitData = filteredUnitData.filter(unit => unit.hasOwnProperty('Category'));

        pcData.forEach( part => {
            index = this.getIndexForKeyValuePair(filteredUnitData, "Inventory Part", part[" Part Number"]);
            if(index === -1){
                filteredUnitData.push({
                    "Inventory Part": part[" Part Number"],
                    "Make":  part[" Supplier"],
                    "Model":  part[" Description"],
                    "expected": part[" Quantity"],
                    "Category": part[" Category "],
                    "Line": part["Line Number"]
                })
            }
        });
        //DEV NOTE - idk why i did a map here over a forEach loop....
        let cleanScannedData = scannedData.map(element => element.trim());
        
       
        let expected = filteredUnitData;
        let actual =  cleanScannedData;
        
        //Get the counts of each item in the actual file, then build it into a JSON object array [..., {part:"", quantity: n },...]
        let scanCounts = actual.reduce((acc, part) => {
            acc[part] = (acc[part] || 0) + 1;
            return acc;
        }, {});
        let scanCountsArray = Object.entries(scanCounts).map(([part, quantity]) => ({
            part,
            quantity
        }));

        //Loop the expected array.
        let r = expected.map((part) => {
            //set index to -1 so handle if the first item searched is not in the list.
            let index = -1;

            //check if the current part has the unit no key.
            // if it does, use that key:value to find the index in the scannedCountsArray.
            // Else use the inventory part key:value.
            if(part.hasOwnProperty("(Unit No)")){
                index = scanCountsArray.findIndex( obj => obj['part'] === part['(Unit No)']);
            } else {
                index = scanCountsArray.findIndex( obj => obj['part'] === part['Inventory Part']);
            }
          
            // if the part is not found in the scannedCountsArray, set the actual to 0, and calculate difference.
            // Else, use the index to find the quantity in the scannedCountsArray, set actual, calculate the difference, and remove the part from the scanCountsArray.
            if(index === -1){
                return {...part, actual: 0, difference: part["expected"] - 0 };
            } else {
                let foundPart = scanCountsArray.splice(index, 1);
                return {...part, actual: foundPart[0].quantity, difference: part["expected"] - foundPart[0].quantity};

            }
        });

        //Add remaining scanCountsArray items to return array since they were not expected but were scanned.
        scanCountsArray.forEach((scan) => {
            let temp = {
                         "Inventory Part": "",
                         "Make": "",
                         "Model": "",
                         "Serial #": "",
                         "(Unit No)": scan.part,
                         "Inventory Desc": "",
                         "Department": "",
                         "expected": 0,
                         "actual": scan.quantity,
                         "difference": 0 - scan.quantity
                     }
            r.push(temp);

        })

        r.sort((a, b) => {
      
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
        /** CSV Export Code */
       /**  const csvBlob = new Blob([Papa.unparse(report, {
            quotes: true,      // Enable quoting of all values
            quoteChar: '"',    // Use double quotes as the quote character
            delimiter: ',',     // Use a comma as the delimiter
            columns: [  "Line",
                        "Category",	
                        "Inventory Part",	
                        "Make",	
                        "Model",	
                        "Serial #",	
                        "(Unit No)",	
                        "expected",	
                        "actual",	
                        "difference",
                        "Note"]
          })], { type: 'text/csv;charset=utf-8' });
          
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(csvBlob);
          downloadLink.download = 'Inventory-Report.csv';
          downloadLink.click();
          /** End CSV Export Code */

        const columns = [
            "Line",
            "Category",
            "Inventory Part",
            "Make",
            "Model",
            "Serial #",
            "(Unit No)",
            "expected",
            "actual",
            "difference",
            "Note"
        ];
        // Map the report data to include only the specified columns
        const filteredReport = r.map(line => {
            let filteredLine = {};
            columns.forEach(col => {
                if ((col === 'expected')||(col === 'actual'))  {
                    filteredLine[col] = line[col] !== undefined && line[col] !== null ? parseInt(line[col], 10) : 0;
                } else {
                    filteredLine[col] = line[col] !== undefined && line[col] !== null ? String(line[col]) : '';
                }
            });
            return filteredLine;
        });

        const worksheet = XLSX.utils.json_to_sheet(filteredReport, { header: columns });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

        // Add formula to the difference column
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const expectedCell = XLSX.utils.encode_cell({ r: row, c: columns.indexOf('expected') });
            const actualCell = XLSX.utils.encode_cell({ r: row, c: columns.indexOf('actual') });
            const differenceCell = XLSX.utils.encode_cell({ r: row, c: columns.indexOf('difference') });
            worksheet[differenceCell].f = `${actualCell}-${expectedCell}`;
        }
        
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(excelBlob);
        downloadLink.download = 'Inventory-Report.xlsx';
        downloadLink.click();
    }


    static async getTripleFileContent(pcPath, unitPath, scannedPart, callback){
    
        let pcData =  FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(pcPath));
        let unitData =  this.formatWWData(FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(unitPath)));
        let scannedData =  FileReaderHelper.ParseCSVNoHeader(await this.readUploadedFileAsText(scannedPart));
        
        /**
         * OUTDATED: Keeping this here to document my old logic for this problem
         * - Add boolean flag to pcData if the part number is serialized
         * - Add serial numbers from unitData to pcData lines that are serialized
         * - Add actual count to pcData (use quantity for expected)
         * - use scannedData to update actual count
         * - Need to handle items that are left in unitData and scannedData 
         * - 
         */

        // Sort the physical count by category
        //// Seems to be keeping the p# in the correct order while still sorting by category.
        pcData.sort((a,b) => {
            return a[" Category "] < b[" Category "] ? -1 : a[" Category "] > b[" Category "]  ? 1 : 0;
        })

        // Add line number to keep the same order as the physical count sheet
        for(let i = 0 ; i < pcData.length ; i++){
            pcData[i]["Line Number"] = i + 1;
        }

        
        /**
         * Things to remove are : 
         *  - - - Remove lines that are on rental (Rental Stage)
         *  - - - - Only keep lines with "Available" and "Non-Rental Part"
         *  - - - Remove sold items (Stock Status)
         *  - - - - Only keep lines with "In Stock" and "Special Orders Reveived"
         *  - - - Remove lines where the "Serial Number" and "Invetory Part" are the same
         *  - - - - FSG440 is a non-serialized part, but was serialized at one point. looks like legacy data
         *  - - - - This logic also removed the ".R-SEA-MISC"
         */

        let filteredUnitData = [];
        
         unitData.forEach( unit => {
             if(unit["Serial #"] === unit["Inventory Part"]) {
                 return;
             }

             if((unit["Rental Stage"] === "Available") || (unit["Rental Stage"] === "Non-Rental Part")) {
                 if((unit["Stock Status"] === "In Stock") || (unit["Stock Status"] === "Special Order Received")) {
                     filteredUnitData.push(unit);
                    return;
                }
            }
         })

        /**
         * 1. Loop unitData
         * 1.2. Search unit[Inventory Part] in pcData[Part Number]. If found add pc[Category] to unit.
         * 2. Loop pcData
         * 2.1. Search pc[Part Number] in unit[Inventory Part]. If NOT found add pc to unitData (Match the info the best I can). pc[Quantity] will be the expected
         * 3. Send formatted unitData and scannedData to the callback?
         */
        
        let index = 0
        
        //Units get category in this loop.
        //Not sure if I can delete the line in the loop, or i need to filter it out later
        filteredUnitData.forEach( unit =>{
            index = this.getIndexForKeyValuePair(pcData, ' Part Number', unit['Inventory Part']);

            if(index >= 0){
                unit["Category"] = pcData[index][" Category "];
                unit["Line"] = pcData[index]["Line Number"];
            }
        });

        // Remove units that don't have a category
        //      -There is a chance that an item is in the unit table, but it is not on the current physical count file
        //      -DEV NOTE - Not recomended to remove the item in the above for each loop because when the loop starts, it saves the length of the array and does not adjust the length during the loop. 
        //                  - It would probably skip items
        //      - Could probably change the forEach loop to a proper for loop. not sure what is good practise. But this way makes the code loop the array twice.
        filteredUnitData = filteredUnitData.filter(unit => unit.hasOwnProperty('Category'));

        pcData.forEach( part => {
            index = this.getIndexForKeyValuePair(filteredUnitData, "Inventory Part", part[" Part Number"]);
            if(index === -1){
                filteredUnitData.push({
                    "Inventory Part": part[" Part Number"],
                    "Make":  part[" Supplier"],
                    "Model":  part[" Description"],
                    "expected": part[" Quantity"],
                    "Category": part[" Category "],
                    "Line": part["Line Number"]
                })
            }
        });
        //DEV NOTE - idk why i did a map here over a forEach loop....
        let cleanScannedData = scannedData.map(element => element.trim());
        
        callback(
            filteredUnitData,
            cleanScannedData
        )
    }

    //Async function to get data from server.
    // return format is [... {part_number: STRING, quantity: INT}...]
    // DEV NOTE : Assume that the server does not have duplicate part_numbers

    /**
     * ---Async / Await / Fetch Notes---
     * Misc notes that might help me understand this function for future code
     * * 'await' can only be used inside async functions
     * * If a function is making an API call, like getServerData, the function must return a Promise
     * * * The code that is calling the API function needs await before the code is ran so that it knows to wait for a return value before continueing the code.
     * * The Fetch code returns a response, that response is returned as a JSON, and then used in the last Then block.
     * ---Still Need to Learn---
     * Tried playing around with the response object, not sure how it changes to data in the next Then block
     */
    static getServerData(){
        return new Promise((resolve, reject) => {
            fetch("http://localhost:8080/inventory")
            .then(response => {
                return response.json();
            }).then(data => {
                resolve(data);
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }

    //Get content from server and format scanned data
    // TODO : don't like that I have the headers/keys hard coded, but it works.
    static async mapServerAndScannedData(scannedParts, callback){
        callback(
            await this.getServerData(), 
            this.formatScannedData(scannedParts, ["part_number", "quantity"])
            );
    }
}

export default ReportMapperHelper;