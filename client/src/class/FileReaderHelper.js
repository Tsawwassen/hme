class FileReaderHelper {
    static ParseCSV(content) {

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
        
        return tempData;
    }
}

export default FileReaderHelper;