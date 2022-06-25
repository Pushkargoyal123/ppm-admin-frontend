import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import { postRequestWithFetch } from '../../service';
import { IconButton, Tooltip } from '@material-ui/core';



export default function FormDialog(user) {
    const user1 = user.user;
    const [open, setOpen] = React.useState(false);
    const [id] = React.useState(user1.id);
    const [name, setName] = React.useState(user1.userName);
    const [email, setEmail] = React.useState(user1.email);
    const [phone, setPhone] = React.useState(user1.phone);
    const [dob, setDob] = React.useState(user1.dob);
    const [gender, setGender] = React.useState(user1.gender);
    const [status, setStatus] = React.useState(user1.status);

    // console.log("id ",id);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = async (userId) => {
        // console.log("userId ",userId);
        // console.log(name);
        await postRequestWithFetch(`user/update/${userId}`, {
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender,
            status: status,
        })
        handleClose()
    }

    return (
        <div>

            <Tooltip title="Edit User">
                <IconButton>
                    <EditIcon onClick={handleClickOpen} />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">User : {name} </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Contact"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="number"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Date Of Birth"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        type="text"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        type="text"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleUpdate(id)} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
