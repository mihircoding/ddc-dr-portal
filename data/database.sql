CREATE DATABASE patientsdb;

--Create the tables
CREATE TABLE patient (
    `patientid` INT NOT NULL,
    `firstName` varchar(45) NOT NULL,
    `lastName` varchar(45) NOT NULL,
    `middleName` varchar(45) NULL,
    `gender` varchar(1) NOT NULL,
    PRIMARY KEY (`patientid`),
    UNIQUE INDEX `patientid_UNIQUE` (`patientid` ASC) VISIBLE);


CREATE TABLE doctor (
    `doctorid` INT NOT NULL,
    `firstname` varchar(45) NOT NULL,
    `lastname` varchar(45) NOT NULL,
    `association` varchar(45) NOT NULL,
    PRIMARY KEY (`doctorid`),
    UNIQUE INDEX `doctorid_UNIQUE` (`doctorid` ASC) VISIBLE);


CREATE TABLE visit (
    `visitid` INT NOT NULL,
    `admittime` DATETIME NOT NULL,
    `dischargetime` DATETIME NOT NULL,
    `inpatient` TINYINT NOT NULL,
    `patientid` INT NULL,
    PRIMARY KEY (`visitid`),
    UNIQUE INDEX `visitid_UNIQUE` (`visitid` ASC) VISIBLE);


CREATE TABLE doctor_activity (
    `doctorid` INT NOT NULL,
    `visitid` INT NOT NULL,
    `activityid` INT NOT NULL,
    `proceduretime` DATETIME NOT NULL,
     --FIX THE PRIMARY KEY FOR THIS TABLE
);


CREATE TABLE activities (
    `activityid` INT NOT NULL,
    `category` varchar(45) NOT NULL,
    `name` varchar(45) NOT NULL,
    `code` INT NOT NULL,
    PRIMARY KEY (`activityid`),
    UNIQUE INDEX `activityid_UNIQUE` (`activityid` ASC) VISIBLE);

