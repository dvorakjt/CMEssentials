// const mysql = require("mysql");
const connection = require("./connection");

const orm = {
    createRecord: (table, columns, values) => {
        /*createRecord takes 3 parameters. the first is a string containing the name of the table you wish to update. 
        the next 2 parameters are arrays containing the columns and values you wish to pass into the record*/
        return new Promise((resolve, reject) => {
            const colStr = columns.join(", ");
            const valStr = values.map(value => value = "?").join(", ");
            const queryStr = `INSERT INTO ${table} (${colStr}) VALUES (${valStr});`;
            console.log(queryStr);
            console.log(values);
            connection.query(queryStr, values, (err, res) => {
                if (err) {
                    console.log(err);
                    reject();
                }
                resolve(res);
            });
        });
    },

    readRecord: (table, condition) => {
        /*this function takes two parameters. The first is a string containing the name of the table. the second is 
        an array containing the two halves of the conditional statement. the condition is optional, and if omitted, the
        function will return all elements of the table*/
        return new Promise((resolve, reject) => {
            let queryStr = `SELECT * FROM ?? ${condition ? "WHERE ?? = ?" : ""}`
            let queryParams = [table];
            if (condition) queryParams = queryParams.concat(condition);
            connection.query(queryStr, queryParams, (err, res) => {
                if (err) reject();
                resolve(res);
            });
        });
    },

    updateRecord: (table, columns, values, condition) => {
        /* updateRecord takes 4 parameters. 1. the table to update 2. an array of columns to update 3. an array of
        values to use to update those columns, 4. condition is an array containing two elements. the first is the name of the 
        column to check and the second is the value to check for*/
        return new Promise((resolve, reject) => {
            const updateStr = columns.map((element, i) => element = `${element} = ${values[i]}`).join(", ");
            const queryStr = `UPDATE ${table} SET ${updateStr} WHERE ?? = ?`;
            connection.query(queryStr, condition, (err, res) => {
                if (err) reject();
                resolve(res);
            });
        });
    },

    deleteRecord: (table, condition) => {
        //delete record takes two parameters: the table to delete from and an array that contains the condition to be satisfied
        return new Promise((resolve, reject) => {
            const queryStr = "DELETE FROM ?? WHERE ?? = ?";
            condition.unshift(table);
            const queryParams = condition;
            connection.query(queryStr, queryParams, (err, res) => {
                if (err) reject();
                resolve(res);
            });
        });
    }
}

module.exports = orm;