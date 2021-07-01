//CREATE A FUNCTION THAT INITALIZES THE ENTIRE DATABASE
const mysql = require('mysql');
const fs = require('fs');
let queryList = [];


let connection = mysql.createConnection({
    host: "localhost",
	port: 3306,
    user: "projectuser",
    password: "portalservice",
});
queryList.push(connection);

let createDb = "CREATE DATABASE IF NOT EXISTS patientdb";
queryList.push(createDb);

let connectDb = "use patientdb";
queryList.push(connectDb);

//Create Tables
let createActivities = `CREATE TABLE IF NOT EXISTS activities(
		activityid INT PRIMARY KEY NOT NULL,
		type VARCHAR(45) NOT NULL,
		category VARCHAR(45) NOT NULL,
		name VARCHAR(45) NOT NULL,
		code INT NOT NULL
	)`;
query.push(createActivities);

let createPatient = `CREATE TABLE IF NOT EXISTS patient(
		patientid INT PRIMARY KEY NOT NULL,
		firstname VARCHAR(45) NOT NULL,
		lastname VARCHAR(45) NOT NULL,
		middlename VARCHAR(45) NOT NULL,
		gender VARCHAR(1) NOT NULL
    )`;
query.push(createPatient);

let createDoctor = `CREATE TABLE IF NOT EXISTS doctor(
		doctorid INT PRIMARY KEY NOT NULL,
		firstname VARCHAR(45) NOT NULL,
		lastname VARCHAR(45) NOT NULL,
		association VARCHAR(255) NOT NULL
	)`;
query.push(createDoctor);

let createVisit = `CREATE TABLE IF NOT EXISTS visit(
		visitid INT PRIMARY KEY NOT NULL,
		admittime DATETIME NOT NULL,
		dischargetime DATETIME NOT NULL,
		inpatient BOOLEAN NOT NULL,
		patientid INT NOT NULL,
		FOREIGN KEY (patientid) REFERENCES patient(patientid)
	)`;
query.push(createVisit);

let createDoctorVisit = `CREATE TABLE IS NOT EXITS doctoractivity(
			did INT PRIMARY KEY NOT NULL,
			doctorid INT NOT NULL,
			visitid INT NOT NULL,
			activityid INT NOT NULL,
			proceduretime DATETIME NOT NULL,
			FOREIGN KEY (doctorid) REFERENCES doctor(doctorid),
			FOREIGN KEY (visitid) REFERENCES visit(visitid),
			FOREIGN KEY (activityid) REFERENCES activity(activityid)
	)`;
query.push(createDoctorVisit);

//INSERTING AND DELETING
let activitiesTemplate = "INSERT IGNORE INTO activities (activityid, type, category, name, code) VALUES ?";


//Dropdowns
let procedureDropdown = "SELECT JSON_ARRAYAGG(JSON_OBJECT('procedureName', category)) FROM activities WHERE 'Procedure' in (activityid, type, category, name, code)";

let activitiesDropdown = "SELECT JSON_ARRAYAGG(JSON_OBJECT('procedureName', category, 'activityName', name, 'code', code)) FROM activities";


//Utilizes all the above queries to create database
function createDatabase() {
	connection.connect(function (err) {
		if (err) throw err;
	});

	for (let query of queryList) {
		console.log(query);
		createQuery(query);	
	}

	connection.end();
}

function createQuery(string) {
	connection.query(string, function (err) {
		if (err) {
			return console.log(err.message);
		}
	});
}

export.methods = {
	createDatabase: createDatabase(),

	createQuery: createQuery(),

	connection: connection,

	activitiesTemplate: activitiesTemplate,

	procedureDropdown: procedureDropdown,

	activitiesDropdown: activitiesDropdown
};
