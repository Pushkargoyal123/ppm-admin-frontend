import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { postRequestWithFetch } from "../../service";
import MUIDataTable from "mui-datatables";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const options = {
  filterType: "none",
  selectableRows: "none",
  sort: false,
};

const column = ["S.No", "Name", "Email", "Gender", "Month", "Plan Name", "Plan End Date(MM/DD/YYYY)", "Group", "Status"]

export default function SubscriptionUsers(props) {
  let ID = props.monthId ? { MonthId: props.monthId } : { PlanId: props.PlanId }
  console.log(ID);
  const [open, setOpen] = React.useState(false);
  const [UserList, setUserList] = React.useState([]);

  const handleClickOpen = async () => {
    setOpen(true);
    const body = ID;
    const { success, data } = await postRequestWithFetch("plans/SubscribedUserList", body);
    console.log(data);
    const users = success && data.map((item, index) => {
      item['S.No'] = index + 1;
      item['UserId'] = item.User.id;
      item['Name'] = item.User.userName;
      item['Email'] = item.User.email;
      item['Gender'] = item.User.gender;
      item['Month'] = item.ppm_subscription_month.monthValue + " Month";
      item['Plan Name'] = item.ppm_subscription_plan.planName;
      item['Plan End Date(MM/DD/YYYY)'] = item.endDate.split(",")[0];
      item['Group'] = item.ppm_userGroup.ppm_group.name + " " + item.ppm_userGroup.ppm_group.value;
      item['Status'] = <font color="green"> {item.status}</font>;
      return item;
    })
    setUserList(users)
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {props.monthId ? (props.monthId + " Month") : (props.PlanName)}
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
        <MUIDataTable
          title={`Users List`}
          data={UserList}
          columns={column}
          options={options}
        />
      </Dialog>
    </div>
  );
}
