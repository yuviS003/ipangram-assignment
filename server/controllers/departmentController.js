const Department = require("../models/Department");
const logger = require("../utils/logger");

// Create a new department
exports.createDepartment = async (req, res) => {
  const { departmentName, departmentHead } = req.body;

  try {
    let existingDepartment = await Department.findOne({ departmentName });
    if (existingDepartment) {
      logger.warn(
        `Department creation attempt with existing name: ${departmentName}`
      );
      return res.status(400).json({ msg: "Department already exists" });
    }

    let department = new Department({ departmentName, departmentHead });
    await department.save();
    logger.info(`Created department: ${departmentName}`);
    res.json(department);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update an existing department
exports.updateDepartment = async (req, res) => {
  const { departmentName, departmentHead } = req.body;

  try {
    let department = await Department.findById(req.params.id);
    if (!department) {
      logger.warn(`Department not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Department not found" });
    }

    if (departmentName && departmentName !== department.departmentName) {
      let existingDepartment = await Department.findOne({ departmentName });
      if (existingDepartment) {
        logger.warn(
          `Department update attempt with existing name: ${departmentName}`
        );
        return res
          .status(400)
          .json({ message: "Department name already exists" });
      }
    }

    department.departmentName = departmentName || department.departmentName;
    department.departmentHead = departmentHead || department.departmentHead;

    await department.save();
    logger.info(`Updated department with ID: ${req.params.id}`);
    res.json(department);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete a department by ID
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      logger.warn(`Department not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Department not found" });
    }
    await department.remove();
    logger.info(`Deleted department with ID: ${req.params.id}`);
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      logger.warn(`Department not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};
