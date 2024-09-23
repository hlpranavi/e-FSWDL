const { MongoClient } = require('mongodb');

const MONGODB_URI = 'give ur mgdb url';
const DB_NAME = 'fswdl';
const FACULTY = [
    { "Faculty Name": "B.Radha", "username": "BRDH", "password": "brdh2" },
    { "Faculty Name": "G.Madhu", "username": "GMDH", "password": "gmdh3" },
    { "Faculty Name": "K.Preethi", "username": "KPTH", "password": "kpth4" },
    { "Faculty Name": "P.Geetha", "username": "PGTH", "password": "pgth5" },
    { "Faculty Name": "V.Bhoomi", "username": "VBHM", "password": "vbhm6" },
    { "Faculty Name": "G.Gayatri", "username": "GYTR", "password": "gytr7" },
    { "Faculty Name": "A.Aarya", "username": "AARY", "password": "aary8" },
    { "Faculty Name": "V.Tanya", "username": "VTNY", "password": "vtny9" }
];

async function insertFaculty() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const facultyCollection = db.collection('faculty');
        await facultyCollection.deleteMany({}); // Clear existing data
        const result = await facultyCollection.insertMany(FACULTY);
        console.log('Faculty inserted:', result.insertedCount);
        await client.close();
    } catch (error) {
        console.error('Error inserting faculty:', error);
    }
}

insertFaculty();
