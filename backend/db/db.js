require("dotenv").config();
const { MongoClient } = require("mongodb");

const dbURI = process.env.MONGO_URI;

const client = new MongoClient(dbURI, {
    tls: true,
    tlsAllowInvalidCertificates: false,  // change to true only for testing
});

let db;

async function connectDB() {
    if (db) return db;

    await client.connect();
    db = client.db("myGameDB");
    console.log("Connected to MongoDB");
    return db;
}

module.exports = connectDB;
