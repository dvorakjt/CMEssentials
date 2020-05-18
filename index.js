const departments = require("./models/departments");
const employees = require("./models/employees");
const roles = require("./models/roles");
const inq = require("inquirer");

////////////////////////////////////////////////////////////////Main Menu///////////////////////////////////////////////////////////////////////
const mainMenu = async () => {
    //read the departments, roles and employees tables
    let alldepts = await departments.read();
    let allroles = await roles.read();
    let allemps = await employees.read();

    //main menu options depend on the creation of departments. 
    let menuOptions = ["Departments"];
    //if there is at least 1 department, add the option to view/edit roles and employees
    if (alldepts.length > 0) menuOptions.push("Roles", "Employees");
    menuOptions.push("Exit");
    //now use inquirer to offer the user some options...
    inq.prompt({
        type: "list",
        message: "\nWhat list would you like to modify? **Please note that if you do not have any departments, you will not be able to add employees or roles.**",
        choices: menuOptions,
        name: "mainMenu"
    }).then(answers => { //will need to adjust this to account for the possibility of help menu and exit option
        const reply = answers.mainMenu;
        if (reply === menuOptions[0]) deptMenu();
        else if (reply === menuOptions[1]) {
            if (menuOptions.length === 2) process.exit();
            else roleMenu();
        }
        else if (reply === menuOptions[2]) empMenu();
        else if (reply === menuOptions[3]) process.exit();
        else mainMenu();
    });
}
///////////////////////////////////////////////////////////////////Department Menus/////////////////////////////////////////////////////////////////
const deptMenu = async () => {
    let alldepts = await departments.read();
    let menuOptions = ["Add a department"];
    //if there is at least one department, you can view it, or update it!
    if (alldepts.length > 0) menuOptions.push("View Department", "Update Department Name");
    //if there are at least two departments, you can view all departments and delete a department
    if (alldepts.length > 1) menuOptions.push("View All Departments", "Delete a Department");
    menuOptions.push("Back to Main Menu");
    inq.prompt({
        type: "list",
        message: "\nPlease select an action. You must have at least one department at all times.\nIf you do not have at least one department, please add one.",
        choices: menuOptions,
        name: "deptMenu"
    }).then(answers => {
        const reply = answers.deptMenu;
        if (reply === menuOptions[0]) addDept();
        else if (reply === menuOptions[1]) {
            //if there are only two options, the second option will be to go back, otherwise, the option will be to view a department.
            if (menuOptions.length === 2) mainMenu();
            else viewDept();
        }
        else if (reply === menuOptions[2]) updateDept();
        else if (reply === menuOptions[3]) {
            //If there are only 4 menu options, the 4th will be to go back.
            if (menuOptions.length === 4) mainMenu();
            else viewAllDepts();
        }
        else if (reply === menuOptions[4]) deleteDept();
        else mainMenu();
    });
}
/////////////////////////////////////////////////////////////////Department Functions/////////////////////////////////////////////////////////
const addDept = () => {
    inq.prompt({
        type: "input",
        message: "Please enter the department name: ",
        name: "newDeptName"
    }).then(async (answers) => {
        const name = answers.newDeptName;
        const newdept = await departments.create(name);
        const deptID = newdept.insertId;
        addManagerRole(deptID, name);
    });
};

const viewDept = async () => {
    const alldepts = await departments.read();
    console.log(alldepts);
    mainMenu();
};
const viewAllDepts = async () => {
    const alldepts = await departments.read();
    console.log(alldepts);
    mainMenu();
};
const updateDept = () => { };
const deleteDept = () => { };

/////////////////////////////////////////////////////////////////Role Menus///////////////////////////////////////////////////////////////////
const roleMenu = async () => {
    let allroles = await roles.read();
    let menuOptions = ["Add a role."];
    //if there is at least one role, you can view it, update it or delete it!
    if (allroles.length > 0) menuOptions.push("View Role", "Update Role", "Delete a Role");
    // if there are at least 2 roles, you can view all of them.
    if (allroles.length > 1) menuOptions.push("View All Roles");
    menuOptions.push("Back to Main Menu");
    inq.prompt({
        type: "list",
        message: "Please select an action.",
        choices: menuOptions,
        name: "roleMenu"
    }).then(answers => {
        const reply = answers.roleMenu;
        if (reply === menuOptions[0]) addRole();
        else if (reply === menuOptions[1]) {
            //if there are only two options, the second option will be to go back, otherwise, the option will be to view a department.
            if (menuOptions.length === 2) mainMenu();
            else viewRole();
        }
        else if (reply === menuOptions[2]) updateRole();
        else if (reply === menuOptions[3]) {
            //If there are only 4 menu options, the 4th will be to go back.
            if (menuOptions.length === 4) mainMenu();
            else viewAllRoles();
        }
        else if (reply === menuOptions[4]) deleteRole();
        else mainMenu();
    });
}

const addRole = async () => {
    const alldepts = await departments.read();
    deptChoices = alldepts.map(department => department = department.name + " (id: " + department.id + ")");
    inq.prompt([
        {
            type: "list",
            message: "Please select the department you would like the role to belong to.",
            choices: deptChoices,
            name: "deptmt"
        },
        {
            type: "input",
            message: "Please enter the role's title",
            name: "title"
        },
        {
            type: "input",
            message: "Please enter the role's salary. If a number is not entered, it will default to 1.",
            name: "salary"
        }
    ]).then(async (answers) => {
        const deptID = alldepts[deptChoices.indexOf(answers.deptmt)].id;
        const title = answers.title;
        let salary = Number(answers.salary);
        if (salary !== salary) salary = 1;
        const newRole = await roles.create(title, salary, deptID);
        mainMenu();
    });
}

const addManagerRole = (deptID, deptName) => {
    inq.prompt({
        type: "input",
        message: `Please enter the salary for the manager of ${deptName}. You must enter a number.`,
        name: "salary"
    }).then(async (answers) => {
        let salary = Number(answers.salary);
        //check if the salary entered is a number. if it is not, add a placeholder of 1. this can be updated later.
        if (salary !== salary) {
            salary = 1;
            console.log("You entered an invalid response (salary must be a number). Placeholder of 1 entered. Update the role to adjust this.");
        }
        const newManagerRole = await roles.create(`Manager`, salary, deptID);
        const roleID = newManagerRole.insertId;
        console.log("\nPlease add information for the department manager.\n")
        addEmployee(roleID);
    });
}

const viewRole = async () => {
    const allroles = await roles.read();
    console.log(allroles);
    mainMenu();
};
const viewAllRoles = async () => {
    const allroles = await roles.read();
    console.log(allroles);
    mainMenu();
};
const deleteRole = () => { };
const updateRole = () => { };

/////////////////////////////////////////////////////////////////Employee Menus///////////////////////////////////////////////////////////////
const addEmployee = (roleID, managerID) => {
    inq.prompt([
        {
            type: "input",
            message: "Please enter the employee's first name.",
            name: "firstName"
        },
        {
            type: "input",
            message: "Please etner the employee's last name.",
            name: "lastName"
        }
    ]).then(async (answers) => {
        const fn = answers.firstName;
        const ln = answers.lastName;
        let newEmp;
        //if a managerID was supplied, add the manager's ID
        if (managerID) newEmp = await employees.create(fn, ln, roleID, managerID);
        //otherwise, the employee is a manager, so supply their own ID...
        else newEmp = await employees.create(fn, ln, roleID, 1);
        const newEmpID = newEmp.insertId;
        await employees.update(["manager_id"], [newEmpID], "id", newEmpID);
        console.log("Employee added!");
        mainMenu();
    });
}

const newEmployee = async () => {
    const allroles = await roles.read();
    roleChoices = allroles.map(role => role = role.title + " (id: " + role.id + ")");
    inq.prompt({
        type: "list",
        message: "Please select a role for the employee to fill.",
        choices: roleChoices,
        name: "role"
    }).then(async (answers) => {
        //get the role id
        const roleID = allroles[roleChoices.indexOf(answers.role)].id;
        //get the role
        let role = await roles.read("id", roleID);
        //get the department id of the role
        let deptID = role.department_id;
        //get all roles with the title manager
        let managerRoles = await roles.read("title", "Manager");
        //filter the results based on the deptID
        let managerRoleID = managerRoles.filter(mRole => mRole.department_id === deptID).join("");
        managerRoleID = Number(managerRoleID);
        let manager = await employees.read("role_id", managerRoleID);
        const managerID = manager.id;
        addEmployee(roleID, managerID);
    });
}

const empMenu = async () => {
    let allemps = await employees.read();
    let menuOptions = ["Add an employee", "View Employees", "Update Employee", "Delete Employee", "Main Menu"];
    inq.prompt({
        type: "list",
        message: "Please select an action.",
        choices: menuOptions,
        name: "empMenu"
    }).then(answers => {
        const reply = answers.empMenu;
        if (reply === menuOptions[0]) newEmployee();
        else if (reply === menuOptions[1]) viewEmployees();
        else if (reply === menuOptions[2]) updateEmployee();
        else if (reply === menuOptions[4]) deleteEmployee();
        else mainMenu();
    });
}

const viewEmployees = async () => {
    const allemps = await employees.read();
    console.log(allemps);
    mainMenu();
}

const updateEmployee = async () => {
    const allemps = await employees.read();
    const employeeChoices = allemps.map(emp => emp = emp.first_name + " " + emp.last_name + " (id: " + emp.id + ")");
    inq.prompt({
        type: "list",
        choices: employeeChoices,
        message: "Select an Employee to Update",
        name: "emp"
    }).then(async (answers) => {
        const empID = allemps[employeeChoices.indexOf(answers.emp)].id;
        const allroles = await roles.read();
        const roleChoices = allroles.map(role => role = role.title + " (id: " + role.id + ")");
        inq.prompt({
            type: "list",
            message: "Please select a role for the employee to fill.",
            choices: roleChoices,
            name: "role"
        }).then(async (answers) => {
            //get the role id
            const roleID = allroles[roleChoices.indexOf(answers.role)].id;
            //get the role
            let role = await roles.read("id", roleID);
            //get the department id of the role
            let deptID = role.department_id;
            //get all roles with the title manager
            let managerRoles = await roles.read("title", "Manager");
            //filter the results based on the deptID
            let managerRoleID = managerRoles.filter(mRole => mRole.department_id === deptID).join("");
            managerRoleID = Number(managerRoleID);
            let manager = await employees.read("role_id", managerRoleID);
            const managerID = manager.id;
            const updatedEmp = await employees.update(["role_id"], [roleID], "id", empID);
            console.log("employee role updated.");
            mainMenu();
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(async () => {
    mainMenu();
})();

