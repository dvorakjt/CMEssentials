CREATE DATABASE company_db;
USE company_db;

CREATE TABLE departments (
id INT auto_increment NOT NULL,
name VARCHAR(30) NOT NULL,
primary key(id)
);

CREATE TABLE roles (
id INT auto_increment NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL,
department_id INT NOT NULL,
primary key(id)
);

CREATE TABLE employees (
id INT auto_increment NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT NOT NULL,
manager_id INT NOT NULL,
primary key(id)
);