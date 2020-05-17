const departments = require("./models/departments");
const employees = require("./models/employees");

(async () => {
    let create = await employees.create("Bob", "Smith", "1", "0");
    console.log(create);
})();
