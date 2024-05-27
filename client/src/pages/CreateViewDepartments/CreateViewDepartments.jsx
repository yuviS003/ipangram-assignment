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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const apiUrl = import.meta.env.VITE_API_URL;

const CreateViewDepartments = ({ triggerGlobalLoader }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentHead, setDepartmentHead] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      fetchDepartments();
    }
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/api/departments`, headers);
      setDepartments(response.data);
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "Error fetching departments. Please try again.",
        { variant: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateDepartment = async () => {
    try {
      if (selectedDepartment) {
        triggerGlobalLoader(true, "Updating departments...");
        await axios.put(
          `${apiUrl}/api/departments/${selectedDepartment._id}`,
          {
            departmentName,
            departmentHead,
          },
          headers
        );
      } else {
        triggerGlobalLoader(true, "Creating departments...");
        await axios.post(
          `${apiUrl}/api/departments`,
          {
            departmentName,
            departmentHead,
          },
          headers
        );
      }
      fetchDepartments();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "Error creating/updating department. Please try again.",
        { variant: "error" }
      );
    } finally {
      triggerGlobalLoader(false);
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      triggerGlobalLoader(true, "Deleting departments...");
      await axios.delete(
        `${apiUrl}/api/departments/${selectedDepartment._id}`,
        headers
      );
      fetchDepartments();
      setSelectedDepartment(null);
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "Error deleting department. Please try again.",
        { variant: "error" }
      );
    } finally {
      triggerGlobalLoader(false);
    }
  };

  const handleOpenDialog = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setDepartmentName(department.departmentName);
      setDepartmentHead(department.departmentHead);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedDepartment(null);
    setDepartmentName("");
    setDepartmentHead("");
  };

  const columns = [
    { field: "departmentName", headerName: "Department Name", flex: 1 },
    { field: "departmentHead", headerName: "Department Head", flex: 1 },
  ];

  if (employeeRole === "Manager") {
    columns.push({
      field: "actions",
      headerName: "Actions",
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
            onClick={handleDeleteDepartment}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </div>
      ),
      flex: 1,
    });
  }

  return (
    <div className="space-y-5">
      <div className="w-full flex items-center justify-between">
        <span className="text-3xl text-green-950">Manage Departments</span>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => handleOpenDialog()}
          startIcon={<AddIcon />}
          sx={{
            visibility: employeeRole === "Manager" ? "visible" : "hidden",
          }}
        >
          Create Department
        </Button>
      </div>
      <Box sx={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <DataGrid
          rows={departments}
          columns={columns}
          pageSize={5}
          onSelectionModelChange={(newSelection) => {
            setSelectedDepartment(
              departments.find((d) => d._id === newSelection.selectionModel[0])
            );
          }}
          getRowId={(row) => row._id}
          loading={isLoading}
        />
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {selectedDepartment ? "Update Department" : "Create Department"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            type="text"
            fullWidth
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            color="success"
          />
          <TextField
            margin="dense"
            label="Department Head"
            type="text"
            fullWidth
            value={departmentHead}
            onChange={(e) => setDepartmentHead(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            color="success"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="success">
            Cancel
          </Button>
          <Button onClick={handleCreateOrUpdateDepartment} color="success">
            {selectedDepartment ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateViewDepartments;
