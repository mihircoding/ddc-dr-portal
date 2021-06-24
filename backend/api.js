const fs = require('fs');
const express = require('express');
const app = express();

let contents = fs.readFileSync('data/masterdata.json');
const jsonData = JSON.parse(contents); //Contains the accessible json file

//GET Procedures
app.get('/api/procedureDropdowns', (request, response) => {
    let procedureDict = {"procedures": []}; 
    
    jsonData['procedures'].forEach(element => {
        procedureDict.procedures.push({"procedureName": element.procedureName});
    });
    response.send(JSON.stringify(procedureDict));
});

app.get('/api/', (request, response) => {
    let activitiesDict = {"activities": []};

    jsonData.procedures.forEach(element => {
        if (element.procedureName == "") {
            activitiesDict.activities.push(element.activities);
        }
    });
    response.send(JSON.stringify(activitiesDict));
});

//POST Procedures
app.post('/api/Patient', (request, response) => {
    let firstName = request.firstName;
    let lastName = request.lastName;
    let visitId = request.visitId;
});