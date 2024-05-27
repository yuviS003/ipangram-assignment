const Employee = require("../models/Employee");
const logger = require("../utils/logger");

// Fetch all employees with department details, join, and sort based on provided parameters
exports.getEmployeesWithDepartments = async (req, res) => {
  try {
    const { field, sort } = req.query;

    // Define default sorting options
    const defaultSort = { empName: "asc" };
    const sortOptions =
      sort === "asc"
        ? { [field || defaultSort]: 1 }
        : { [field || defaultSort]: -1 };

    const employees = await Employee.find({}, { empPassword: 0 })
      .populate("empDepartments")
      .sort(sortOptions);

    logger.info(
      `Fetched all employees with department details, sorted by ${field} in ${sort} order`
    );
    res.json(employees);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Fetch employee by ID with department details
exports.getEmployeeByIdWithDepartments = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id, {
      empPassword: 0,
    }).populate("empDepartments");
    if (!employee) {
      logger.warn(`Employee not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Employee not found" });
    }
    logger.info(
      `Fetched employee with ID: ${req.params.id} and department details`
    );
    res.json(employee);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      empName,
      empEmail,
      empContact,
      empLocation,
      empRole,
      empDepartments,
    } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { empName, empEmail, empContact, empLocation, empRole, empDepartments },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      logger.warn(`Employee not found with ID: ${id}`);
      return res.status(404).json({ message: "Employee not found" });
    }

    logger.info(`Updated employee with ID: ${id}`);
    res.json(updatedEmployee);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      logger.warn(`Employee not found with ID: ${id}`);
      return res.status(404).json({ message: "Employee not found" });
    }

    logger.info(`Deleted employee with ID: ${id}`);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update employee password by ID
exports.updateEmployeePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { empPassword } = req.body;

    // Validate that the new password is provided
    if (!empPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Find the employee
    const employee = await Employee.findById(id);
    if (!employee) {
      logger.warn(`Employee not found with ID: ${id}`);
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the password
    employee.empPassword = empPassword;

    // Save the updated employee (this will trigger the pre-save hook to hash the password)
    await employee.save();

    logger.info(`Updated password for employee with ID: ${id}`);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};
