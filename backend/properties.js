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

let connectionDb = mysql.createConnection({
    host: "localhost",
	port: 3306,
    user: "projectuser",
    password: "portalservice",
	database: "patientdb"
});

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
queryList.push(createActivities);

let createPatient = `CREATE TABLE IF NOT EXISTS patient(
		patientid INT PRIMARY KEY NOT NULL,
		firstname VARCHAR(45) NOT NULL,
		lastname VARCHAR(45) NOT NULL,
		middlename VARCHAR(45) DEFAULT "" NOT NULL,
		gender VARCHAR(1) NOT NULL
    )`;
queryList.push(createPatient);

let createDoctor = `CREATE TABLE IF NOT EXISTS doctor(
		doctorid INT PRIMARY KEY NOT NULL,
		firstname VARCHAR(45) NOT NULL,
		lastname VARCHAR(45) NOT NULL,
		association VARCHAR(255) NOT NULL
	)`;
queryList.push(createDoctor);

let createVisit = `CREATE TABLE IF NOT EXISTS visit(
		visitid INT PRIMARY KEY NOT NULL,
		admittime DATETIME NOT NULL,
		dischargetime DATETIME NOT NULL,
		inpatient BOOLEAN NOT NULL,
		patientid INT NOT NULL,
		FOREIGN KEY (patientid) REFERENCES patient(patientid)
	)`;
queryList.push(createVisit);

let createDoctorVisit = `CREATE TABLE IF NOT EXISTS doctoractivity(
			did INT PRIMARY KEY NOT NULL,
			doctorid INT NOT NULL,
			visitid INT NOT NULL,
			activityid INT NOT NULL,
			proceduretime DATETIME NOT NULL,
			FOREIGN KEY (doctorid) REFERENCES doctor(doctorid),
			FOREIGN KEY (visitid) REFERENCES visit(visitid),
			FOREIGN KEY (activityid) REFERENCES activities(activityid)
	)`;
queryList.push(createDoctorVisit);

//INSERT AND DELELE
let activitiesTemplate = "INSERT IGNORE INTO activities (activityid, type, category, name, code) VALUES ?";

let patientTemplate = "INSERT INTO patient (patientid, firstname, lastname, middlename, gender) VALUES ?";

let addPatient = (patientid, firstname, lastname, middlename = null, gender) => {
	if (middlename == null) {
		return `INSERT INTO patient (patientid, firstname, lastname, gender) VALUES (${patientid}, ${firstname}, ${lastname}, ${gender})`;
	}
	else {
		return `INSERT INTO patient (patientid, firstname, lastname, middlename, gender) VALUES (${patientid}, ${firstname}, ${lastname}, ${middlename}, ${gender})`;
	}
}

let addDoctorActivity = (did, doctorid, visitid, activityid, proceduretime) => {
	return `INSERT INTO doctoractivity (did, doctorid, visitid, activityid, proceduretime) VALUES (${did}, ${doctorid}, ${visitid}, ${activityid}, ${proceduretime})`;
}

//Dropdowns
let procedureDropdown = "SELECT DISTINCT category FROM activities WHERE type='Procedure'";

let activitiesDropdown = (categoryName) => {
	return `SELECT name, code FROM activities WHERE category='${categoryName}'`;
};

//Count Rows
let patientCount = (firstName, lastName) => {
	return `SELECT COUNT(*) FROM activities WHERE firstname='${firstName}' AND lastname='${lastName}'`;
}

//Other

//Utilizes all the above queries to create database
function createDatabase() {
	connection.connect(function (err) {
		if (err) throw err;
	});

	for (let query of queryList) {
		createQuery(query);	
	}

}

let createQuery = (string) => {
	connection.query(string, function (err) {
		if (err) {
			return console.log(err.message);
		}
	});
}

module.exports = {
	
	createDatabase: createDatabase(),

	createQuery: createQuery,

	connection: connection,

	connectionDb: connectionDb,

	connectDb: connectDb,

	activitiesTemplate: activitiesTemplate,

	procedureDropdown: procedureDropdown,

	activitiesDropdown: activitiesDropdown,

	addPatient: addPatient,
	
	addDoctorActivity: addDoctorActivity
};
