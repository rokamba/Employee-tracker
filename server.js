const inquirer = require("inquirer");
const express = require ('express');
const mysql = require('mysql2');
const consoleTable = require("console.table");
const db = require('./db/connection');
const PORT = process.env.PORT || 3006;
const app = express();

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
     console.log(`Server running`);
     init();
     });
});

//main function
const init = () => {
  inquirer.prompt([

    {
      type: "list",
      name: "license",
      message: "What would you like to do? : ",
      choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role"
      ]
    }

  ]).then(function (answer) {
  switch (answer.choices) {
    case "View All Employees":
      viewAllEmployees();
      break;

    case "View All Departments":
      viewAllDept();
      break;

    case "View All roles":
      viewAllRoles();
      break;

    case "Add an Employee":
      addEmployee();
      break;

    case "Add a Department":
      addDept();
      break;

    case "Add a role":
      addRole();
      break;

    case "Update an Employee role":
      updateEmployeeRole();
      break;
  }
});
}


function viewAllEmployees(){
  const sql = `SELECT employees.*`
  db.query(sql,(err,res) =>{
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(res);
    init();
  })
}

function viewAllDept(){
  const sql = `SELECT * FROM department`
  db.query(sql,(err,res) =>{
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(res);
    init();
  })
}

function viewAllRoles(){
  const sql = `SELECT * FROM role`
    // Query from connection
  db.query(sql,(err,res) =>{
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Display query results using console.table
    console.table(res);
    init();
  })
}

// Add employees
const addEmployee = () => {
  inquirer.prompt([
      {
        type: "input",
        message: "Enter the employee's first name",
        name: "firstName"
      },
      {
        type: "input",
        message: "Enter the employee's last name",
        name: "lastName"
      },
      {
        type: "input",
        message: "Enter the employee's role ID",
        name: "addEmployRole"
      },
      {
        type: "input",
        message: "Enter the employee's manager ID",
        name: "addEmployMgr"
      }
    ])
    .then(function (res) {
      const firstName = res.firstName;
      const lastName = res.lastName;
      const employRoleID = res.addEmployRole;
      const employMgrID = res.addEmployMgr;
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", "${employRoleID}", "${employMgrID}")`;
      db.query(sql, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        mainMenu();
      });
    });
}

//Add departments
function addDept() {
  inquirer
    .prompt({
      type: "input",
      message: "Enter the name of the new department",
      name: "newDept"
    })
    .then(function (res) {
      const newDepartment = res.newDept;
      const sql = `INSERT INTO department (department_name) VALUES ("${newDepartment}")`;
      db.query(sql, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        init();
      });
    });
}

// Add roles

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the employee's title",
        name: "roleTitle"
      },
      {
        type: "input",
        message: "Enter the employee's salary",
        name: "roleSalary"
      },
      {
        type: "input",
        message: "Enter the employee's department ID",
        name: "roleDept"
      }
    ])
    .then(function (res) {
      const title = res.roleTitle;
      const salary = res.roleSalary;
      const departmentID = res.roleDept;
      const sql = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${departmentID}")`;
      db.query(sql, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        init();
      });
    });
}

// Update Employee Role
function updateEmployeeRole() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "Enter the employee's ID you want to be updated",
      name: "updatedEmployee"
    },
    {
      type: "input",
      message: "Enter the new role ID for that employee",
      name: "newRole"
    }
  ])
  .then(function (res) {
      const updatedEmployee = res.updateEmploy;
      const newRole = res.newRole;
      const sql = `UPDATE employee SET role_id = "${newRole}" WHERE id = "${updatedEmployee}"`;
      db.query(sql, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        init();
      })
    });
  }
