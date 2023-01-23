import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { getRequestWithAxios } from "../../service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const options = {
  filterType: "none",
  selectableRows: "none",
  sort: false,
};

export default function SubscriptionUsers(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = async () => {
    setOpen(true);
    const data = await getRequestWithAxios(``);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {props.monthId} Month
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {props.monthId} Month plan Subscribers
            </Typography>
          </Toolbar>
        </AppBar>
        {/* <MUIDataTable
          title={`Users List`}
          data={}
          columns={}
          options={options}
        /> */}
      </Dialog>
    </div>
  );
}
