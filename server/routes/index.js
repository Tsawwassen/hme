var express = require('express');
var router = express.Router();

//import mongoose from 'mongoose';
var mongoose = require('mongoose');
const Orders = require("../models/orders");

// Use .env file to store environment variables
// Access with dotenv package
// https://www.coderrocketfuel.com/article/store-mongodb-credentials-as-environment-variables-in-nodejs
const dotenv = require("dotenv")
dotenv.config()


const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2fbrmbe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

mongoose.connect(uri)
.then(() => {
    console.log('Mongoose Connected!');
    });



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


router.route('/orders')
    .all(function (req, res, next) {
        console.log("inside /orders ALL");
        //This code block will always run when server receives any /orders route requests, then go to the 
        next()
    })
    .get(function (req, res, next) {
        console.log("GET ORDERS!!");
        //res.send("GET ORDERS!!");
        Orders.find({})
        .then (order => {
            //console.log(order);
            res.json({status: "success", data: order});
        }).catch(error => {
            res.json({status: "error", data: error});
        });
    })
    .put(function (req, res, next) {
        console.log("PUT / UPDATE ORDERS!!");
        //res.send("PUT / UPDATE ORDERS!!");
        Orders.findOne({})
        .then(order => {
            order.rep = order.rep + "1";
            order.save();
            res.json({status: "success", data: order});
        })
        .catch(error => {
            res.json({status: "error", data: error});
        });
    })
    .post(function (req, res, next) {
        console.log("POST / ADD ORDERS!!");
        //res.send("POST / ADD ORDERS!!");
        Orders.create({
            orderNumber: "ORDER NUMBER TEST",
            rep: "TEST REP"
        }).then( order => {
            res.json({status: "success", data: order})
        }).catch(error => {
            res.json({status: "error", data: error});
        });
    })
    .delete(function (req, res, next) {
        console.log("DELETE ORDERS!!");
        //res.send("DELETE ORDERS!!");
        Orders.findOneAndDelete({})
        .then(order => {
            order.delete;
            res.json({status: "success", data: order});
        })
        .catch(error => {
            res.json({status: "error", data: error});
        });
    })

module.exports = router;

