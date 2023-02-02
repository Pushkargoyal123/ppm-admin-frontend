import React, { useEffect } from "react";
import {
  Dialog,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Slide,
  Button,
  Select,
  Chip,
  MenuItem,
  Input,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MUIDataTable from "mui-datatables";

import useStyles from "../dashboard/styles";
import { getRequestWithFetch, postRequestWithFetch } from "../../service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const states = {
  active: "success",
  inactive: "warning",
  deleted: "default",
};

export default function GroupDetailsModal(props) {
  useEffect(function () {
    fetchAllUserGroups();
    // eslint-disable-next-line
  }, []);

  const classes = useStyles();

  const fetchAllUserGroups = async () => {
    let data;
    if (props.eventId) {
      const body = { UserId: props.userId };
      data = await postRequestWithFetch("dreamNifty/user/getUserEventsList", body,);
      if (data.success) {
        const finalData = data.data.map(function (item, index) {
          item.SNO = index + 1;
          item["Virtual Amount"] = "₹" + item.virtualAmount;
          item["Portfolio"] = (
            <Button variant="outlined" onClick={() => handleOpenDialog(item)}>
              View Portfolio
            </Button>
          );
          item["Net Amount"] = "₹" + item.netAmount;
          item["Event Name"] = item.ppm_dream_nifty.title;
          item["Event Virtual Amount"] =
            "₹" + item.ppm_dream_nifty.virtualAmount;
          item["Event Registered Date"] = item.createdAt.split("T")[0];
          item["Event Start Date"] = item.ppm_dream_nifty.startDate;
          item["Event End Date"] = item.ppm_dream_nifty.endDate;
          return item;
        });
        props.setUserGroupsList(finalData);
      }
    } else {
      data = await getRequestWithFetch(
        "user/getUserGroupsList?UserId=" + props.userId,
      );
      if (data.success) {
        const finalData = data.data.map(function (item, index) {
          item.SNO = index + 1;
          item["Virtual Amount"] = "₹" + item.virtualAmount;
          item["Portfolio"] = (
            <Button variant="outlined" onClick={() => handleOpenDialog(item)}>
              View Portfolio
            </Button>
          );
          item["Net Amount"] = "₹" + item.netAmount;
          item["Group Name"] = item.ppm_group.name + "-" + item.ppm_group.value;
          item["Group Virtual Amount"] = "₹" + item.ppm_group.virtualAmount;
          item["Group Assign Date"] = item.createdAt.split("T")[0];
          item["Group Start Date"] = item.ppm_group.startDate;
          item["Group End Date"] = item.ppm_group.endDate;
          return item;
        });
        props.setUserGroupsList(finalData);
      }
    }
  };

  const handleUpdateStatus = async (value, tableMeta) => {
    const selectedRow = props.userGroupsList.filter(function (item, index) {
      return tableMeta[0] === index + 1;
    })[0];

    let data;
    if (props.eventId) {
      const body = {
        status: value,
        id: selectedRow.id,
      };
      data = await postRequestWithFetch(
        "dreamNifty/user/updateUserEventStatus",
        body,
      );
    } else {
      const body = {
        status: value,
        id: selectedRow.id,
      };
      data = await postRequestWithFetch("user/updateUserGroupStatus", body);
    }
    if (data.success) {
      fetchAllUserGroups();
    }
  };

  const columns = [
    "SNO",
    "Group Name",
    "Portfolio",
    "Virtual Amount",
    "Net Amount",
    {
      name: "status",
      label: "status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            value={value}
            onChange={(event) => {
              handleUpdateStatus(event.target.value, tableMeta.rowData);
            }}
            input={<Input />}
            renderValue={(selected) => (
              <Chip
                label={selected}
                classes={{ root: classes[states[value.toLowerCase()]] }}
              />
            )}
          >
            {["active", "inactive", "deleted"].map((changeStatus) => (
              <MenuItem key={changeStatus} value={changeStatus}>
                <Chip
                  label={changeStatus}
                  classes={{
                    root: classes[states[changeStatus.toLowerCase()]],
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        ),
      },
    },
    "Group Virtual Amount",
    "Group Assign Date",
    "Group Start Date",
    "Group End Date",
  ];

  const eventColumns = [
    "SNO",
    "Event Name",
    "Portfolio",
    "Virtual Amount",
    "Net Amount",
    {
      name: "status",
      label: "status",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            value={value}
            onChange={(event) => {
              handleUpdateStatus(event.target.value, tableMeta.rowData);
            }}
            input={<Input />}
            renderValue={(selected) => (
              <Chip
                label={selected}
                classes={{ root: classes[states[value.toLowerCase()]] }}
              />
            )}
          >
            {["active", "inactive", "deleted"].map((changeStatus) => (
              <MenuItem key={changeStatus} value={changeStatus}>
                <Chip
                  label={changeStatus}
                  classes={{
                    root: classes[states[changeStatus.toLowerCase()]],
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        ),
      },
    },
    "Event Virtual Amount",
    "Event Registered Date",
    "Event Start Date",
    "Event End Date",
  ];

  const handleOpenDialog = (item) => {
    if (props.eventId) {
      props.setClickedUserEvent(item.ppm_dream_nifty.id);
    } else {
      props.setClickedUserGroup(item.ppm_group.id);
    }
    props.setOpenDialog(true);
  };

  return (
    <Dialog
      fullScreen
      open={props.open}
      style={{ marginTop: 60 }}
      onClose={() => props.setOpen(false)}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => props.setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {props.userName} {props.eventId ? "Event" : "Group"}
          </Typography>
        </Toolbar>
      </AppBar>

      <div>
        <MUIDataTable
          title={props.eventId ? "All Events" : "All Groups"}
          columns={props.eventId ? eventColumns : columns}
          data={props.userGroupsList}
        />
      </div>
    </Dialog>
  );
}
