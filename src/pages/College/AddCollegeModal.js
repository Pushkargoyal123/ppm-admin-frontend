import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    TextField
} from "@material-ui/core"
import { useState } from "react";
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Swal from "sweetalert2";

import { postRequestWithFetch } from "../../service";
import { notifyError, notifySuccess } from "../../components/notify/Notify";


export default function AddCollegeModal(props) {

    const [name, setName] = useState("");
    const [shortName, setShortName] = useState("");
    const [email, setEmail] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async () => {
        const body = {
            name: name,
            shortName: shortName,
            email: email,
            contactPerson: contactPerson,
            contactNumber: contactNumber,
            dateOfRegistration: new Date().toLocaleString()
        }
        const data = await postRequestWithFetch("college/addCollege", body);
        if (data.success) {
            props.fetchAllColleges();
            props.setOpenAddModal(false);
            Swal.fire({
                icon: "success",
                title: "College Added Successfully",
            })
            notifySuccess({ Message: "College Added Successfully .", ProgressBarHide: true })
        }
        else if (data.error.details) {
            notifyError({ Message: data.error.details[0].message, ProgressBarHide: true })
            props.setOpenAddModal(false);
            Swal.fire({
                icon: "error",
                title: data.error.details[0].message
            }).then(function () {
                props.setOpenAddModal(true);
            })
        } else {
            notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
            props.setOpenAddModal(false);
            Swal.fire({
                icon: "error",
                title: data.error.errors[0].message
            }).then(function () {
                props.setOpenAddModal(true);
            })
        }
    }

    return <Dialog
        fullScreen={fullScreen}
        open={props.openAddModal}
        onClose={() => props.setOpenAddModal(false)}
        aria-labelledby="responsive-dialog-title"
    >
        <DialogTitle>
            <div>{"Add a new college"}</div>
            <div>
                <Fab size="small" color="default" aria-label="add">
                    <CloseIcon onClick={() => props.setOpenAddModal(false)} />
                </Fab>
            </div>
        </DialogTitle>
        <DialogContent>
            <Grid container>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <TextField
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        id="outlined-basic"
                        label="College Full Name"
                        variant="outlined"
                    />
                </Grid>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <TextField
                        value={shortName}
                        onChange={(event) => setShortName(event.target.value)}
                        id="outlined-basic"
                        label="College Short Name"
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Grid container>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <TextField
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        id="outlined-basic"
                        label="College Email"
                        variant="outlined"
                    />
                </Grid>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <TextField
                        value={contactPerson}
                        onChange={(event) => setContactPerson(event.target.value)}
                        id="outlined-basic"
                        label="Contact Person FullName"
                        variant="outlined"
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <TextField
                        value={contactNumber}
                        onChange={(event) => setContactNumber(event.target.value)}
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        type="number"
                        label="Contact Number"
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Grid container>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <Button variant="contained" onClick={handleSubmit} color="primary" fullWidth>Add</Button>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog>
}