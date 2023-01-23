import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { TextField } from "@material-ui/core";
import { postRequestWithFetch } from "../../service";
import { notifyError, notifySuccess } from "../../components/notify/Notify";

export default function SetGroupAmount(props) {
  const today = new Date();
  const dd = String(today.getDate() - 1).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const endMM = String(today.getMonth() + 2).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [virtualAmount, setVirtualAmount] = React.useState(0);

  const [sDate, setStartDate] = React.useState(yyyy + "-" + mm + "-" + dd);
  const [eDate, setEndDate] = React.useState(yyyy + "-" + endMM + "-" + dd);

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

  const handleUpdate = async () => {
    const res = await postRequestWithFetch(`group/update`, {
      groupId: props.group.groupId + "",
      virtualAmount: virtualAmount,
      sDate: sDate,
      eDate: eDate,
    });
    if (res.data !== "") {
      props.handleChangeGroup(props.group.registerType, props.group.id);
      props.setOpen(false);
    }
    if (res.success === true) {
      notifySuccess({ Message: "Group Registered Successfully" });
    } else {
      notifyError({ Message: " Oops! Some Error Occures" });
    }
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {`Set Virtual Amount for Group ${props.group.registerType}-${props.group.groupValue}`}
        </DialogTitle>
        <DialogContent style={{ height: "19rem", width: "37rem" }}>
          <DialogContentText>
            <form style={{ margin: "3rem", width: "20rem" }}>
              <TextField
                type="number"
                minLength="0"
                value={virtualAmount}
                onChange={(e) => setVirtualAmount(e.target.value)}
                id="outlined-basic"
                style={{ width: "30em", margin: "8px" }}
                label="Virtual Amount"
                variant="outlined"
              />
              <TextField
                value={sDate}
                onChange={(e) => handleChangeDate(e.target.value)}
                type="date"
                style={{ width: "30em", margin: "8px" }}
                id="outlined-basic"
                label=""
                variant="outlined"
              />
              <TextField
                value={eDate}
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
                style={{ width: "30em" }}
                id="outlined-basic"
                label=""
                variant="outlined"
              />
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              props.setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleUpdate();
            }}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
