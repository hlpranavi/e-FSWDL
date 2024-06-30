const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/';
const DB_NAME = 'your_database_name';
const COLLECTION_NAME = 'your_collection_name';

const data = [
   
];

async function insertData() {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    try {
        await client.connect();
        console.log("Connected to the database");

        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);

        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents were inserted successfully.`);
    } catch (error) {
        console.error("Error inserting documents:", error);
    } finally {
        await client.close();
        console.log("Connection to the database closed.");
    }
}

insertData();
