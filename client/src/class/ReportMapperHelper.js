//Helper class to map input for from different places into a way the report component can render the data

//TODO : All the get functions should be renamed to say what they are mapping.
//      The format function names are clear

class ReportMapperHelper {

    //Format CSV data to JSON object array
    static formatCSVData(data){

        // CSV files were showing '\r' and '\n' when file was parsed
        // Remove '\r' and split rows on '\n'
        data = data.replaceAll("\r","");
        const csv = data.split('\n');

        // First row of file should be headers
        // Headers will be used as keys for the JSON object array
        // Remove headers CSV array
        const headers = csv.shift().split(',');
        const table = [];

        // Format CSV file into an array
        csv.forEach((row) => {
            if(row === "") return; //skip row if row is empty, will continue parsing the file
            table.push(row.split(','));
        });
        
        // Build JSON array using headers as keys
        const tempData = []
        table.forEach((row, i) => {
            tempData[i] = {};
            row.forEach((cell, j) =>{
                tempData[i][headers[j]] =  cell;
            });
        });

        //Convert quantity values to integer
        tempData.forEach((row, i)=>{
            tempData[i].quantity = parseInt(tempData[i].quantity);
        });

        return tempData;
    };

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
            this.formatCSVData(await this.readUploadedFileAsText(expectedPath)),
            this.formatCSVData(await this.readUploadedFileAsText(actualPath)),
        )
     
    }

    // Get content from given file
    // TODO : now that the code is running asyncronously, need to show and catch better error messages. Keeping error message variables for future use.
    // Once file is parsed, format scannedParts list to be same as expectedPath data, then send them both to callback function
    static async getSingleFileContent(expectedPath, scannedParts, callback, expectedErrorMessage){
        callback(
            this.formatCSVData(await this.readUploadedFileAsText(expectedPath)),
            this.formatScannedData(scannedParts, ["part_number","quantity"])
        )
    }

    //Async function to get data from server.
    //// Still need to work on Async function handeling.
    //// Would have liked to use 'fetch.then' functions, but I was having asynchronous issues 
    ////// When I tried the fetch.then inside the map function, any variable outside of the fetch block was not accessible.
    ////// When I tried to put the fetch.then inside a async helper function, the server data was not getting received by the time it was needed.
    //// TODO : read up on async solutions on frontend and backend examples.
    // return format is [... {part_number: STRING, quantity: INT}...]
    // DEV NOTE : Assume that the server does not have duplicate part_numbers
    static async getServerData(){
        try {
            const url = 'http://localhost:8080/inventory';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
     
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    //Get content from server and format scanned data
    // TODO : don't like that I have the headers/keys hard coded, but it works.
    static async mapServerAndScannedData(scannedParts, callback){
        let afd = this.formatScannedData(scannedParts, ["part_number",	"quantity"]);
        let efd = await this.getServerData();
        callback(efd, afd);
    }
}

export default ReportMapperHelper;