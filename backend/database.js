const mysql = require('mysql');

let connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
    user: "projectuser",
    password: "portalservice",
});

//CREATE DATABASE IN CASE IT HAS NOT ALREADY BEEN CREATED
connection.connect(function (err) {
	if (err) throw err;
	
	connection.query("CREATE DATABASE IF NOT EXISTS patientdb", function (err, result) {
		console.log("Database initialized");		
	});
	//ADD ALL OF THE OTHER TABLES BELOW THIS (SEPERATE FILE FOR THE ACTIVITIES)
});
