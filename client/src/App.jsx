import { Route, Routes } from "react-router-dom";
import UserAuth from "./pages/UserAuth/UserAuth";
import { SnackbarProvider } from "notistack";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateViewUsers from "./pages/CreateViewUsers/CreateViewUsers";
import CreateViewDepartments from "./pages/CreateViewDepartments/CreateViewDepartments";
import CircularLoader from "./components/Loaders/CircularLoader";
import { useState } from "react";
import DashboardLander from "./pages/Dashboard/DashboardLander";

const App = () => {
  const [globalLoaderText, setGlobalLoaderText] = useState("Loading...");
  const [globalLoaderStatus, setGlobalLoaderStatus] = useState(false);

  const triggerGlobalLoader = (status, text = "Loading...") => {
    setGlobalLoaderStatus(status);
    setGlobalLoaderText(text);
  };

  return (
    <div>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transitionDuration={200}
        autoHideDuration={2000}
        preventDuplicate={true}
      />
      {globalLoaderStatus && <CircularLoader loaderText={globalLoaderText} />}
      <Routes>
        <Route
          index
          element={<UserAuth triggerGlobalLoader={triggerGlobalLoader} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard triggerGlobalLoader={triggerGlobalLoader} />}
        >
          <Route index element={<DashboardLander />} />
          <Route
            path="createViewUsers"
            element={
              <CreateViewUsers triggerGlobalLoader={triggerGlobalLoader} />
            }
          />
          <Route
            path="createViewDepartments"
            element={
              <CreateViewDepartments
                triggerGlobalLoader={triggerGlobalLoader}
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
