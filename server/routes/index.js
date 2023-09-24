var express = require('express');
var router = express.Router();

// Use .env file to store environment variables
// Access with dotenv package
// https://www.coderrocketfuel.com/article/store-mongodb-credentials-as-environment-variables-in-nodejs
const dotenv = require("dotenv")
dotenv.config()


const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2fbrmbe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

async function getAllInventory(res) {
    let r = [];
    try {
        const database = client.db('hme');
        const collection = database.collection('inventory');

        // Execute query 
        const query = {};
        const options = {};
        const cursor = collection.find(query, options);

        // Print a message if no documents were found
        if ((await collection.countDocuments(query)) === 0) {
            console.log("No documents found!");
        }
        // push documents to return array
        for await (const doc of cursor) {
            r.push({
                part_number: doc.part_number,
                quantity: doc.quantity
            })
        }
  
        res.set('Access-Control-Allow-Origin', '*');

        res.json(r);
        res.end();
  
    }catch(e){
        console.log(e);
    }
}


router.get('/inventory', function(req, res, next) {
    getAllInventory(res);
});


module.exports = router;

