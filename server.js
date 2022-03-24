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
    _____ ______    ________   ________    ________   ________   _______           _____ ______    _______          
|\   _ \  _   \ |\   __  \ |\   ___  \ |\   __  \ |\   ____\ |\  ___ \         |\   _ \  _   \ |\  ___ \         
\ \  \\\__\ \  \\ \  \|\  \\ \  \\ \  \\ \  \|\  \\ \  \___| \ \   __/|        \ \  \\\__\ \  \\ \   __/|        
 \ \  \\|__| \  \\ \   __  \\ \  \\ \  \\ \   __  \\ \  \  ___\ \  \_|/__       \ \  \\|__| \  \\ \  \_|/__      
  \ \  \    \ \  \\ \  \ \  \\ \  \\ \  \\ \  \ \  \\ \  \|\  \\ \  \_|\ \       \ \  \    \ \  \\ \  \_|\ \     
   \ \__\    \ \__\\ \__\ \__\\ \__\\ \__\\ \__\ \__\\ \_______\\ \_______\       \ \__\    \ \__\\ \_______\    
    \|__|     \|__| \|__|\|__| \|__| \|__| \|__|\|__| \|_______| \|_______|        \|__|     \|__| \|_______|    
                                                                                                                 
                                                                                                                 
                                                                                                                 
 ________   ________   _________   ________   ________   ________   ________   _______                           
|\   ___ \ |\   __  \ |\___   ___\|\   __  \ |\   __  \ |\   __  \ |\   ____\ |\  ___ \                          
\ \  \_|\ \\ \  \|\  \\|___ \  \_|\ \  \|\  \\ \  \|\ /_\ \  \|\  \\ \  \___|_\ \   __/|                         
 \ \  \ \\ \\ \   __  \    \ \  \  \ \   __  \\ \   __  \\ \   __  \\ \_____  \\ \  \_|/__                       
  \ \  \_\\ \\ \  \ \  \    \ \  \  \ \  \ \  \\ \  \|\  \\ \  \ \  \\|____|\  \\ \  \_|\ \                      
   \ \_______\\ \__\ \__\    \ \__\  \ \__\ \__\\ \_______\\ \__\ \__\ ____\_\  \\ \_______\                     
    \|_______| \|__|\|__|     \|__|   \|__|\|__| \|_______| \|__|\|__||\_________\\|_______|                     
                                                                      \|_________|                               
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

// view employees by departments;
function viewEmpDepartments() {
    console.log('Viewing employees by departments.')
    let departments;
    connection.query(`SELECT department.id, department.name, role.salary AS budget FROM employee`)
    promptQuestions();
}


// view employees by managers
function viewEmpManagers() {
    console.log('Viewing employees by manager!')
    let managers;
    connection.query(`SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee
                      ORDER BY managers`, (err, res) => {
        if (err) throw err;
        managers = res;
        console.table(managers);
        promptQuestions();
  })
};

// add employee
function addEmployee() {
    console.log('Adding a new employee!');
    connection.query('SELECT * FROM employee', function(err, res) {
        let employee = res.map(({id, first_name, last_name, manager_id}) => ({
            first_name: firstName,
            last_name: last_name,
            department: name,
            role: title,
            value: id
        }))

        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of the employee?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the new employee?'
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'What department does this new employee belong to?',
                choices: departments
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'What department role does this new employee have?',
                choices: role
            }
        ])
        .then(answer => {
            let employee = {
                title: answer.departmentName,
                salary: answer.departmentSalary,
                department_id: answer.departmentId
            }
                connection.query('INSERT INTO employee SET ?', role, function(err, res) {
                    if (err) throw err;
                })
        })
    })

}

// update role
function updateRole() {
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
                    })
                })
            })

        })
    })
}
