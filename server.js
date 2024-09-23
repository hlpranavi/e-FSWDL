const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'give ur mgdb url';
const DB_NAME = 'fswdl';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: crypto.randomBytes(64).toString('hex'), // Generate a secure session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure: true in production with HTTPS
}));

let db;

async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('Connected to MongoDB server');
        db = client.db(DB_NAME);
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}

function getDb() {
    if (!db) {
        throw new Error('Database connection not established');
    }
    return db;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html as the main page
});

app.post('/loginstudent', async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send('Username and password are required');
            return;
        }

        const usersCollection = getDb().collection('students');
        const trimmedUsername = username.trim();
        console.log('Trimmed Username:', trimmedUsername);

        const user = await usersCollection.findOne({ username: { $regex: new RegExp('^' + trimmedUsername + '$', 'i') } });
        console.log('User Found:', user);

        if (user) {
            if (user.password === password) {
                req.session.user = { type: 'student', details: user };
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(401).send('User not found');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/loginfac', async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send('Username and password are required');
            return;
        }

        const usersCollection = getDb().collection('faculty');
        const trimmedUsername = username.trim();
        console.log('Trimmed Username:', trimmedUsername);

        const user = await usersCollection.findOne({ username: { $regex: new RegExp('^' + trimmedUsername + '$', 'i') } });
        console.log('User Found:', user);

        if (user) {
            if (user.password === password) {
                req.session.user = { type: 'faculty', details: user };
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(401).send('User not found');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/viewMarks', (req, res) => {
    if (!req.session.user || req.session.user.type !== 'student') {
        return res.redirect('/'); // Redirect to login page if not logged in as student
    }
    res.sendFile(path.join(__dirname, 'public', 'viewMarks.html')); // Serve the viewMarks HTML file
});

app.get('/getMarks', (req, res) => {
    if (!req.session.user || req.session.user.type !== 'student') {
        return res.status(401).send('Unauthorized');
    }
    res.json(req.session.user.details); // Send the student details
});



app.get('/loggedin-not', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }
    res.json(req.session.user.details); // Send the student details
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Failed to logout');
        } else {
            res.redirect('/'); // Redirect to the main page after logout
        }
    });
});

app.post('/updateMarks', async (req, res) => {
    
    const { rollNo, attendance, assignments, glob, viva, internalTheory, total } = req.body;

    if (!rollNo || attendance == null || assignments == null || glob == null || viva == null || internalTheory == null || total == null) {
        return res.status(400).send('All fields are required');
    }

    try {
        const studentsCollection = getDb().collection('students');
        const result = await studentsCollection.updateOne(
            { "Roll No": rollNo },
            {
                $set: {
                    "Attendance": attendance,
                    "Assignments": assignments,
                    "GLOB": glob,
                    "Viva": viva,
                    "Internal Theory": internalTheory,
                    "Total": total
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('Student not found');
        }

        res.status(200).send('Marks updated successfully');
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).send('Internal server error');
    }
});


connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
});




app.get('/enterMarks', (req, res) => {
    if (!req.session.user || req.session.user.type !== 'faculty') {
        return res.redirect('/'); // Redirect to login page if not logged in as student
    }
    res.sendFile(path.join(__dirname, 'public', 'enterMarks.html')); // Serve the viewMarks HTML file
});

app.get('/saveMarks', (req, res) => {
    if (!req.session.user || req.session.user.type !== 'faculty') {
        return res.status(401).send('Unauthorized');
    }
    res.json(req.session.user); // Send the student details
});


