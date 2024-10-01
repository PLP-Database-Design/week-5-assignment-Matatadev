 const express = require("express");
 const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv')


dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    // connection is not successful
    if(err) {
        return console.log("Error connecting to the database: ", err)
    }
    // connection is successful
    console.log("Successfully connected to MySQL: ", db.threadId)
})


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


//question 1
app.get('/patients', (req, res) => {
    const getPatients = "SELECT first_name, last_name, patient_id, date_of_birth FROM patients";
    db.query(getPatients, (err, data) => {
        if (err) {
            return res.status(400).send("Failed to get patients: " + err);
        }
        res.status(200).send(data); // Sends the retrieved patient data as JSON
    });
});

// Question 2: GET endpoint to retrieve all providers
app.get('/providers', (req, res) => {
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers";
    db.query(getProviders, (err, data) => {
        if (err) {
            return res.status(400).send("Error fetching providers: " + err);
        }
        res.status(200).send(data); // Sends the retrieved provider data as JSON
    });
});

//question 3
app.get('/patients/filter', (req, res) => {
     const { first_name } = req.query;
     if (!first_name) {
        return res.status(400).send("First name is required");
    }
    
    const getFirstName = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";
    db.query(getFirstName, [first_name], (err, data) => {
        if (err) {
            return res.status(400).send("Error fetching patients by first name: " + err);
        }
        if (data.length === 0) {
            return res.status(404).send("No patients found with the first name: " + first_name);
        }

        res.status(200).send(data);
    });
});

// question 4
app.get('/providers/filter', (req, res) => {
    const { specialty } = req.query;
    if (!specialty) {
        return res.status(400).send("Specialty is required");
    }
    const getProvidersBySpecialty = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";
    db.query(getProvidersBySpecialty, [specialty], (err, data) => {
        if (err) {
            return res.status(400).send("Error fetching providers by specialty: " + err);
        }
        if (data.length === 0) {
            return res.status(404).send("No providers found with the specialty: " + specialty);
        }

        res.status(200).send(data);
    });
});

// Start the server
app.listen(3300, () => {
    console.log(`Server is running on port 3300...`);
});