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
    
    // Get content from given file
    // Show error message if file cannot be opened
    // Return file as JSON object array to callback function
    static getFileContent(path, callback, errorMessage){

        let fileReader = new FileReader();
        fileReader.onloadend = () => {
            // Parse file, return to callback
            callback(this.formatData(fileReader.result));
        };
        try{
            // Read file from given path
            fileReader.readAsText(path);
         } 
         catch(error){ 
            //Show alert message if file cannot be opened
            alert(errorMessage);
        }; 
    } 
}
export default FileReaderHelper;