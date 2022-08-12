import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    TextField
} from "@material-ui/core"
import { useState, useEffect } from "react";
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Swal from "sweetalert2";

import { postRequestWithFetch } from "../../service";

export default function EditCollegeModal(props) {

    const [name, setName] = useState(props.clickedItem.name);
    const [shortName, setShortName] = useState(props.clickedItem.shortName);
    const [email, setEmail] = useState(props.clickedItem.email);
    const [contactPerson, setContactPerson] = useState(props.clickedItem.contactPerson);
    const [contactNumber, setContactNumber] = useState(props.clickedItem.contactNumber);

    useEffect(function(){
        setName(props.clickedItem.name);
        setShortName(props.clickedItem.shortName);
        setEmail(props.clickedItem.email);
        setContactPerson(props.clickedItem.contactPerson);
        setContactNumber(props.clickedItem.contactNumber);
    }, [props.clickedItem])

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async() => {
        const body = {
            name: name,
            shortName: shortName,
            email: email,
            contactPerson: contactPerson,
            contactNumber: contactNumber,
            id: props.clickedItem.id
        }
        const data = await postRequestWithFetch("college/editCollege", body);
        if(data.success){
            props.fetchAllColleges();
            props.setOpenAddModal(false);
            Swal.fire({
                icon: "success",
                title: "College Updated Successfully",
            })
        }
        else{
            Swal.fire({
                icon: "error",
                title: data.error.details[0].message
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
            <div>{"Edit College"}</div>
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
                        style={{width:"100%"}} 
                        id="outlined-basic" 
                        type="number" 
                        label="Contact Number" 
                        variant="outlined" 
                    />
                </Grid>
            </Grid>

            <Grid container>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <Button variant="contained" onClick={handleSubmit} color="primary" fullWidth>Edit</Button>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog>
}