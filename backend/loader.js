/*
Create Database
Create Tables
Populate Tables
*/

const mysql = require('mysql');
const fs = require('fs');
const properties = require('./properties.js');

properties.createDatabase;
let connection = properties.connectionDb;

//Connecting to the database || Create an array that will end up in the table
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection Succeeded!");

	let createActivities = properties.createActivities;
	
	connection.query(createActivities, function (err, result) {
		if (err) {
			console.log(err.message);
		}
	});


    //inserting activities table
    let template = properties.activitiesTemplate; 
    let data = activitiesRows();
	//console.log(data);
    connection.query(template, [data], function (err, result) {
       if (err) throw err;
    });


	connection.query("SELECT * FROM activities", function (err, rows, fields) {
		if (err) throw err;
	
		for (let i = 0; i < rows.length; i++) {
			console.log(rows[i].name);
		}
	});
	
    connection.end();
});


//Array Form - [Activity ID, Type (Procedure or Consult), Category (procedureName), Name, code]
//Repetitive so change this later
function activitiesRows() {
    let contents = fs.readFileSync('../data/masterdata.json');
    const jsonData = JSON.parse(contents);
    let rows = []; //Nested arrays

    //Loop through procedures and then consults
    let temp = [];
	let index = 1;
    jsonData['procedures'].forEach(element => {
        temp.push('Procedure');
        temp.push(element.procedureName);

        element.activities.forEach(activity => {
			temp.unshift(index);
            temp.push(activity.activityName);
            temp.push(activity.code);
            rows.push(temp);
			temp = temp.slice(1, temp.length - 2);
			index += 1;
        });
		temp = [];
    });

    //Consults loop
    temp = [];
    jsonData['consultations'].forEach(element => {
        temp.push('Consultation');
        temp.push(element.consultationsName);

        element.activities.forEach(activity => {
			temp.unshift(index);
            temp.push(activity.activityName);
            temp.push(activity.code);
            rows.push(temp);
			temp = temp.slice(1, temp.length - 2);
			index += 1;
        });
		temp = [];
    });
    return rows; //This is a nested array that will fill an SQL table
}
