import { Paper } from "@mui/material";
import axios from "axios";
import SignInForm from "../../components/Auth/SignInForm";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const apiUrl = import.meta.env.VITE_API_URL;

const UserAuth = ({ triggerGlobalLoader }) => {
  const navigate = useNavigate();

  const handleSignIn = (email, password) => {
    triggerGlobalLoader(true, "Logging in...");
    const data = JSON.stringify({
      empEmail: email,
      empPassword: password,
    });
    const config = {
      method: "post",
      url: `${apiUrl}/api/auth/login`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log("LOGIN API resp-->", response.data);
        if (response.data.token) {
          sessionStorage.setItem("token", response.data.token);
          enqueueSnackbar("Login Successful!", {
            variant: "success",
          });
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log("LOGIN API err-->", error);
        enqueueSnackbar(
          error.response.data.message || "Error logging in. Please try again.",
          {
            variant: "error",
          }
        );
      })
      .finally(() => triggerGlobalLoader(false));
  };

  return (
    <div className="h-screen flex items-center justify-center bg-lime-50">
      <Paper elevation={10}>
        <SignInForm handleSignIn={handleSignIn} />
      </Paper>
    </div>
  );
};

export default UserAuth;
