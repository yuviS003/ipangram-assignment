const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

exports.register = async (req, res) => {
  const {
    empName,
    empEmail,
    empContact,
    empPassword,
    empDepartments,
    empLocation,
    empRole,
  } = req.body;

  try {
    let employee = await Employee.findOne({ empEmail });
    if (employee) {
      logger.warn(`Register attempt with existing email: ${empEmail}`);
      return res.status(400).json({ message: "Employee already exists" });
    }

    employee = new Employee({
      empName,
      empEmail,
      empContact,
      empPassword,
      empDepartments,
      empRole,
      empLocation,
    });

    await employee.save();

    const payload = { employee: { id: employee.id } };

    jwt.sign(payload, "jwtSecret", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      logger.info(`Employee registered: ${empEmail}`);
      res.json({ token });
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { empEmail, empPassword } = req.body;

  try {
    let employee = await Employee.findOne({ empEmail });
    if (!employee) {
      logger.warn(`Login attempt with non-existing email: ${empEmail}`);
      return res.status(400).json({
        message: "Invalid Credentials. No employee found with this email",
      });
    }

    const isMatch = await bcrypt.compare(empPassword, employee.empPassword);
    if (!isMatch) {
      logger.warn(
        `Login attempt with incorrect password for email: ${empEmail}`
      );
      return res
        .status(400)
        .json({ message: "Invalid Credentials. Incorrect Password" });
    }

    const payload = { employee: { id: employee.id } };

    jwt.sign(payload, "jwtSecret", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      logger.info(`Employee logged in: ${empEmail}`);
      res.json({ token });
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
};

// Controller function to get user information
exports.getUserInfo = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id).select(
      "-empPassword"
    );
    if (!employee) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
