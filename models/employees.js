const orm = require("../config/orm");

const employees = {
    create: (first_name, last_name, role_id, manager_id) => {
        return new Promise(async (resolve, reject) => {
            let res = await orm.createRecord("employees", ["first_name", "last_name", "role_id", "manager_id"], [first_name, last_name, role_id, manager_id]);
            resolve(res);
        });
    },

    read: (condition_var, condition_val) => {
        return new Promise(async (resolve, reject) => {
            let res;
            //if a condition was supplied, select only those records that fulfill the condition. otherwise, get all the records
            if (condition_var && condition_val) res = await orm.readRecord("employees", [condition_var, condition_val]);
            else res = await orm.readRecord("employees");
            resolve(res);
        });
    },

    update: (columns, values, condition_var, condition_val) => {
        return new Promise(async (resolve, reject) => {
            let res = await orm.updateRecord("employees", columns, values, [condition_var, condition_val]);
            resolve(res);
        });
    },

    delete: (id) => {
        return new Promise(async (resolve, reject) => {
            orm.deleteRecord("employees", ["id", id]);
        });
    }
}

module.exports = employees;