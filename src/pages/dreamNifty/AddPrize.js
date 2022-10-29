// external dependecies
import { Button, Dialog, DialogContent, DialogTitle, Fab, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';

// internal dependecies
import { postRequestWithFetch } from '../../service';
import { notifyError, notifySuccess } from '../../components/notify/Notify';

// showing error message of red colours
const errorStyle = {
    color: "red",
    fontSize:14
}


// dialog for adding a record of prize in database
export default function AddPrize(props) {

    // states for storing data
    const [member, setMember] = useState(""); /// state for add number of members in database
    const [percentage, setPercentage] = useState(""); // state for add percentage in database
    const [priority, setPriority] = useState(""); // state for add priority in database

    // states for showing errors
    const [memberError, setMemberError] = useState("");
    const [percentageError, setPercentageError] = useState("");
    const [priorityError, setPriorityError] = useState("");

    const handleSubmit = async () => {
        let err = false; // error variable to manage all the fields should be provided

        if (member.trim() === "") {
            setMemberError("Number of members should be privided");
            err = true;
        } else if (Number(member) === 0) {
            setMemberError("Number of members can't be 0");
            err = true;
        }
        else {
            setMemberError("");
        }

        if (percentage.trim() === "") {
            setPercentageError("Percentage should be privided");
            err = true;
        } else if (Number(percentage) === 0) {
            setPercentageError("Percentage can't be 0");
            err = true;
        }
        else {
            setPercentageError("");
        }

        if (priority.trim() === "") {
            setPriorityError("Priority should be privided");
            err = true;
        } else if (Number(priority) === 0) {
            setPriorityError("Priority can't be 0");
            err = true;
        }
        else {
            setPriorityError("");
        }

        if (!err) {
            const body = {
                priority,
                participant: member,
                percentDistribution: percentage,
                ppmDreamNiftyId: props.eventId
            }
            const data = await postRequestWithFetch("dreamNifty/prize/add", body);
            if(data.success){
                notifySuccess({ Message: "Record inserted successfully", ProgressBarHide: true });
                props.fetchPrizeDistribution();
                props.setOpen(false);
                setMember("");
                setPriority("");
                setPercentage("");
            }else{
                notifyError({ Message: "OOps some error occured", ProgressBarHide: true });
            }
        }
    }

    return <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="responsive-dialog-title"
    >
        <DialogTitle>
            <div>Add New</div>
            <div>
                <Fab size="small" style={{ background: "white" }} aria-label="add">
                    <CloseIcon onClick={() => props.setOpen(false)} />
                </Fab>
            </div>
        </DialogTitle>
        <DialogContent>
            <div style={{ margin: "10px 0px", width: 340 }}>
                <div style={errorStyle}>{memberError}</div>
                <TextField
                    fullWidth
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                    type='number'
                    label="Members"
                    variant="outlined"
                />
            </div>
            <div style={{margin: "10px 0px", width: 340}}>
                <div style={errorStyle}>{percentageError}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                    fullWidth
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    type='number'
                    label="Percentage Distribution"
                    variant="outlined"
                />
                <span style={{ fontSize: 20, fontWeight: 600 }}> % </span>
            </div>
            </div>
            <div style={{ margin: "10px 0px", width: 340 }}>
                <div style={errorStyle}>{priorityError}</div>
                <TextField
                    fullWidth
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    type='number'
                    label="Priority"
                    variant="outlined"
                />
            </div>
            <div>
                <Button fullWidth color='primary' variant='contained' onClick={handleSubmit}>Submit</Button>
            </div>
        </DialogContent>
    </Dialog>
}