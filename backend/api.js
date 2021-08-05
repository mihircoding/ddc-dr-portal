const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const properties = require('./properties.js');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

const { NEWDATE } = require('mysql/lib/protocol/constants/types');
const { json } = require('express');


const app = express();
app.use(cors());

app.use(express.json());
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
	//[category, activityname, activitycode]
	let visitid = null;
	let patientid = null;
	let firstname = null;
	let lastname = null;

	if (request.body.visitid) {
		visitid = parseInt(request.body.visitid);
	}
	if (request.body.patientid) {
		patientid = parseInt(request.body.patientid);
	}
	if (request.body.firstname) {
		firstname = parseInt(request.body.firstname);
	}
	if (request.body.lastname) {
		lastname = parseInt(request.body.lastname);
	}

	async function init() {
		await sleep(1000);
		
		if (visitid != null) {
			let query = `SELECT * FROM doctoractivity WHERE visitid=${visitid}`;
			connection.query(query, function(err, result) {
				if (err) {
					console.log(err.message);
				}
				response.send(result);
			});
		}
		if (patientid != null) {
			let visits = [];
			connection.query(properties.getVisits(patientid), function (err, result) {
				if (err) {
					console.log(err.message);
				}
				result.forEach(element => {
					visits.push(element['visitid']);
				})

				visits.forEach(element => {
					let query = `SELECT * FROM doctoractivity WHERE visitid=${element}`;
					connection.query(query, function(err, result) {
						if (err) {
							console.log(err.message);
						}
						response.send(result);
					});
				})
			});
		}

		let patients = [];
		let visits = [];

		connection.query(properties.getPatientID(firstname, lastname), function(err, result) {
			if (err) {
				console.log(err.message);
			}
			result.forEach(element => {
				patients.push(element['patientid']);
			})

			patients.forEach(element => {
				connection.query(properties.getVisits(element), function(err,result) {
					if (err) {
						console.log(err.message);
					}

					result.forEach(item => {
						visits.push(item['visitid']);
					})

					visits.forEach(item => {
						let query = `SELECT * FROM doctoractivity WHERE visitid=${item}`;
						connection.query(query, function (err, result) {
							if (err) {
								console.log(err.message);
							}
							response.send(result);
						});
					});
				});
			});
		});
	  
	  	function sleep(ms) {
			return new Promise((resolve) => {
		  	setTimeout(resolve, ms);
		});
		}
	}
	init();
});



app.get('/api/patients', (request, response) => {
	//Precedence -> visitid, patientid, name
	let visitid = 0;
	let patientid = 0;
	let lastname = null;
	let firstname = null;

	if( request.query.patientid) {
		patientid=parseInt(request.query.patientid);
	}
	if( request.query.visitid) {
		visitid=parseInt(request.query.visitid);
	}
	if( request.query.firstname) {
		firstname=request.query.firstname;
	}
	if( request.query.lastname) {
		lastname=request.query.lastname;
	}
    
	async function init() {
		await sleep(1000);
		if (visitid != 0 ) {
			let query = properties.findVisitsWithVisitId(visitid);
			console.log("the visit query is "+ query);
			connection.query(query, function (err, result) {
				if (err) {
					console.log("error in visit id "+err.message);
					response.status(404).send(err);
				}
				response.send(result);		
			});	
		}
		
		else if (patientid != 0) {
			let getVisits = properties.findVisitsWithPatientId(patientid);
			console.log("patient id query is"+ getVisits);
			visits = []; 
	
			connection.query(getVisits, function (err, result) {
				if (err) {
					console.log(err.message);
					response.status(404).send(err);
				}
				else{
					console.log ("the result");
					response.send(result);
					
				}
			});
		}
		else {
		//What happens if there are more than one patientid
		let query="";
		if(firstname && lastname) {
			query= properties.findVisitsWithName(firstname, lastname);
		}
		else if (firstname) {
			query= properties.findVisitsWithFirstname(firstname);
		}
		else if (lastname) {
			query= properties.findVisitsWithLastname(lastname);
		}
		
		console.log ("thew query is " + query);

		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.message);
				response.status(404).send(err);
			}
			else {
			
			response.send(result);
			}
	
		});
	
	}
	  
	  function sleep(ms) {
		return new Promise((resolve) => {
		  setTimeout(resolve, ms);
		});
		}
	}
	init();
});



//POST Procedures
app.post('/api/patients', (request, response) => {
	console.log('the body is'+request.body
	
	);
	let patientid = 0;
	let firstName = null;
	let lastName = null;
	let middleName = null;
	let gender = "M";
	let visitid = 0;
	let admittime = new Date();
	let dischargetime = null;
	let inpatient = true;
	let numPatient = null;
	let numVisit = null;
	
	if( request.body.patientid) {
		patientid=parseInt(request.body.patientid);
	}
	if( request.body.firstName) {
		firstName=request.body.firstName;
	}
	if( request.body.lastName) {
		lastName=request.body.lastName;
	}
	if( request.body.middleName) {
		middleName=request.body.middleName;
	}
	console.log(request.body.gender+"the request gender");
	if( request.body.gender) {
		gender=request.body.gender;
	}
	if( request.body.visitid) {
		visitid=parseInt(request.body.visitid);
	}
	if( request.body.admittime) {
		admittime=request.body.admittime;
	}
	if( request.body.dischargetime) {
		dischargetime=request.body.dischargetime;
	}
	if( request.body.inpatient) {
		inpatient=request.body.inpatient;
	}
	if( request.body.numPatient) {
		numPatient=request.body.numPatient;
	}
	if( request.body.numVisit) {
		numVisit=request.body.numVisit;
	}
	/*
	let firstName = request.body.firstName;
	let lastName = request.body.lastName;
	let middleName = request.body.middleName;
	let gender = request.body.gender;
	let visitid = request.body.visitid;
	let admittime = request.body.admittime;
	let dischargetime = request.body.dischargetime;
	let inpatient = request.body.inpatient;
	let numPatient = null;
	let numVisit = null;
	*/
	console.log(patientid+"patientid");
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
		console.log(`Num patient is ${numPatient}`);
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
					
					let rows=[
						[visitid, admittime, dischargetime, patientid, inpatient]
					];
					connection.query(properties.addVisit(),[rows], function (err) {
						if (err) {
							console.log(err.message);
						}
					});
				});
				response.send("Patient and visit created.");
			}
			else {
				let rows=[
					[visitid, admittime, dischargetime, patientid, inpatient]
				];
				connection.query(properties.addVisit(),[rows], function (err) {
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

});

app.post('/api/procedures', (request, response) => {
	// [did, doctorid, visitid, activityid, procedureTime]
	let did = "";
	let doctorid = 0;
	let visitid = 0;
	let activityid = 0;
	let code = 0;
	let procedureTime = new Date();

	if (request.body.doctorid) {
		doctorid = parseInt(request.body.doctorid);
	}
	
	if (request.body.visitid) {
		visitid = parseInt(request.body.visitid);
	}

	if (request.body.code) {
		code = parseInt(request.body.code);
	}

	if (request.body.procedureTime) {
		procedureTime = request.body.procedureTime;
	}

	if (request.body.did) {
		did = request.body.did;
		console.log("this is the did" + did);
	}
	let query = properties.findActivityID(code);
		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.message);
			}
			activityid = result[0]["activityid"]; 

			connection.query(properties.addDoctorActivity(did, doctorid, visitid, activityid, procedureTime), function (err) {
				if (err) {
					console.log("doctor activity failed");
					console.log(err.message);
				}
				response.send("created");
				
			});
		});
});

app.delete('/api/procedures/:id', (request, response) => {
	const did = request.params.id;
	let deldid = `DELETE FROM doctoractivity WHERE did = '${did}'`;
	
	connection.query(deldid,function(err,result) {
		if (err) {
			console.log(err.message);
		}
		else {
			console.log("the delete was successful");
		}
	});
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
		let query = `SELECT activityid FROM activities WHERE code=${code}`;
		connection.query(query, function(err, result) {
			if (err) {
				console.log(err.message);
			}
			activityid = result; 
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
    console.log(`Example app listening at http://localhost:${3000}`);
});



