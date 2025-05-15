import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export function LoginPage({ onLogin, onLoginWithGoogle, onSignup }) {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nameError, setNameError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length > 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password, navigate);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Validate name
    if (!validateName(name)) {
      setNameError("Please enter your name");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    // Clear errors if validation passes
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setPasswordMatchError("");

    onSignup(email, password, navigate, name);
  };

  // Reset errors when inputs change
  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
    setPasswordMatchError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatchError("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <div>
        <Paper elevation={3} sx={{ p: 4 }}>
          {!showSignup ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Log in to Pixelworld
                </Typography>
                <div className="pl-4 text-3xl">🖌️</div>
              </Box>

              <Box
                component="form"
                onSubmit={handleLoginSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowPassword} edge="end">
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Log in
                </Button>
              </Box>

              <Box sx={{ my: 3 }}>
                <Button
                  onClick={() => {
                    onLoginWithGoogle(navigate);
                  }}
                  variant="outlined"
                  fullWidth
                  startIcon={<Google />}
                  sx={{ py: 1 }}
                >
                  Continue with Google
                </Button>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Are you new here?
                </Typography>
                <Button
                  onClick={() => setShowSignup(true)}
                  variant="contained"
                  color="secondary"
                  fullWidth
                >
                  Create an account
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Create an account
                </Typography>
                <div className="pl-4 text-3xl">🖌️</div>
              </Box>

              <Box
                component="form"
                onSubmit={handleSignupSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={name}
                  onChange={handleNameChange}
                  required
                  error={!!nameError}
                  helperText={nameError}
                />

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  error={!!emailError}
                  helperText={emailError}
                />

                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  error={!!passwordError}
                  helperText={passwordError}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowPassword} edge="end">
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  error={!!passwordMatchError}
                  helperText={passwordMatchError}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Sign up
                </Button>
              </Box>

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Already have an account?
                </Typography>
                <Button
                  onClick={() => setShowSignup(false)}
                  variant="contained"
                  color="secondary"
                  fullWidth
                >
                  Back to login
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </div>
    </div>
  );
}
