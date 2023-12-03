//Helper class to map input for from different places into a way the report component can render the data

//TODO : All the get functions should be renamed to say what they are mapping.
//      The format function names are clear

import FileReaderHelper from '../class/FileReaderHelper';

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
     * Format WW export
     * - Use (Unit No) column of upload file to format data that is used on the report
     * 
     * *** Dev Note ***
     * - This is not an idea use case scenario. Some items on the WW export don't have a unit number
     * - Need to be consistant for scanned inventory and WW export to show an acurate report
     * 
     */
    static formatWWData(data, k){
        let temp = {};


        /**
         * TODO
         * 1. DONE - Ignore blank line(s)
         * 2. Don't break if a cell has double quotes
         * 3. Expected records should be 269
         */
        data.forEach(part =>{
            if(!this.areAllValuesEmpty(part)){
                if(temp.hasOwnProperty(part['(Unit No)'])){
                    temp[part['(Unit No)']] = temp[part['(Unit No)']] + 1; 
                }
                else{
                    temp[part['(Unit No)']] = 1;
                }
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
    static async getDoubleFileContent(expectedPath, actualPath, callback, expectedErrorMessage, actualErrorMessage){ 
        callback(
            FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(expectedPath)),
            FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(actualPath))
        )
     
    }

    // Get content from given file
    // TODO : now that the code is running asyncronously, need to show and catch better error messages. Keeping error message variables for future use.
    // Once file is parsed, format scannedParts list to be same as expectedPath data, then send them both to callback function
    static async getSingleFileContent(expectedPath, scannedParts, callback, expectedErrorMessage){
        //Switch the first and second argument for test upload file and WW upload file
        callback(
            //FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(expectedPath)),
            this.formatWWData(FileReaderHelper.ParseCSV(await this.readUploadedFileAsText(expectedPath)), ["part_number","quantity"]),
            this.formatScannedData(scannedParts, ["part_number","quantity"])
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