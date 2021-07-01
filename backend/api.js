const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let contents = fs.readFileSync('../data/masterdata.json');
const jsonData = JSON.parse(contents); //Contains the accessible json file
let connection = mysql.createConnection({
    host: "localhost",
	port: 3306,
    user: "projectuser",
    password: "portalservice",
    database: "patientdb"
});


//GET Procedures
app.get('/api/procedureDropdowns', (request, response) => {
    let procedureDict = { "procedures": [] };
	let contents = [];
	let strippedContents = [];

	connection.connect(function (err) {
		if (err) throw err;
		
		//Write the function in here (SELECT type, category) {procedureName : ""} 
		//There are duplicate procedureNames

		let query = "SELECT JSON_ARRAYAGG(JSON_OBJECT('procedureName', category)) FROM activities WHERE type='Procedure'";
		connection.query(query, function(err, result) {
			if (err) throw err;

			contents = result;
			console.log(contents);
			strippedContents = JSON.parse(JSON.stringify(contents))[0];
			strippedContents = JSON.parse(Object.values(strippedContents)[0]);
			//console.log(strippedContents);
			procedureDict.procedures = removeDuplicates(strippedContents);
			response.send(procedureDict);
		});
	});
	
});


app.get('/api/activities', (request, response) => {
    let activitiesDict = { "activities": [] };
	let contents = [];
	let strippedContents = [];
    let category = request.query.procedureName;

	let query = "SELECT JSON_ARRAYAGG(JSON_OBJECT('procedureName', category, 'activityName', name, 'code', code)) FROM activities";
	
	connection.query(query, function (err, result) {
		if (err) throw err;

		contents = result;
		strippedContents = JSON.parse(JSON.stringify(contents))[0];
		strippedContents = JSON.parse(Object.values(strippedContents)[0]);

		let filtered = filter(strippedContents, category);
		activitiesDict.activities = filtered;
		response.send(activitiesDict);
		

		connection.end();
		
	});
	

    //response.send(activitiesDict);
});


//POST Procedures
app.post('/api/Patient', (request, response) => {
    let firstName = request.query.firstName;
    let lastName = request.query.lastName;
    let visitId = request.query.visitId;
});

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
});

//Helper Function
function removeDuplicates(arr) {
	let shortened = [];

	arr.forEach(function (element) {
		let unique = true;

		shortened.forEach(function (element2) {
			if (element2.procedureName == element.procedureName) unique = false;
		});
		if (unique) shortened.push(element);
	});

	return shortened;
}

function filter(arr, name) {
	let stripped = [];

	arr.forEach(function (element) {
		if (element.procedureName === name) {
			stripped.push({"activityName": element.activityName, "code": element.code});
		}
	});

	return stripped;
}

