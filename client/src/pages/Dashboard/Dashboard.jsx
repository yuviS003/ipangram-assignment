import { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout"; // Import the Logout icon
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // Import the PeopleAlt icon for Employees
import BusinessIcon from "@mui/icons-material/Business"; // Import the Business icon for Departments
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { IconButton } from "@mui/material";

const drawerWidth = 200;

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = ({ triggerGlobalLoader }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      triggerGlobalLoader(true, "Verifying token...");
      const response = await axios.get(`${apiUrl}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        sessionStorage.setItem("employeeData", JSON.stringify(data));
      } else {
        const errorData = response.data;
        enqueueSnackbar(
          errorData.message ||
            "Token verification failed. Please log in again.",
          { variant: "error" }
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      enqueueSnackbar("Error verifying token. Please try again later.", {
        variant: "error",
      });
    } finally {
      triggerGlobalLoader(false);
    }
  };

  const handleLogout = () => {
    // Clear session storage and navigate to login page
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("employeeData");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        color="success"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            ipangram EPMS
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={handleLogout}>
            {/* Add IconButton for logout */}
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/dashboard/createViewUsers");
                }}
              >
                <ListItemIcon>
                  <PeopleAltIcon /> {/* Change icon to PeopleAltIcon */}
                </ListItemIcon>
                <ListItemText primary={"Employees"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/dashboard/createViewDepartments");
                }}
              >
                <ListItemIcon>
                  <BusinessIcon /> {/* Change icon to BusinessIcon */}
                </ListItemIcon>
                <ListItemText primary={"Departments"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f7fee7",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
