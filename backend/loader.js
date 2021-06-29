const mysql = require('mysql');
const fs = require('fs');

let connection = mysql.createConnection({
    host: "localhost:3306",
    user: "projectuser",
    pass: "portalservice",
    database: "patientsdb",
});

//Connecting to the database || Create an array that will end up in the table
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection Succeeded!");

    //inserting activities table
    let template = "INSERT INTO activities (activityid, type, category, name, code) VALUES ?";
    let data = activitiesRows();

    connection.query(template, [data], function (err, result) {
        if (err) throw err;
        console.log("Num rows: " + result.affectedRows);
    });

    connection.end();
});


//Array Form - [Activity ID, Type (Procedure or Consult), Category (procuedreName), Name, code]
//Repetitive so change this later
function activitiesRows() {
    let contents = fs.readFileSync('data/masterdata.json');
    const jsonData = JSON.parse(contents);
    let rows = []; //Nested arrays

    //Loop through procedures and then consults
    let temp = [];
    let index = 1;
    jsonData['procedures'].forEach(element => {
        temp.push(index);
        temp.push('Procedure');
        temp.push(element.procedureName);

        element.activities.forEach(activity => {
            temp = temp.slice(0, temp.length - 2);
            temp.push(activity.activityName);
            temp.push(activity.code);
            rows.push(temp);
            index += 1;
        });
    });

    //Consults loop
    temp = [];
    jsonData['consultations'].forEach(element => {
        temp.push(index);
        temp.push('Consultation');
        temp.push(element.consultationsName);

        element.activities.forEach(activity => {
            temp = temp.slice(0, temp.length - 2);
            temp.push(activity.activityName);
            temp.push(activity.code);
            rows.push(temp);
            index += 1;
        });
    });

    return rows; //This is a nested array that will fill an SQL table
}