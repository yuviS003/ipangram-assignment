const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getEmployeesWithDepartments,
  getEmployeeByIdWithDepartments,
  updateEmployee,
  deleteEmployee,
  updateEmployeePassword,
} = require("../controllers/employeeController");

// Route to get all employees with department details
router.get("/with-departments", auth, getEmployeesWithDepartments);

// Route to get an employee by ID with department details
router.get("/:id/with-departments", auth, getEmployeeByIdWithDepartments);

// Route to update an employee by ID
router.put("/:id", auth, updateEmployee);

// Route to delete an employee by ID
router.delete("/:id", auth, deleteEmployee);

// Route to update an employee's password by ID
router.put("/:id/update-password", auth, updateEmployeePassword);

module.exports = router;
