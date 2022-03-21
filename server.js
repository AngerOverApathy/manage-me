//dependencies
const mysql = require('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table')

//mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
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
    //questions function                        
    promptQuestions();                                                                                    
});

//begin inquirer
function promptQuestions() {
    inquirer.prompt({
        type: 'list',
        name: 'query',
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
}