class FileReaderHelper {
    static classTest = "Varialbe";

    static classTestFunction(i){
        console.log("inside function");
        console.log(`Variable ${i}`);
    }

    static formatData(data){
        data = data.replaceAll("\r","");
        const csv = data.split('\n');

        const headers = csv.shift().split(',');
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

        tempData.forEach((row, i)=>{
            //Convert quantity column values to int
            tempData[i].quantity = parseInt(tempData[i].quantity);
        });
        return tempData;
    };
    
    static getFileContent(path, callback, errorMessage){
        let fileReader = new FileReader();
        fileReader.onloadend = () => {
            callback(this.formatData(fileReader.result));
        };
        try{
           fileReader.readAsText(path);
         } 
         catch(error){ alert(errorMessage);}; 
    } 
}
export default FileReaderHelper;