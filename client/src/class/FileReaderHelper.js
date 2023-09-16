//Helper class to read and parse CSV files

class FileReaderHelper {

    //Format CSV data to JSON object array
    static formatData(data){

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
    
    // Get content from given files
    // Show error message if file cannot be opened
    // Once both files are parsed, send them both to callback function
    // TODO : Not a fan of this nested double code, but I needed a way to get data from both files and then send them up to Inventory component.
    static getDoubleFileContent(expectedPath, actualPath, callback, expectedErrorMessage, actualErrorMessage){
        let efd = [];
        let afd = [];
        let fileReader = new FileReader();
        
        fileReader.onloadend = () => {
            efd = this.formatData(fileReader.result);
            fileReader.onloadend = () => {
                afd = this.formatData(fileReader.result);
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
    static getSingleFileContent(expectedPath, scannedParts, callback, expectedErrorMessage){
        console.log("inside NEW GET FILE CONTENT");
    }
}
export default FileReaderHelper;