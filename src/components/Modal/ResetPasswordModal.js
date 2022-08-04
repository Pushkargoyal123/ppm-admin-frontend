import CloseIcon from '@material-ui/icons/Close';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Fab, IconButton, InputAdornment, OutlinedInput, FormControl, InputLabel, Button, Grid } from "@material-ui/core";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { postRequestWithFetch } from '../../service';

const error = {
  textAlign: "left",
  color: "red",
  opacity: "0.7",
  fontSize: "0.7rem",
  marginTop : 3
}

export default function ResetPasswordModal(props) {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [oldPasswordError, setOldPasswordError] = useState(null);
    const [newPasswordError, setNewPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(function () {
        if (window.location.search !== "") {
            setOpen(true);
        }
    }, [props])

    const handleSubmit = async () => {

        let err = false;

        if (oldPassword.trim() === "") {
            err = true;
            setOldPasswordError("Old Password can not be blank")
        } else {
            setOldPasswordError(null)
        }

        if (newPassword.trim() === "") {
            err = true;
            setNewPasswordError("New Password can not be blank")
        } else {
            setNewPasswordError(null);
        }

        if (confirmPassword.trim() === "") {
            err = true;
            setConfirmPasswordError("Confirm Password can not be blank")
        } else {
            setNewPasswordError(null)
        }


        if (confirmPassword.trim() === "") {
            err = true;
            setConfirmPasswordError("*confirmPassowrd can not be blank");
        }
        else if (confirmPassword.trim() !== newPassword.trim()) {
            err = true;
            setConfirmPasswordError("Password and Confirm Password are not matching");
        }
        else {
            setConfirmPasswordError(null);
        }

        if (newPassword.trim() === "") {
            err = true;
            setNewPasswordError("*Password can't be empty");
        }
        else if (newPassword.length < 8) {
            err = true;
            setNewPasswordError("*Password Length should be atleast 8 characters long");
        }
        else {
            setNewPasswordError(null);
        }

        if (!err) {
            const email = window.location.search.split("=")[1];
            const body = {
                email: email,
                password: oldPassword,
                newPassword: newPassword,
            }
            const data = await postRequestWithFetch("college/resetPassword", body);
            if(data.success){
                setOpen(false);
                window.location.search = "";
                Swal.fire("Success", "Password Changed Successfully", "success")
            }else{
                setOpen(false);
                Swal.fire("Error", data.error, "error").then(function(){
                    setOpen(true);
                })
            }
        }
    }

    return <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
    >
        <DialogTitle id="responsive-dialog-title">
            <div>{"Change Password"}</div>
            <div>
                <Fab size="small" style={{ background: "white" }} aria-label="add">
                    <CloseIcon onClick={() => setOpen(false)} />
                </Fab>
            </div>
        </DialogTitle>
        <DialogContent>
            <Grid container>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(event) => setOldPassword(event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        edge="end"
                                    >
                                        {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        <div style={error}>{oldPasswordError}</div>
                    </FormControl>
                </Grid>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                    >
                                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        <div style={error}>{newPasswordError}</div>
                    </FormControl>
                </Grid>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Confirm New Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                        <div style={error}>{confirmPasswordError}</div>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Change</Button>
                </Grid>
            </Grid>

        </DialogContent>
    </Dialog>
}