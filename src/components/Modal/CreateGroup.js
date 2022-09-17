import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { postRequestWithFetch } from '../../service';
import { notifySuccess } from '../notify/Notify'
import GroupAddIcon from '@material-ui/icons/GroupAdd';


export default function CreateGroup() {

    const today = new Date();
    const dd = String(today.getDate() - 1).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const endMM = String(today.getMonth() + 2).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const [open, setOpen] = React.useState(false);
    const [name, setGroupName] = React.useState("");
    const [value, setGroupValue] = React.useState("");
    const [amount, setGroupAmount] = React.useState("");
    const [startDate, setStartDate] = React.useState(yyyy + '-' + mm + '-' + dd);
    const [endDate, setEndDate] = React.useState(yyyy + '-' + endMM + '-' + dd);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleChangeDate = (date) => {
        let yyyy = parseInt(date.split('-')[0])
        let endMM = parseInt(date.split('-')[1]) + 1
        let endDD = parseInt(date.split('-')[2])
        if (endMM >= 13) {
            endMM = '0' + 1
            yyyy = yyyy + 1
        }
        setStartDate(date);
        setEndDate(yyyy + '-' + endMM + '-' + endDD);
    }

    const handleCreate = async () => {
        const res = await postRequestWithFetch(`group/add`, {
            name: name,
            value: value,
            virtualAmount: amount,
            startDate: startDate,
            endDate: endDate
        })
        res.success === true && notifySuccess({ Message: "Group Added Successfully", ProgressBarHide: true })
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
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Create Group
            </Button> */}
            <Tooltip title="Create New Group">
                <IconButton onClick={handleClickOpen}>
                    <GroupAddIcon />
                </IconButton>
            </Tooltip>
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
                        <TextField onChange={(e) => setGroupAmount(e.target.value)} type='number' style={{ width: "30em", }} id="outlined-basic" label="Virtual Amount" variant="outlined" />
                        <TextField value={startDate} onChange={(e) => handleChangeDate(e.target.value)} type='date' style={{ width: "30em", margin: '8px' }} id="outlined-basic" label="" variant="outlined" />
                        <TextField value={endDate} onChange={(e) => setEndDate(e.target.value)} type='date' style={{ width: "30em" }} id="outlined-basic" label="" variant="outlined" />
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
