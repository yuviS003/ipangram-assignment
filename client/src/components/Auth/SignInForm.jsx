import { Button, TextField } from "@mui/material";
import { useState } from "react";

const SignInForm = ({ handleSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 py-10 space-y-6 max-w-[350px]">
      <p className="text-center text-3xl">LOGIN</p>
      <p className="text-center text-sm italic">Employee Management System</p>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        color="success"
        InputLabelProps={{ shrink: true }}
        placeholder="Enter your email"
        type="email"
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        size="small"
        color="success"
        InputLabelProps={{ shrink: true }}
        placeholder="Enter your password"
        type="password"
      />
      <Button
        type="submit"
        variant="contained"
        color="success"
        size="small"
        fullWidth
      >
        Sign In
      </Button>
    </form>
  );
};

export default SignInForm;
