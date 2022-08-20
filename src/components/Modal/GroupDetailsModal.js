import React, { useEffect, useState } from "react";
import { Dialog, IconButton, Typography, Toolbar, AppBar, Slide, Button, Select, Chip, MenuItem, Input } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MUIDataTable from "mui-datatables";

import useStyles from '../../pages/dashboard/styles';
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

    const [userGroupsList, setUserGroupsList] = useState([]);

    useEffect(function () {

        const fetchAllUserGroups = async () => {
            const data = await getRequestWithFetch("user/getUserGroupsList?UserId=" + props.userId);
            if (data.success) {
                const finalData = data.data.map(function (item, index) {
                    item.SNO = index + 1;
                    item["Virtual Amount"] = "₹" + item.virtualAmount;
                    item["Net Amount"] = "₹" + item.netAmount;
                    item["Group Name"] = item.ppm_group.name + "-" + item.ppm_group.value;
                    item["Group Virtual Amount"] = "₹" + item.ppm_group.virtualAmount;
                    item["Group Start Date"] = item.ppm_group.startDate;
                    item["Group End Date"] = item.ppm_group.endDate;
                    return item
                })
                setUserGroupsList(finalData);
            }
        }

        fetchAllUserGroups();
    }, [props.userId])

    const classes = useStyles();

    const handleUpdateStatus = async (value, tableMeta) => {
        const selectedRow = userGroupsList.filter(function (item, index) {
            return tableMeta[0] === index + 1
        })[0];

        const body = {
            status: value,
            id: selectedRow.id
        }
        const data = await postRequestWithFetch("user/updateUserGroupStatus", body);
        if (data.success) {
            const data = await getRequestWithFetch("user/getUserGroupsList?UserId=" + props.userId);
            if (data.success) {
                const finalData = data.data.map(function (item, index) {
                    item.SNO = index + 1;
                    item["Virtual Amount"] = "₹" + item.virtualAmount;
                    item["Net Amount"] = "₹" + item.netAmount;
                    item["Group Name"] = item.ppm_group.name + "-" + item.ppm_group.value;
                    item["Group Virtual Amount"] = "₹" + item.ppm_group.virtualAmount;
                    item["Group Start Date"] = item.ppm_group.startDate;
                    item["Group End Date"] = item.ppm_group.endDate;
                    return item
                })
                setUserGroupsList(finalData);
            }
        }
    }

    const columns = [
        "SNO",
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
                        onChange={(event) => { handleUpdateStatus(event.target.value, tableMeta.rowData) }}
                        input={<Input />}
                        renderValue={(selected) => <Chip label={selected} classes={{ root: classes[states[value.toLowerCase()]] }} />}
                    >
                        {["active", "inactive", "deleted"].map(
                            (changeStatus) => (
                                <MenuItem key={changeStatus} value={changeStatus}>
                                    <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }} />
                                </MenuItem>
                            )
                        )}
                    </Select>
                )
            }
        },
        "Group Name",
        "Group Virtual Amount",
        "Group Start Date",
        "Group End Date"
    ]

    const handleOpenDialog = () => {
        props.setOpenDialog(true);
    }

    return <Dialog fullScreen open={props.open} onClose={() => props.setOpen(false)} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => props.setOpen(false)} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {props.userName} Groups
                </Typography>
                <Typography variant="h6">
                    <Button variant="contained" color="secondary" style={{ margin: "0px 20px" }} onClick={() => handleOpenDialog()}>View Portfilio</Button>
                </Typography>
            </Toolbar>
        </AppBar>

        <div>
            <MUIDataTable
                title="All Groups"
                columns={columns}
                data={userGroupsList}
            />
        </div>

    </Dialog>
}