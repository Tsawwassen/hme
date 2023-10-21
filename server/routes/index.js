var express = require('express');
var router = express.Router();

const Orders = require("../models/Order");
const Inventory = require("../models/Inventory");

// Use .env file to store environment variables
// Access with dotenv package
// https://www.coderrocketfuel.com/article/store-mongodb-credentials-as-environment-variables-in-nodejs
const dotenv = require("dotenv")
dotenv.config()

var mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2fbrmbe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri)
.then(() => {
    console.log('Mongoose Connected!');
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.route('/inventory')
.all(function (req, res, next) {
    next();
})
.get(function (req, res, next) {
     Inventory.find({})
     .then(inventory=>{
         res.json(inventory);
         res.end();
     }).catch(error => {
         res.json({status: "error", data: error});
     });
});


router.route('/orders')
    .all( function (req, res, next) {
        next();
    })
    .options(function (req, res, next){
        next ();
    })
    .get(function (req, res, next) {
        //Get Order
        Orders.find({})
        .then (order => {
            res.json({status: "success", data: order});
        }).catch(error => {
            res.json({status: "error", data: error});
        });
    })
    .put(function (req, res, next) {
        //Update Order
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
        //Add Order
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
        //Delete Order
        Orders.findOneAndDelete({})
        .then(order => {
            order.delete;
            res.json({status: "success", data: order});
        })
        .catch(error => {
            res.json({status: "error", data: error});
        });
    });

module.exports = router;

