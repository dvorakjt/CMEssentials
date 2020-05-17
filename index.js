const department = require("./models/department");

(async () => {
    let create = await department.create("Department of Tomfoolery");
    let create2 = await department.create("Department of Crud");
    let update = await department.updateName("Department of CRUD", 2);
    let deletion = await department.delete(1);
    let read = await department.read(11);
    console.log(read);
})();
