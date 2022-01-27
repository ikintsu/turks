const dbo = require('./mongoconn');
const axios = require('axios');
const Fernet = require('./f');
const ObjectId = require('mongodb').ObjectId;

function error_message(str) {
    return { status: 400, success: false, error: true, message: str };
}

async function post_tattoo(req, res) {
    console.log(req.query);

    const dbConnect = dbo.getDb();
    dbConnect
        .collection('Tattoo')
        .updateOne({ _id: new ObjectId(req.query._id) }, { $set: req.body })
        .then(obj => {
            console.log(obj);
            res.status(201).json(req.body);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json(error_message("Error in DB"));
        })
}
async function get_single_tattoo(req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('Tattoo')
        .findOneAndUpdate({ reviewed: false }, { $set: { reviewed: true } })
        .then(obj => {
            console.log(obj.value)
            res.status(200).json(obj.value);
        })
        .catch(err => {
            res.status(400).json(error_message("Error in DB"));
        });
}





module.exports = {
    post_tattoo,
    get_single_tattoo
}
