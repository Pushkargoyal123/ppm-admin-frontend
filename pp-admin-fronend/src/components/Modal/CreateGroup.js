import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { TextField } from "@material-ui/core";
import { postRequestWithFetch } from "../../service";
import { notifyError, notifySuccess } from "../notify/Notify";
// import DetailsIcon from '@material-ui/icons/Details';

export default function CreateGroup(props) {
  const today = new Date();
  const dd = String(today.getDate() - 1).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const endMM = String(today.getMonth() + 2).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  const [name, setGroupName] = React.useState("");
  const [value, setGroupValue] = React.useState("");
  const [amount, setGroupAmount] = React.useState("");
  const [startDate, setStartDate] = React.useState(yyyy + "-" + mm + "-" + dd);
  const [endDate, setEndDate] = React.useState(yyyy + "-" + endMM + "-" + dd);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  React.useEffect(function () {
    if (props.groupId) handleFetchGroupList();
    // eslint-disable-next-line
  }, []);

  const handleChangeDate = (date) => {
    let yyyy = parseInt(date.split("-")[0]);
    let endMM = parseInt(date.split("-")[1]) + 1;
    let endDD = parseInt(date.split("-")[2]);
    if (endMM >= 13) {
      endMM = "0" + 1;
      yyyy = yyyy + 1;
    }
    setStartDate(date);
    setEndDate(yyyy + "-" + endMM + "-" + endDD);
  };

  const handleCreate = async () => {
    const res = await postRequestWithFetch(`group/add`, {
      name: name,
      value: value,
      virtualAmount: amount,
      startDate: startDate,
      endDate: endDate,
    });
    res.success === true &&
      notifySuccess({
        Message: "Group Added Successfully",
        ProgressBarHide: true,
      });
    props.handleClose();
  };

  const handleFetchGroupList = async () => {
    const res = await postRequestWithFetch(`group/list`, {
      groupId: props.groupId,
    });
    if (res.success === true) {
      setGroupName(res.data[0].name);
      setGroupValue(res.data[0].value);
      setGroupAmount(res.data[0].virtualAmount);
      setStartDate(res.data[0].startDate);
      setEndDate(res.data[0].endDate);
      props.handleClose();
    } else {
      notifyError({ Message: "Oops! Server Error", ProgressBarHide: true });
    }
  };

  const handleUpdate = async () => {
    const res = await postRequestWithFetch("group/update", {
      groupId: `${props.groupId}`,
      name: name,
      value: value,
      virtualAmount: amount,
      startDate: startDate,
      endDate: endDate,
    });
    if (res.success === true) {
      notifySuccess({
        Message: "Group Updated Successfully",
        ProgressBarHide: true,
      });
      props.GroupList();
      props.setOpen(false);
    } else {
      notifyError({
        Message: "Oops! Some error Occures",
        ProgressBarHide: true,
      });
    }
  };

  return (
    <div>
      {/* <Tooltip title="Group Details">
                <IconButton onClick={handleClickOpen}>
                    <DetailsIcon />
                </IconButton>
            </Tooltip> */}
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {!props.groupId ? "Create New Group" : "Group Details"}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "2rem 7rem",
              alignItems: "center",
            }}
          >
            {!props.groupId ? (
              <>
                <TextField
                  value={name}
                  onChange={(e) => setGroupName(e.target.value)}
                  type="text"
                  style={{ width: "30em" }}
                  id="outlined-basic"
                  label="Group Name"
                  variant="outlined"
                />
                <TextField
                  value={value}
                  onChange={(e) => setGroupValue(e.target.value)}
                  type="text"
                  style={{ width: "30em", margin: "8px" }}
                  id="outlined-basic"
                  label="Group Value"
                  variant="outlined"
                />
              </>
            ) : (
              <>
                <TextField
                  value={name}
                  onChange={(e) => setGroupName(e.target.value)}
                  type="text"
                  style={{ width: "30em" }}
                  id="outlined-basic"
                  label="Group Name"
                  variant="outlined"
                  disabled
                />
                ,
                <TextField
                  value={value}
                  onChange={(e) => setGroupValue(e.target.value)}
                  type="text"
                  style={{ width: "30em", margin: "8px" }}
                  id="outlined-basic"
                  label="Group Value"
                  variant="outlined"
                  disabled
                />
              </>
            )}
            <TextField
              value={amount}
              onChange={(e) => setGroupAmount(e.target.value)}
              type="number"
              style={{ width: "30em" }}
              id="outlined-basic"
              label="Virtual Amount"
              variant="outlined"
            />
            <TextField
              value={startDate}
              onChange={(e) => handleChangeDate(e.target.value)}
              type="date"
              style={{ width: "30em", margin: "8px" }}
              id="outlined-basic"
              label=""
              variant="outlined"
            />
            <TextField
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              style={{ width: "30em" }}
              id="outlined-basic"
              label=""
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => props.setOpen(false)}>
            Cancel
          </Button>

          {!props.groupId ? (
            <Button onClick={() => handleCreate()} autoFocus>
              Create
            </Button>
          ) : (
            <Button onClick={() => handleUpdate()} autoFocus>
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
