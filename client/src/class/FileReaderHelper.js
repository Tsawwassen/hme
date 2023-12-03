import Papa from 'papaparse';

class FileReaderHelper {
    static ParseCSV(content) {

        let csv =  Papa.parse(content, {
            header: true,
            skipEmptyLines: 'greedy',
            complete: function(results) {
              return results.data;
            }
          });
          
          //The Papa.parse function would return an object. Needed to use a temp variable.data to return the actual file data to be used with the rest of the app
          return csv.data;

          /**
           * DEV NOTE
           *  PapaParse does all the parsing checks that the below code was doing (Except handeling commas)
           *  use 'greedy' for skipEmptyLine to truely skip empty lines. Only having it as true would still keep empty cells
           * Keeping the below code here for reference
           */
           
          /** 
        //Remove \r character that appears when file is parsed, then split rows on \n
        const csv = content.replaceAll('\r', '').replaceAll('"', '').split('\n');

        //First row is headers
        const headers = csv.shift().split(',');
*/
        /**
         * -Create return table
         * -Add rows to return table, skipping empty rows
         *
         * TODO : this code can probably be cleaned up A LOT, but it is working
         *    The first CSV forEach loop can probably be added into the other forEach loops
         */
        /** 
        const table = [];
        csv.forEach((row) => {
            if(row === "") return; //skip row if row is empty, will continue parsing the file
            table.push(row.split(','));
        });
        
        const tempData = []
        table.forEach((row, i) => {
            tempData[i] = {};
            row.forEach((cell, j) =>{
                tempData[i][headers[j]] =  cell;
            });
        });
        
        console.log("Inside FileReaderHelper.ParseCSV");
        

        return tempData;*/
    }

    // DEV NOTE - Is this function needed anymore?
    static ParseWWCSV(content) {

        //Remove \r character that appears when file is parsed, then split rows on \n
        const csv = content.replaceAll('\r', '').split('\n');

        //First row is headers
        const headers = csv.shift().split(',');

        /**
         * -Create return table
         * -Add rows to return table, skipping empty rows
         *
         * TODO : this code can probably be cleaned up A LOT, but it is working
         *    The first CSV forEach loop can probably be added into the other forEach loops
         */
        console.log("ParseWWCSV");
        debugger
        const table = [];
        csv.forEach((row) => {
            if(row === "") return; //skip row if row is empty, will continue parsing the file
            table.push(row.split(','));
        });
        
        const tempData = []
        table.forEach((row, i) => {
            tempData[i] = {};
            row.forEach((cell, j) =>{
                tempData[i][headers[j]] =  cell;
            });
        });
        
        //console.log("inside FILEREADERHELPER.PARSECSV");
        //debugger

        return tempData;
    }
}

export default FileReaderHelper;