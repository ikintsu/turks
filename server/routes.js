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

async function delete_tattoo(req, res) {
    console.log(req.body.url);

    const dbConnect = dbo.getDb();
    dbConnect
        .collection('Tattoo')
        .deleteOne({ image: req.body.url })
        .then((result) => res.status(200).json({ count: result.deletedCount }))
}

async function update_tattoo(req, res) {
    const { image, data } = req.body
    const { tags, body } = data;

    // console.log(req.body);
    // res.status(201);

    const dbConnect = dbo.getDb();
    dbConnect
        .collection('Tattoo')
        .updateOne({ image }, { $set: {
            reviewed: true,
            is_tattoo: true,
            data: data,
            image: image
        } }, { upsert: true })
        .then(result => {
            console.log('success');
            res.status(201).json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
        })
}





module.exports = {
    post_tattoo,
    get_single_tattoo,
    delete_tattoo,
    update_tattoo
}
