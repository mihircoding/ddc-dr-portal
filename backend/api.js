const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const app = express();

let contents = fs.readFileSync('../data/masterdata.json');
const jsonData = JSON.parse(contents); //Contains the accessible json file
let connection = mysql.createConnection({
    host: "localhost",
    user: "projectuser",
    pass: "portalservice",
    database: "patientdb"
});


//GET Procedures
app.get('/api/procedureDropdowns', (request, response) => {
    let procedureDict = { "procedures": [] };

    jsonData['procedures'].forEach(element => {
        procedureDict.procedures.push({ "procedureName": element.procedureName });
    });
    response.send(procedureDict);
});

app.get('/api/activities', (request, response) => {
    let activitiesDict = { "activities": [] };
    //console.log(`The request value is ${request.query.procedureName}`);
    jsonData['procedures'].forEach(element => {
        if (element.procedureName === request.query.procedureName) {
            element.activities.forEach(activity => {
                activitiesDict.activities.push(activity)
            })
        }
    });
    response.send(activitiesDict);
});

//POST Procedures
app.post('/api/Patient', (request, response) => {
    let firstName = request.firstName;
    let lastName = request.lastName;
    let visitId = request.visitId;
});

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})
