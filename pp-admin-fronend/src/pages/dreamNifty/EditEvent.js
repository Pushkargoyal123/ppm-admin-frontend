import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    TextField
} from "@material-ui/core"
import { useEffect, useState } from "react";
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Swal from "sweetalert2";
import ReactQuill from "react-quill";

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

import { postRequestWithFetch } from "../../service";

const errorStyle = {
    color: "red"
}

export default function EditEvent(props) {

    const today = new Date();
    const dd = String(today.getDate() - 1).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const endMM = String(today.getMonth() + 2).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    // states for storing data 
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState(yyyy + '-' + mm + '-' + dd);
    const [endDate, setEndDate] = useState(yyyy + '-' + endMM + '-' + dd);
    const [maxParticipant, setMaxParticipant] = useState("");
    const [totalRewardPrice, setTotalRewardPrice] = useState("");
    const [entryFee, setEntryFee] = useState("");
    const [virtualAmount, setVirtualAmount] = useState(100000);

    // states for showing errors
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [startDateError, setStartDateError] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [maxParticipantError, setMaxParticipantError] = useState("");
    const [totalRewardPriceError, setTotalRewardPriceError] = useState("");
    const [entryFeeError, setEntryFeeError] = useState("");
    const [virtualAmountError, setVirtualAmountError] = useState("");

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(function () {
        handleClickOpen()
        // eslint-disable-next-line
    }, [props.eventId, props.open]);

    const handleClickOpen = async () => {
        const data = await postRequestWithFetch("dreamNifty/eventList", { eventId: props.eventId });
        if (data.success) {
            setTitle(data.data[0].title)
            setDescription(data.data[0].description)
            setStartDate(data.data[0].startDate)
            setEndDate(data.data[0].endDate)
            setMaxParticipant(data.data[0].maxParticipant)
            setTotalRewardPrice(data.data[0].totalRewardPrice)
            setEntryFee(data.data[0].entryFee)
            setVirtualAmount(data.data[0].virtualAmount)
        }
    }

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

    const handleSubmit = async () => {
        let err = false;
        const id = props.eventId;
        if (title.trim() === "") {
            setTitleError("Title should be provided");
            err = true;
        } else {
            setTitleError("");
        }

        if (description.trim() === "") {
            setDescriptionError("Description should be provided");
            err = true;
        } else {
            setDescriptionError("");
        }

        if (!startDate || startDate.trim() === "") {
            setStartDateError("start Date should be provided");
            err = true;
        } else {
            setStartDateError("");
        }

        if (!endDate || endDate.trim() === "") {
            setEndDateError("end Date should be provided");
            err = true;
        } else {
            setEndDateError("");
        }

        if (maxParticipant === "") {
            setMaxParticipantError("Participant should be provided");
            err = true;
        } else {
            setMaxParticipantError("");
        }

        if (totalRewardPrice === "") {
            setTotalRewardPriceError("Total Reward should be provided");
            err = true;
        } else {
            setTotalRewardPriceError("");
        }

        if (entryFee === "") {
            setEntryFeeError("Entry Fee should be provided");
            err = true;
        } else {
            setEntryFeeError("");
        }

        if (virtualAmount === "") {
            setVirtualAmountError("Virtual amount should be provided");
            err = true;
        } else {
            setVirtualAmountError("");
        }


        if (!err) {
            const body = {
                id,
                title,
                description,
                startDate,
                endDate,
                maxParticipant,
                totalRewardPrice,
                entryFee,
                virtualAmount,
            }
            const data = await postRequestWithFetch("dreamNifty/dreamNiftyEvent/update", body);
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Event Updated",
                })
                props.fetchDreamNifty();
                props.setOpen(false);
            }
            else if (data.error.details) {
                props.setOpen(false);
                Swal.fire({
                    icon: "error",
                    title: data.error.details[0].message
                }).then(function () {
                    props.setOpen(true);
                })
            } else {
                props.setOpen(false);
                Swal.fire({
                    icon: "error",
                    title: data.error.errors[0].message
                }).then(function () {
                    props.setOpen(true);
                })
            }
        }
    }

    return <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="responsive-dialog-title"
    >
        <DialogTitle>
            <div>Edit Event</div>
            <div>
                <Fab size="small" style={{ background: "white" }} aria-label="add">
                    <CloseIcon onClick={() => props.setOpen(false)} />
                </Fab>
            </div>
        </DialogTitle>
        <DialogContent>
            <Grid container>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <div style={errorStyle}>{titleError}</div>
                    <TextField
                        value={title}
                        style={{ width: "100%" }}
                        onChange={(event) => setTitle(event.target.value)}
                        id="outlined-basic"
                        label="Event Title"
                        variant="outlined"
                    />
                </Grid>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <div style={errorStyle}>{descriptionError}</div>
                    <ReactQuill
                        onChange={(event) => setDescription(event)}
                        value={description}
                        placeholder="Description"
                    />

                </Grid>
            </Grid>

            <Grid container>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <div style={errorStyle}>{startDateError}</div>
                    <TextField
                        style={{ width: "100%" }}
                        onChange={(e) => handleChangeDate(e.target.value)}
                        value={startDate}
                        type='date'
                        id="outlined-basic"
                        variant="outlined"
                        label="Event Start Date"
                    />
                </Grid>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <div style={errorStyle}>{endDateError}</div>
                    <TextField
                        style={{ width: "100%" }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        type='date'
                        id="outlined-basic"
                        variant="outlined"
                        label="Event End Date"
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <div style={errorStyle}>{maxParticipantError}</div>
                    <TextField
                        value={maxParticipant}
                        onChange={(event) => setMaxParticipant(event.target.value)}
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        type="number"
                        label="Maximum Participant Allowed"
                        variant="outlined"
                    />
                </Grid>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <div style={errorStyle}>{totalRewardPriceError}</div>
                    <TextField
                        value={totalRewardPrice}
                        onChange={(event) => setTotalRewardPrice(event.target.value)}
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        type="number"
                        label="Total Reward Price"
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Grid container>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <div style={errorStyle}>{entryFeeError}</div>
                    <TextField
                        value={entryFee}
                        onChange={(event) => setEntryFee(event.target.value)}
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        type="number"
                        label="Entry Fee"
                        variant="outlined"
                    />
                </Grid>
                <Grid item sm={6} style={{ padding: "10px 20px" }}>
                    <div style={errorStyle}>{virtualAmountError}</div>
                    <TextField
                        value={virtualAmount}
                        onChange={(event) => setVirtualAmount(event.target.value)}
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        type="number"
                        label="Virtual Amount"
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Grid container>
                <Grid item sm={12} style={{ padding: "10px 20px" }}>
                    <Button variant="contained" onClick={handleSubmit} color="primary" fullWidth>Update</Button>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog>
}