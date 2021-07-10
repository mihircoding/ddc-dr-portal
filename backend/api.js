const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const properties = require('./properties.js');

const app = express();
app.use(cors());

let connection = properties.connectionDb;

//GET Procedures
app.get('/api/procedureDropdowns', (request, response) => {
	
	console.log("request received");
	
	let query = properties.procedureDropdown;


	connection.connect(function (err) {
		if (err) {
			console.log(err.message);
		}

		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.message);
			}
			response.send(result);
		});	
	});
	
});


app.get('/api/activities', (request, response) => {
    let category = request.query.procedureName;
	
	let query = properties.activitiesDropdown(category);
	let jsonAct = {"activities": []};
	connection.query(query, function (err, result) {
		if (err) {
			console.log(err.message);
		}
		if (result.length == 0) {
			response.sendStatus(404);
		}
		else {
			jsonAct.activities = result;
			response.send(jsonAct);
		}
	});
});

app.get('/api/doctorActivities', (request, response) => {
	let visitid = request.query.visitid; //Should be an array
	let activityid = 0;
	//[category, activityname, activitycode]
	let query = `SELECT activityid FROM doctoractivity WHERE visitid=${visitid}`;
	connection.query(query, function(err, result) {
		response.send(result);
	});
});
//response -> [patientid, firstname, lastname, arr(visitid)] <- GET call to patients ? args can be any of the parameters
app.get('/api/patients', (request, response) => {
	//Precedence -> visitid, patientid, name
	let patientid = request.query.patientid;
	response.send(properties.patientIdCount(patientid));
});

//POST Procedures
app.post('/api/patients', (request, response) => {//visit,patient,first, last, gender, middlename
	let patientid = request.query.patientid;
	let firstName = request.query.firstName;
	let lastName = request.query.lastName;
	let middlename = request.query.middleName;
	let gender = request.query.gender;
	let visitid = request.query.visitid;

	//if visit exists but patient does not, error
	//if both exists, do nothing
	//if patient exists but not visit, add visit
	//if both dont exist, add both

	if (properties.visitCount(visitid) != 0) {
		if (properties.patientIdCount(patientid) == 0) {
			response.sendStatus(404);
		}
		else {
			response.send("This patient already exists");
		}
	}
	else if (properties.visitCount(visitid) == 0) {
		if (properties.patientIdCount(patientid) == 0) {
			connection.query(properties.addPatient(), function (err) {
				if (err) {
					console.log(err.message);
				}
			});
			connection.query(properties.addVisit(), function (err) {
				if (err) {
					console.log(err.message);
				}
			});
		}
		else {
			connection.query(properties.addVisit(), function (err) {
				if (err) {
					console.log(err.message);
				}
			});
		}
	}
	
});

app.post('/api/doctorActivities', (request, response) => {
	//activityid or code
	//doctorid or doctorname
	//visitid
	//proceduretime
	//[did*, doctorid, visitid*, activityid, proceduretime*]
	let procedureTime = request.query.procedureTime;
	let visitid = request.query.visitid;
	let activityid = request.query.activityid;
	let doctorid = request.query.doctorid;
	let code = request.query.code;
	
	if (activityid == null) {
		let query = `SELECT activityid FROM activities WHERE code-=${code}`;
		connection.query(query, function(err, result) {
			if (err) {
				console.log(err.message);
			}
			activityid = result; //Not actually the activityid, just an object
		});

		if (doctorid == null) {
			let firstname = request.query.firstname;
			let lastname = request.query.lastname;
			let findID = `SELECT doctorid FROM doctor WHERE firstname='${firstname}' AND lastname='${lastname}'`;
			
			connection.query(findID, function (err, result) {
				if (err) {
					console.log(err.message);
				}
				doctorid = result;
			});
		}

		connection.query(properties.addDoctorActivity(1, doctorid, visitid, activityid, procedureTime), function (err) { //Fix the did parameter
			if (err) {
				console.log(err.message);
			}
		});
	}
});

//App Runner
app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
});



