const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createDepartment,
  updateDepartment,
  getAllDepartments,
  getDepartmentById,
  deleteDepartment,
} = require("../controllers/departmentController");

router.post("/", auth, createDepartment);
router.put("/:id", auth, updateDepartment);
router.delete("/:id", auth, deleteDepartment);
router.get("/", auth, getAllDepartments);
router.get("/:id", auth, getDepartmentById);

module.exports = router;
