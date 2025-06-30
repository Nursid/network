import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../../Context/userAuthContext";
import { useState } from "react";
import { roles } from "../../../config";
import { Formik } from "formik";
import { useUserRoleContext } from "../../../Context/RolesContext";
import { isMobile } from "react-device-detect";
import { ScaleLoader } from "react-spinners";
import { UseStateManager } from "../../../Context/StateManageContext";
import { ForgetPasswordModal } from "../../../Components/Modal";

function AdminSignIn() {
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState(roles.super);
  const [forgetPasswordModalOpen, setForgetPasswordModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const { UserRoleCalled } = useUserRoleContext();
  const [loader, setLoader] = useState(false);
  const { timeRemaining, setTimeRemaining } = UseStateManager();
  const { currentUser, getUserLogIn, sendOtp, otpid, setOtpId } = useAuth();

  if (currentUser) {
    if (location.pathname === "/admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Outlet />;
  }

  // formdara
  const LoginData = {
    number: "",
  };

  const OnLoginSubmit = async (formdata, { resetForm }) => {
    sessionStorage.setItem("role", selectedRole);
   
    getUserLogIn(formdata, selectedRole, otpid).then(() => {
      resetForm();
    });
    if(selectedRole === "super"){
        UserRoleCalled(selectedRole);
    }else{
      UserRoleCalled(selectedRole, formdata.number);
    }
  };

  //   sendOtp Function
  const handleSendOtp = async (number) => {
    setLoader(true);
    await sendOtp(number);
    setTimeRemaining(60);
    setLoader(false);
  };

  const handleForget = () =>{
    setForgetPasswordModalOpen(!forgetPasswordModalOpen)
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 1, sm: 2 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <ForgetPasswordModal
        ForgetPasswordModalOpen={forgetPasswordModalOpen}
        ForgetPasswordModalOpenFunction={() => setForgetPasswordModalOpen(!forgetPasswordModalOpen)}
      />
      
      <ScaleLoader  
        color="#fff"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000
        }}
        loading={loader}
      />

      <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6} sx={{ textAlign: 'center', color: 'white' }}>
            <Box sx={{ mb: { xs: 2, md: 4 } }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                LAXDEEP
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: { xs: 2, md: 3 },
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
                }}
              >
                SYSTEM & SERVICE
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.8,
                  maxWidth: 400,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Your trusted partner for comprehensive network management and technical solutions
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                maxWidth: 450,
                mx: 'auto',
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'visible',
                maxHeight: '90vh'
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, overflow: 'auto' }}>
                {/* Logo and Title */}
                <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 4 } }}>
                  <Box
                    sx={{
                      width: { xs: 60, md: 80 },
                      height: { xs: 60, md: 80 },
                      mx: 'auto',
                      mb: { xs: 1, md: 2 },
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold'
                    }}
                  >
                    LS
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    Sign In
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    {selectedRole === "super"
                      ? "Super Admin Access"
                      : selectedRole === "admin"
                      ? "Admin / Staff Portal"
                      : selectedRole === "customer"
                      ? "Customer Portal"
                      : selectedRole === "office" && "Office Portal"}
                    {otpid && ` • OTP expires in 00:${timeRemaining}`}
                  </Typography>
                </Box>

                {/* Role Selection Pills */}
                <Box sx={{ mb: { xs: 2, md: 3 } }}>
                  <Typography variant="subtitle2" sx={{ mb: { xs: 1, md: 2 }, color: '#666', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    Select Login Type
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      onClick={() => setSelectedRole(roles.super)}
                      variant={selectedRole === roles.super ? "contained" : "outlined"}
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.8rem'
                      }}
                    >
                      Super Admin
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setSelectedRole(roles.admin)}
                      variant={selectedRole === roles.admin ? "contained" : "outlined"}
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.8rem'
                      }}
                    >
                      Admin/Staff
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setSelectedRole(roles.customer)}
                      variant={selectedRole === roles.customer ? "contained" : "outlined"}
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.8rem'
                      }}
                    >
                      Customer
                    </Button>
                  </Box>
                </Box>

                {/* Login Form */}
                {selectedRole === "super" ? (
                  <Formik
                    initialValues={LoginData}
                    onSubmit={OnLoginSubmit}
                    enableReinitialize
                  >
                    {({ values, handleChange, handleSubmit }) => (
                      <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          onChange={handleChange}
                          value={values.email}
                          autoFocus
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                                                 <TextField
                           margin="normal"
                           required
                           fullWidth
                           name="password"
                           label="Password"
                           type={showPassword ? "text" : "password"}
                           id="password"
                           onChange={handleChange}
                           value={values.password}
                           autoComplete="current-password"
                           InputProps={{
                             endAdornment: (
                               <InputAdornment position="end">
                                 <IconButton
                                   aria-label="toggle password visibility"
                                   onClick={handleTogglePasswordVisibility}
                                   edge="end"
                                   sx={{ 
                                     color: '#667eea',
                                     '&:hover': {
                                       backgroundColor: 'rgba(102, 126, 234, 0.1)'
                                     }
                                   }}
                                 >
                                   {showPassword ? <VisibilityOff /> : <Visibility />}
                                 </IconButton>
                               </InputAdornment>
                             ),
                           }}
                           sx={{
                             mb: 2,
                             '& .MuiOutlinedInput-root': {
                               borderRadius: 2
                             }
                           }}
                         />
                        <FormControlLabel
                          control={<Checkbox value="remember" color="primary" />}
                          label="Remember me"
                          sx={{ mb: 2 }}
                        />
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 1,
                            mb: 2,
                            py: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          Sign In
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                          <Link 
                            href="#" 
                            onClick={handleForget} 
                            variant="body2"
                            sx={{ 
                              color: '#ffffff',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            Forgot password?
                          </Link>
                        </Box>
                      </Box>
                    )}
                  </Formik>
                ) : (
                  <Formik
                    initialValues={LoginData}
                    onSubmit={OnLoginSubmit}
                    enableReinitialize
                  >
                    {({ values, handleChange, handleSubmit }) => (
                      <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="number"
                          label="Enter Mobile Number"
                          name="number"
                          autoComplete="mobileNo"
                          onChange={handleChange}
                          value={values.number}
                          autoFocus
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />

                        {otpid && (
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="otp"
                            label="Enter OTP"
                            placeholder="XXXX"
                            name="otp"
                            autoComplete="mobileNo"
                            onChange={handleChange}
                            value={values.otp}
                            sx={{
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                        )}
                        
                        <Grid container spacing={2}>
                          {otpid && (
                            <Grid item xs={6}>
                              <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                  py: 1.5,
                                  borderRadius: 2,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  textTransform: 'none',
                                  fontSize: '0.9rem',
                                  fontWeight: 600
                                }}
                              >
                                Sign In
                              </Button>
                            </Grid>
                          )}
                          <Grid item xs={otpid ? 6 : 12}>
                            <Button
                              type="button"
                              fullWidth
                              disabled={otpid && timeRemaining > 5}
                              onClick={() => handleSendOtp(values.number)}
                              variant={otpid ? "outlined" : "contained"}
                              sx={{
                                py: 1.5,
                                borderRadius: 2,
                                background: otpid ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 600
                              }}
                            >
                              {otpid ? "Re-send OTP" : "Send OTP"}
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Formik>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default AdminSignIn;
