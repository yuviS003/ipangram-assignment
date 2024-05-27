import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import { enqueueSnackbar } from "notistack"; // Import useSnackbar
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const CreateViewUsers = ({ triggerGlobalLoader }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empContact, setEmpContact] = useState("");
  const [empLocation, setEmpLocation] = useState("");
  const [empRole, setEmpRole] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeRole, setEmployeeRole] = useState("");

  const headers = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const employeeData = sessionStorage.getItem("employeeData");
    if (!token || !employeeData) {
      navigate("/");
    } else {
      const employee = JSON.parse(employeeData);
      setEmployeeRole(employee.empRole);
      fetchAllEmployees();
      fetchAllDepartments();
    }
  }, []);

  const fetchAllEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/employees/with-departments`,
        headers
      );
      setAllEmployees(response.data);
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "Error fetching employees. Please try again.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllDepartments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/departments`, headers);
      setAllDepartments(response.data);
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "Error fetching departments. Please try again.",
        {
          variant: "error",
        }
      );
    }
  };

  const handleCreateOrUpdateEmployee = async () => {
    try {
      if (selectedEmployee) {
        triggerGlobalLoader(true, "Updating employee...");
        await axios.put(
          `${apiUrl}/api/employees/${selectedEmployee._id}`,
          {
            empName,
            empEmail,
            empContact,
            empLocation,
            empRole,
            empDepartments: selectedDepartments.map((dep) => dep._id),
          },
          headers
        );
      } else {
        triggerGlobalLoader(true, "Creating employee...");
        await axios.post(
          `${apiUrl}/api/auth/register`,
          {
            empName,
            empEmail,
            empContact,
            empLocation,
            empRole,
            empPassword: password,
            empDepartments: selectedDepartments.map((dep) => dep._id),
          },
          headers
        );
      }
      fetchAllEmployees();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "Error creating/updating employee. Please try again.",
        {
          variant: "error",
        }
      );
    } finally {
      triggerGlobalLoader(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    try {
      triggerGlobalLoader(true, "Updating password...");
      await axios.put(
        `${apiUrl}/api/employees/${selectedEmployee._id}/update-password`,
        { empPassword: newPassword },
        headers
      );
      setPasswordDialogOpen(false);
      resetPasswordForm();
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "Error updating password. Please try again.",
        {
          variant: "error",
        }
      );
    } finally {
      triggerGlobalLoader(false);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      triggerGlobalLoader(true, "Deleting employee...");
      await axios.delete(
        `${apiUrl}/api/employees/${selectedEmployee._id}`,
        headers
      );
      fetchAllEmployees();
      setSelectedEmployee(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "Error deleting employee. Please try again.",
        {
          variant: "error",
        }
      );
    } finally {
      triggerGlobalLoader(false);
    }
  };

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee);
      setEmpName(employee.empName);
      setEmpEmail(employee.empEmail);
      setEmpContact(employee.empContact);
      setEmpLocation(employee.empLocation);
      setEmpRole(employee.empRole);
      setSelectedDepartments(employee.empDepartments);
      setPassword("");
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleOpenPasswordDialog = (employee) => {
    setSelectedEmployee(employee);
    setPasswordDialogOpen(true);
  };

  const handleOpenDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedEmployee(null);
    setEmpName("");
    setEmpEmail("");
    setEmpContact("");
    setEmpLocation("");
    setEmpRole("");
    setPassword("");
    setSelectedDepartments([]);
  };

  const resetPasswordForm = () => {
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const columns = [
    { field: "empName", headerName: "Name", flex: 1 },
    { field: "empEmail", headerName: "Email", flex: 1 },
    { field: "empContact", headerName: "Contact", flex: 1 },
    { field: "empLocation", headerName: "Location", flex: 1 },
    { field: "empRole", headerName: "Role", flex: 1 },
    {
      field: "empDepartments",
      headerName: "Department",
      flex: 1,
      valueGetter: (params) =>
        params.row.empDepartments &&
        params.row.empDepartments
          .map((department) => department.departmentName)
          .join(", "),
    },
  ];
  if (employeeRole === "Manager") {
    columns.push({
      field: "actions",
      headerName: "Actions",
      width: 450,
      renderCell: (params) => (
        <div className="space-x-5">
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleOpenPasswordDialog(params.row)}
            startIcon={<LockIcon />}
          >
            Change Password
          </Button>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleOpenDeleteDialog(params.row)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-4">
      <div className="w-full flex items-center justify-between">
        <span className="text-3xl text-green-950">Manage Employees</span>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => handleOpenDialog()}
          startIcon={<AddIcon />}
          sx={{ visibility: employeeRole === "Manager" ? "visible" : "hidden" }}
        >
          Create Employee
        </Button>
      </div>
      <Box sx={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <DataGrid
          rows={allEmployees}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row._id}
          disableSelectionOnClick
          density="compact"
          loading={isLoading}
        />
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {selectedEmployee ? "Update Employee" : "Create Employee"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={empName}
            onChange={(e) => setEmpName(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            color="success"
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            value={empEmail}
            onChange={(e) => setEmpEmail(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            color="success"
          />
          <TextField
            margin="dense"
            label="Contact"
            type="text"
            fullWidth
            value={empContact}
            onChange={(e) => setEmpContact(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            color="success"
          />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            value={empLocation}
            onChange={(e) => setEmpLocation(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            color="success"
          />
          <FormControl fullWidth size="small" margin="dense" color="success">
            <InputLabel shrink>Role</InputLabel>
            <Select
              value={empRole}
              onChange={(e) => setEmpRole(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>
          {!selectedEmployee && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              color="success"
            />
          )}
          <Autocomplete
            multiple
            options={allDepartments}
            getOptionLabel={(option) => option.departmentName}
            value={selectedDepartments}
            onChange={(e, newValue) => setSelectedDepartments(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Departments"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                color="success"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            color="success"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrUpdateEmployee}
            color="success"
            variant="contained"
          >
            {selectedEmployee ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            color="success"
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            color="success"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPasswordDialogOpen(false)}
            color="success"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePassword}
            color="success"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="success"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteEmployee}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateViewUsers;
