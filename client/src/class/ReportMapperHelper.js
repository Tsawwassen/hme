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
    
    // Get content from given files
    // Show error message if file cannot be opened
    // Once both files are parsed, send them both to callback function
    // TODO : Not a fan of this nested double code, but I needed a way to get data from both files and then send them up to Inventory component.
    static getDoubleFileContent(expectedPath, actualPath, callback, expectedErrorMessage, actualErrorMessage){
        let efd = [];
        let afd = [];
        let fileReader = new FileReader();
        
        fileReader.onloadend = () => {
            efd = this.formatCSVData(fileReader.result);
            fileReader.onloadend = () => {
                afd = this.formatCSVData(fileReader.result);
                callback(efd, afd);
            };
            try{
                // Read file from given path
                fileReader.readAsText(actualPath);
             } 
             catch(error){ 
                // Show alert message if file cannot be opened
                alert(actualErrorMessage);
            };
        };
        try{
            // Read file from given path
            fileReader.readAsText(expectedPath);
         } 
         catch(error){ 
            // Show alert message if file cannot be opened
            alert(expectedErrorMessage);
        }; 
    }

    // Get content from given file
    // Show error message if file cannot be opened
    // Once file is parsed, format scannedParts list to be same as expectedPath data, then send them both to callback function
    static getSingleFileContent(expectedPath, scannedParts, callback, expectedErrorMessage){
        //console.log("inside NEW GET FILE CONTENT");
        let efd = [];
        let afd = [];
        let fileReader = new FileReader();
                
        fileReader.onloadend = () => {
            efd = this.formatCSVData(fileReader.result);
            afd = this.formatScannedData(scannedParts, Object.keys(efd[0]));
            callback(efd, afd);
        };
        try{
            // Read file from given path
            fileReader.readAsText(expectedPath);
        } 
        catch(error){ 
            // Show alert message if file cannot be opened
            alert(expectedErrorMessage);
        };
    }

    //Get content from server and format scanned data
    // TODO : don't like that I have the headers/keys hard coded, but it works.
    static mapServerAndScannedData(scannedParts, callback){
        
        let afd = this.formatScannedData(scannedParts, ["part_number",	"quantity"]);
        
    }

}
export default ReportMapperHelper;