import React, { useEffect, useState } from 'react';
import {
    Dialog,
    AppBar,
    Typography,
    IconButton,
    Toolbar,
    Slide,
    Chip,
    MenuItem,
    Select,
    Input
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MUIDataTable from 'mui-datatables';

import useStyles from '../dashboard/styles';
import { notifySuccess, notifyError } from '../../components/notify/Notify';
import { postRequestWithFetch } from '../../service';
import UserDetails from '../../components/Modal/UserDetails';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const states = {
    active: "success",
    inactive: "warning",
    deleted: "default",
};

export default function CollegeUsersListModal(props) {

    const classes = useStyles();

    const [rows, setRows] = useState([]);
    const [collegeName, setCollegeName] = useState(props.row.shortName);
    const [collegeId, setCollegeId] = useState(props.row.id);

    useEffect(function () {
        setCollegeName(props.row.shortName);
        setCollegeId(props.row.id);
        if (props.row.shortName)
            userData();
        // eslint-disable-next-line
    }, [props.row])

    const userData = async () => {
        try {
            const body = { name: props.row.shortName }
            const data = await postRequestWithFetch("college/fetchUsers", body);
            if (data.success) {
                setRows(data.data)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleUpdate = async (userId, event) => {
        const res = await postRequestWithFetch(`user/update/${userId}`, {
            status: event.target.value
        })
        if (res.success) {
            userData();
            notifySuccess({ Message: "Status Updated Successfully.", ProgressBarHide: true })
        } else {
            notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
        }
    }

    const users = rows.map(function (item, index) {
        return [
            index + 1,
            item.userName,
            item.email,
            item.phone,
            item.dateOfRegistration,
            item.gender,
            item.ppm_userGroups[0].ppm_group.name + "-" + item.ppm_userGroups[0].ppm_group.value,
            <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                value={item.status}
                onChange={(event) => { handleUpdate(item.id, event) }}
                input={<Input />}
                renderValue={(selected) => <Chip label={selected} classes={{ root: classes[states[item.status.toLowerCase()]] }} />}
            >
                {["active", "inactive", "deleted"].map(
                    (changeStatus) => (
                        <MenuItem key={changeStatus} value={changeStatus}>
                            <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }} />
                        </MenuItem>
                    )
                )}
            </Select>,
            <UserDetails Userdata={{ id: item.id, userName: item.userName, email: item.email, phone: item.phone, dob: item.dob, dateOfRegistration: item.dateOfRegistration, gender: item.gender, status: item.status }} />
        ]
    })

    const columns = [
        "SNO",
        "Name",
        "Email",
        "Contact",
        "Date Of Registration",
        "Gender",
        "Latest Group",
        "Status",
        "Action"
    ]

    return <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {collegeName} Users List
                </Typography>
                <Typography variant="h6">
                </Typography>
            </Toolbar>
        </AppBar>

        <MUIDataTable
            data={users}
            columns={columns}
            options={{
                filterType: "none",
                selectableRows: 'none',
            }}
        />
    </Dialog>
}