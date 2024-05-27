const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    logger.warn("Authorization denied: No token provided");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Authorization denied: Malformed token");
    return res
      .status(401)
      .json({ message: "Malformed token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "jwtSecret");
    req.employee = decoded.employee;
    logger.info(`Authorization successful for employee ID: ${req.employee.id}`);
    next();
  } catch (err) {
    logger.error("Token verification failed", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
