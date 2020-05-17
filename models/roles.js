const orm = require("../config/orm");

const roles = {
    create: (title, salary, department_id) => {
        return new Promise(async (resolve, reject) => {
            let res = await orm.createRecord("roles", ["title", "salary", "department_id"], [title, salary, department_id]);
            resolve(res);
        });
    },

    read: (condition_var, condition_val) => {
        return new Promise(async (resolve, reject) => {
            let res;
            //if a condition was supplied, select only those records that fulfill the condition. otherwise, get all the records
            if (condition_var && condition_val) res = await orm.readRecord("roles", [condition_var, condition_val]);
            else res = await orm.readRecord("roles");
            resolve(res);
        });
    },

    update: (columns, values, condition_var, condition_val) => {
        return new Promise(async (resolve, reject) => {
            let res = await orm.updateRecord("roles", columns, values, [condition_var, condition_val]);
            resolve(res);
        });
    },

    delete: (id) => {
        return new Promise(async (resolve, reject) => {
            orm.deleteRecord("roles", ["id", id]);
        });
    }
}

module.exports = roles;