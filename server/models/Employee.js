const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
  empName: { type: String, required: true },
  empEmail: { type: String, required: true, unique: true },
  empContact: { type: String, required: true },
  empPassword: { type: String, required: true },
  empLocation: { type: String, required: true },
  empDepartments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
  empRole: { type: String, enum: ["Manager", "Employee"], required: true },
});

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("empPassword")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.empPassword = await bcrypt.hash(this.empPassword, salt);
  next();
});

module.exports = mongoose.model("Employee", employeeSchema);
