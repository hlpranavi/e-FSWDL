const { MongoClient } = require('mongodb');

const MONGODB_URI = 'give ur MongoDB url';
const DB_NAME = 'fswdl';
const USERS = [
    { "Roll No": "22241A0587", "username": "22241A0587", "password": "220587", "Attendance": 5, "Assignments": 5, "GLOB": 5, "Viva": 5, "Internal Theory": 20, "Total": 40 },
    { "Roll No": "22241A0563", "username": "22241A0563", "password": "220563", "Attendance": 4, "Assignments": 5, "GLOB": 3, "Viva": 3, "Internal Theory": 19, "Total": 34 },
    { "Roll No": "22241A0545", "username": "22241A0545", "password": "220545", "Attendance": 5, "Assignments": 5, "GLOB": 5, "Viva": 5, "Internal Theory": 20, "Total": 40 },
    { "Roll No": "22241A0548", "username": "22241A0548", "password": "220548", "Attendance": 4, "Assignments": 5, "GLOB": 4, "Viva": 2, "Internal Theory": 19, "Total": 34 },
    { "Roll No": "22241A0523", "username": "22241A0523", "password": "220523", "Attendance": 5, "Assignments": 3, "GLOB": 5, "Viva": 4, "Internal Theory": 20, "Total": 37 },
    { "Roll No": "22241A0516", "username": "22241A0516", "password": "220516", "Attendance": 4, "Assignments": 4, "GLOB": 2, "Viva": 2, "Internal Theory": 14, "Total": 26 },
    { "Roll No": "22241A0562", "username": "22241A0562", "password": "220562", "Attendance": 4, "Assignments": 2, "GLOB": 1, "Viva": 3, "Internal Theory": 12, "Total": 22 },
    { "Roll No": "22241A0518", "username": "22241A0518", "password": "220518", "Attendance": 5, "Assignments": 3, "GLOB": 3, "Viva": 3, "Internal Theory": 13, "Total": 27 },
    { "Roll No": "22241A0570", "username": "22241A0570", "password": "220570", "Attendance": 5, "Assignments": 4, "GLOB": 2, "Viva": 3, "Internal Theory": 11, "Total": 25 },
    { "Roll No": "22241A0556", "username": "22241A0556", "password": "220556", "Attendance": 5, "Assignments": 3, "GLOB": 4, "Viva": 1, "Internal Theory": 6, "Total": 19 },
    { "Roll No": "22241A0597", "username": "22241A0597", "password": "220597", "Attendance": 5, "Assignments": 5, "GLOB": 4, "Viva": 2, "Internal Theory": 16, "Total": 32 },
    { "Roll No": "22241A0584", "username": "22241A0584", "password": "220584", "Attendance": 5, "Assignments": 3, "GLOB": 2, "Viva": 1, "Internal Theory": 15, "Total": 26 },
    { "Roll No": "22241A0566", "username": "22241A0566", "password": "220566", "Attendance": 5, "Assignments": 3, "GLOB": 4, "Viva": 1, "Internal Theory": 18, "Total": 31 },
    { "Roll No": "22241A0535", "username": "22241A0535", "password": "220535", "Attendance": 5, "Assignments": 5, "GLOB": 5, "Viva": 2, "Internal Theory": 17, "Total": 34 }
];

async function insertUsers() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const usersCollection = db.collection('students');
        await usersCollection.deleteMany({}); // Clear existing data
        const result = await usersCollection.insertMany(USERS);
        console.log('Users inserted:', result.insertedCount);
        await client.close();
    } catch (error) {
        console.error('Error inserting users:', error);
    }
}

insertUsers();
