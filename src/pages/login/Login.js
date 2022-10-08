import React, { useState } from "react";
import { Grid, CircularProgress, Typography, Button, Tabs, Tab, TextField, Fade } from "@material-ui/core";
import { withRouter } from "react-router-dom";

import useStyles from "./styles";
import logo2 from "./logo2.png";
import { useUserDispatch, LoginAdmin } from "../../context/UserContext";
import ResetPasswordModal from "../../components/Modal/ResetPasswordModal";

function Login(props) {
  var classes = useStyles();
  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>

        <ResetPasswordModal/>

        <img src={logo2} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}><font color="#eb5335">Praedico</font> <font color="#143a60">Global</font> <font color="#70940a">Research</font>  </Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          {activeTabId === 0 && <Tabs
            value={activeTabId}
            onChange={(_e, id) => setActiveTabId(id)}
            indicatorColor="secondary"
            textColor="secondary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
          </Tabs>}
          {activeTabId === 0 && (
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <div>
                <TextField
                  id="email"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={loginValue}
                  onChange={e => setLoginValue(e.target.value)}
                  margin="normal"
                  placeholder="Email Adress"
                  type="email"
                  fullWidth
                />
                <TextField
                  id="password"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={passwordValue}
                  onChange={e => setPasswordValue(e.target.value)}
                  margin="normal"
                  placeholder="Password"
                  type="password"
                  fullWidth
                />
              </div>
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>
                      LoginAdmin(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                    variant="contained"
                    color="secondary"
                    size="large"
                  >
                    Login
                  </Button>
                )}
                <Button
                  color="secondary"
                  size="large"
                  className={classes.forgetButton}
                  onClick={() => setActiveTabId(1)}
                >
                  Forget Password
                </Button>
              </div>
            </React.Fragment>
          )}
        </div>


        <div className={classes.form}>
          {activeTabId === 1 && <Tabs
            value={activeTabId}
            onChange={(_e, id) => setActiveTabId(id)}
            indicatorColor="secondary"
            textColor="secondary"
            centered
          >
            <Tab label="Forget Password" classes={{ root: classes.tab }} />
          </Tabs>}
          {activeTabId === 1 && (
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Email Does Not Exist :(
                </Typography>
              </Fade>
              <div>
                <TextField
                  id="email"
                  InputProps={{
                    classes: {
                      underline: classes.textFieldUnderline,
                      input: classes.textField,
                    },
                  }}
                  value={loginValue}
                  onChange={e => setLoginValue(e.target.value)}
                  margin="normal"
                  placeholder="Email Adress"
                  type="number"
                  fullWidth
                />
              </div>
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    // disabled={
                    //   loginValue.length === 0 || passwordValue.length === 0
                    // }
                    variant="contained"
                    color="secondary"
                    size="large"
                  >
                    Send OTP
                  </Button>
                )}
                <Button
                  color="secondary"
                  size="large"
                  className={classes.forgetButton}
                  onClick={() => setActiveTabId(0)}
                >
                  Login
                </Button>
              </div>
            </React.Fragment>
          )}
        </div>
        <Typography color="secondary" className={classes.copyright}>
          © 2014-{new Date().getFullYear()} Praedico Global Research
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
