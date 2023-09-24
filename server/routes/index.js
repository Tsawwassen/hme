var express = require('express');
var router = express.Router();

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://mitchell:Zxbpx068rq3RhRIB@cluster0.2fbrmbe.mongodb.net/?retryWrites=true&w=majority";
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

  res.send(r);
  
  } finally {
  }
}


router.get('/inventory', function(req, res, next) {
  getAllInventory(res);
});


module.exports = router;

