const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const properties = require('./properties.js');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

const app = express();
app.use(cors());

let connection = properties.connectionDb;
//Cannot send a number in a response.

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
	let visitid = request.query.visitid;
	//connection.query("SELECT COUNT(*) FROM patient WHERE patientid=5", function (err, result) {
	//	if (err) {
	//		console.log(err.message);
	//	}
	//	let thing = result[0];
	//	response.send(String(thing["COUNT(*)"])); //Cannot access the value inside the json
	//});
	connection.query(properties.visitCount(visitid), function (err, result) {
		if (err) {
			console.log(err.message);
		}
		//let num = Object.values(result[0]);
		response.send(result[0]);

	})
});

//POST Procedures
app.post('/api/patients', (request, response) => {
	let patientid = request.Body.patientid;
	let firstName = request.Body.firstName;
	let lastName = request.Body.lastName;
	let middleName = request.Body.middleName;
	let gender = request.Body.gender;
	let visitid = request.Body.visitid;
	let admittime = request.Body.admittime;
	let dischargetime = request.Body.dischargetime;
	let inpatient = request.Body.inpatient;
	let numPatient = null;
	let numVisit = null;


	connection.query(properties.visitCount(visitid), function (err, result) {
		if (err) {
			console.log(err.message);
		}
		numVisit = result[0]["COUNT(*)"]; 
		console.log(`Num visit is ${numVisit}`);
	});

	connection.query(properties.patientIdCount(patientid), function (err, result) {
		if (err) {
			console.log(err.message);
		}
		numPatient = result[0]["COUNT(*)"];
		console.log(`Num patient is ${numPatient}`)
	});
	async function init() {
		await sleep(1000);
		if (numVisit != 0) {
			if (numPatient != 0) {
				response.send("The patient and visit already exist");
			}
			else {
				response.status(404).send("this is an error");
			}
		}
		else if (numVisit === 0) {
			if (numPatient === 0) {
				connection.query(properties.addPatient(patientid, firstName, lastName, gender, middleName) , function (err) {
					if (err) {
						console.log(err.message);
					}
					connection.query(properties.addVisit(visitid, admittime, dischargetime, patientid, inpatient), function (err) {
						if (err) {
							console.log(err.message);
						}
					});
				});
				response.send("Patient and visit created.");
			}
			else {
				connection.query(properties.addVisit(visitid, admittime, dischargetime, patientid, inpatient), function (err) {
					if (err) {
						console.log(err.message);
					}
				});
				response.send("Visit created.");
			}
		}
	  
	  function sleep(ms) {
		return new Promise((resolve) => {
		  setTimeout(resolve, ms);
		});
		}
	}
	init()

	//const wait = new Promise((resolve, reject) =>{
	//	if (numPatient != null & numVisit != null) {
	//		resolve(inserts(patientid, firstName, lastName, gender, middleName, visitid, admittime, dischargetime, patientid, inpatient, numVisit, numPatient));
	//	}
	//	else {
	//		reject("")
	//	}
	//});

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

function inserts(patientid, firstName, lastName, gender, middleName, visitid, admittime, dischargetime, inpatient, numVisit, numPatient, response) {
	if (numVisit != 0) {
		if (numPatient != 0) {
			response.send("The patient and visit already exist");
		}
		else {
			response.status(404).send("this is an error");
		}
	}
	else if (numVisit === 0) {
		if (numPatient === 0) {
			connection.query(properties.addPatient(patientid, firstName, lastName, gender, middleName) , function (err) {
				if (err) {
					console.log(err.message);
				}
				connection.query(properties.addVisit(visitid, admittime, dischargetime, patientid, inpatient), function (err) {
					if (err) {
						console.log(err.message);
					}
				});
			});
			response.send("Patient and visit created.");
		}
		else {
			connection.query(properties.addVisit(visitid, admittime, dischargetime, patientid, inpatient), function (err) {
				if (err) {
					console.log(err.message);
				}
			});
			response.send("Visit created.");
		}
	}
}




//App Runner
app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`);
});



