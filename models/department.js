const orm = require("../config/orm");

const department = {
    create: (name) => {
        return new Promise(async (resolve, reject) => {
            let res = await orm.createRecord("departments", ["name"], [name]);
            resolve(res);
        });
    },

    read: (id) => {
        return new Promise(async (resolve, reject) => {
            let res;
            if (id) res = await orm.readRecord("departments", ["id", id]);
            else res = await orm.readRecord("departments");
            resolve(res);
        });
    },
    updateName: (name, id) => {
        return new Promise(async (resolve, reject) => {
            let res = await orm.updateRecord("departments", ["name"], [`"${name}"`], ["id", id]);
            resolve(res);
        });
    },

    delete: (id) => {
        // return new Promise(async (resolve, reject) => {
        orm.deleteRecord("departments", ["id", id]);
        // });
    }
}

module.exports = department;