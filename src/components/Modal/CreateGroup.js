import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TextField } from '@material-ui/core';
import { postRequestWithFetch } from '../../service';

export default function CreateGroup() {
    const [open, setOpen] = React.useState(false);
    const [name, setGroupName] = React.useState("");
    const [value, setGroupValue] = React.useState("");
    const [amount, setGroupAmount] = React.useState("");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleCreate = async () => {
        await postRequestWithFetch(`group/add`, {
            name: name,
            value: value,
            virtualAmount: amount
        })
        handleClose();
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create New Group
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Create New Group"}
                </DialogTitle>
                <DialogContent>
                    <div style={{ display: "flex", flexDirection: "column", margin: "2rem 7rem", alignItems: "center" }} >
                        <TextField onChange={(e) => setGroupName(e.target.value)} type='text' style={{ width: "30em" }} id="outlined-basic" label="Group Name" variant="outlined" />
                        <TextField onChange={(e) => setGroupValue(e.target.value)} type='text' style={{ width: "30em", margin: "8px" }} id="outlined-basic" label="Group Value" variant="outlined" />
                        <TextField onChange={(e) => setGroupAmount(e.target.value)} type='number' style={{ width: "30em" }} id="outlined-basic" label="Virtual Amount" variant="outlined" />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleCreate()} autoFocus>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
