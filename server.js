//dependencies
const mysql = require('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table')

//mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1qaz!QAZ',
    database: 'manageMe_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected to ManageMeDB')
    console.log(` 

    __  __   __   _  _   __   __  ___    __  __  ___    ___   __  ____  __   ___   __   ___  ___ 
    (  \/  ) (  ) ( \( ) (  ) / _)(  _)  (  \/  )(  _)  (   \ (  )(_  _)(  ) (  ,) (  ) / __)(  _)
     )    (  /__\  )  (  /__\( (/\ ) _)   )    (  ) _)   ) ) )/__\  )(  /__\  ) ,\ /__\ \__ \ ) _)
    (_/\/\_)(_)(_)(_)\_)(_)(_)\__/(___)  (_/\/\_)(___)  (___/(_)(_)(__)(_)(_)(___/(_)(_)(___/(___)                               
                                                                                        
                                                                      `)
//inquirer-questions function                        
promptQuestions();                                                                                    
});

//begin inquirer
function promptQuestions() {
    inquirer.prompt({
        type: 'list',
        name: 'prompts',
        message: 'Please select what you would like to do:',
        choices: [
            "View all departments",
            "Add a new department",
            "View all roles",
            "Add a new role",
            "View all employees",
            "View employees by department",
            "View employees by manager",
            "Add an employee",
            "Update an employee's role",
            "Exit"
         ]
    })
    .then(function ({ prompts }) {
        switch(prompts) {
            case "View all departments":
                viewDepartments();
                break;
            
            case "Add a new department":
                addDepartments();
                break;

            case "View all roles":
                viewRoles();
                break;
            
            case "Add a new role":
                addRole();
                break;

            case "View all employees":
                viewEmployees();
                break;

            case "View employees by department":
                viewEmpDepartments();
                break;

            case "View employees by manager":
                viewEmpManagers();
                break;

            case "Add an employee":
                addEmployee();
                break;

            case "Update an employee's role":
                updateRole();
                break;

            case "Exit":
                connection.end();
                break;
        }
    })
}

//see current departments
function viewDepartments() {
    console.log('Viewing departments!')
    let departments;
    connection.query("SELECT id, name FROM department", (err, res) => {
        if (err) throw err;
        departments = res;
        console.log(departments)
        promptQuestions();
    })
}

//add new department
function addDepartments(department) {
    console.log('Adding a new department!')
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "Please name your new department."
        }
    ])
    .then(function(answer) {
    connection.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, (err,res) => {
        if (err) throw err;
        console.log(`Your new department, ${answer.department}, has been created.`)
        promptQuestions();
    })
})
}

//view roles
function viewRoles() {
    console.log('Viewing roles!')
    let roles;
    connection.query("SELECT role.id, role.title AS role, role.salary FROM role", (err, res) => {
        if (err) throw err;
        roles = res;
        console.table(roles);
        promptQuestions();
    })
}

// add a new role
function addRole() {
    console.log('Creating a new role!');
    connection.query('SELECT * FROM department', function(err, res) {
        let departments = res.map(({id, name}) => ({
            name: name,
            value: id
        }))

        inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the title of the new role?'
            },
            {
                type: 'input',
                name: 'departmentSalary',
                message: 'What is the salary of the new role?'
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'What department does this new role belong to?',
                choices: departments
            }
        ])
        .then(answer => {
            let role = {
                title: answer.departmentName,
                salary: answer.departmentSalary,
                department_id: answer.departmentId
            }
                connection.query('INSERT INTO role SET ?', role, function(err, res) {
                    if (err) throw err;
                    promptQuestions();
                })
        })
    })

}

// view employees
function viewEmployees() {
    console.log('Viewing employees!')
    let employees;
    connection.query(`SELECT employee.id, role_id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name, manager_id FROM employee`, (err, res) => {
        if (err) throw err;
        employees = res;
        console.table(res);
        promptQuestions();
    })
}

// view employees by departments 
function viewEmpDepartments() {
    console.log('Viewing employees by departments.')
    let departments;
    connection.query(`SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
                      FROM employee
                      LEFT JOIN role ON (role.id = employee.role_id)
                      LEFT JOIN department ON (department.id = role.department_id)
                      ORDER BY department.name`, (err,res) => {
    departments = res
    console.table(res)
    promptQuestions();
    })
}

// view employees by managers 
function viewEmpManagers() {
    console.log('Viewing employees by manager!')
    let managers;
    connection.query(`SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
                     FROM employee
                     LEFT JOIN employee manager on manager.id = employee.manager_id
                     INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
                     INNER JOIN department ON (department.id = role.department_id)
                     ORDER BY manager`, (err, res) => {
        if (err) throw err;
        managers = res;
        console.table(managers);
        promptQuestions();
  })
};

// add employee //HELP
function addEmployee() {
    console.log('Adding a new employee!');
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee', function(err, res) {
        let employee = res.map(({id, first_name, last_name, role_id, manager_id}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))

        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the employee?'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the new employee?'
            },
            {
                type: "input",
                message: "What is the employee's role id number?",
                name: "role_id"
            },
            {
                type: "list",
                message: "What is the manager id number?",
                name: "manager_id",
                choices: employee
            }
        ])
        .then(answer => {
            let employee = {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id
            }
                connection.query('INSERT INTO employee SET ?', employee, function(err, res) {
                    if (err) throw err;
                    promptQuestions();
                })
        })
    })

}

// update role
function updateRole() {
    console.log('Updating a role!')
    connection.query('SELECT * FROM employee', function(err, res) {
        let employees = res.map(({first_name, last_name, id}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'What  employee would you like to update?',
                choices: employees
            }
        ])  
        .then(res => {
            let employeeId = res.employeeId;
            connection.query('SELECT * FROM role', function(err, res) {
                let roles = res.map(({title, id}) => ({
                    name: title,
                    value: id
                }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleId',
                        message: 'What  role would you like to update?',
                        choices: roles
                    }
                ])  
                .then(res => {
                    connection.query(`UPDATE employee SET role_id = ${res.roleId} WHERE id =${employeeId}`, function(err, res) {
                        if(err) throw err;
                        console.log(res)
                        promptQuestions();
                    })
                    
                })
            })

        })
    })
}
