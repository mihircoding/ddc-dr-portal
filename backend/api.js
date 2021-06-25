const fs = require('fs');
const express = require('express');
const app = express();

let contents = fs.readFileSync('data/masterdata.json');
const jsonData = JSON.parse(contents); //Contains the accessible json file

//GET Procedures
app.get('/api/procedureDropdowns', (request, response) => {
    let procedureDict = { "procedures": [] };

    jsonData['procedures'].forEach(element => {
        procedureDict.procedures.push({ "procedureName": element.procedureName });
    });
    response.send(procedureDict);
});

app.get('/api/selectDropdown', (request, response) => {
    let activitiesDict = { "activities": [] };
    //console.log(`The request value is ${request.query.procedureName}`);
    jsonData['procedures'].forEach(element => {
        if (element.procedureName === request.query.procedureName) {
            activitiesDict.activities.push(element.activities);
            //console.log(`This is the procedure: ${element.procedureName} and the activities  ${element.activities}`);
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
