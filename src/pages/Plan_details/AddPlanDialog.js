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

export default function AddPlanDialog(props) {

    const [planName, setPlanName] = React.useState("");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleCreate = async () => {
        await postRequestWithFetch(`plans/add`, {
            planName: planName,
        })
        handleClose();
    }

    const handleClose = () => {
        props.setOpen(false);
    };

    console.log(planName);

    return <div className='hello'>
        <Dialog
            fullScreen={fullScreen}
            open={props.open}
            aria-labelledby="responsive-dialog-title"
            // disableEnforceFocus={true}
            enforceFocus={false}
        >
            <DialogTitle id="responsive-dialog-title">
                {"Create New Plan"}
            </DialogTitle>
            <DialogContent>
                <div style={{ display: "flex", flexDirection: "column", margin: "2rem 7rem", alignItems: "center" }} >
                    <TextField
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        type='text'
                        style={{ width: "30em" }}
                        id="outlined-basic"
                        label="Plan Name"
                        variant="outlined"
                    />
                    {/* <TextField onChange={(e) => setGroupValue(e.target.value)} type='text' style={{ width: "30em", margin: "8px" }} id="outlined-basic" label="Group Value" variant="outlined" />
                <TextField onChange={(e) => setGroupAmount(e.target.value)} type='number' style={{ width: "30em" }} id="outlined-basic" label="Virtual Amount" variant="outlined" /> */}
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
}