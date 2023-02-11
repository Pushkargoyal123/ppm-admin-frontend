import React, { useEffect, useState } from 'react'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { getRequestWithFetch, postRequestWithFetch } from '../../service';
import { FormControl, Grid, InputLabel, MenuItem, Select, TableCell, TableRow, TextField, Checkbox, Button, Tooltip, Chip, Input } from '@material-ui/core';
import Table from '../dashboard/components/Table/Table'
import Widget from '../../components/Widget/Widget';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { notifyError, notifySuccess } from '../../components/notify/Notify';

import AllUserPlans from '../../components/Modal/AllUserPlans';

const states = {
    active: "success",
    inactive: "warning",
    deleted: "default",
};

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        float: 'right'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddUserToPlan() {

    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [openAllPlans, setOpenAllPlans] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [userGroupId, setUserGroupId] = useState("");
    const [userList, setUserList] = React.useState([]);
    const [rows, setRows] = useState([]);
    const [plan, setPlanList] = React.useState([]);
    const [month, setMonthList] = React.useState([]);
    const [search, setSearch] = useState("");
    const [allChecked, setAllChecked] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [listGroup, setListGroup] = useState([]);
    const [groupId, setGroupId] = useState("");
    const [planId, setPlanId] = React.useState('');
    const [monthId, setMonthId] = React.useState('');

    useEffect(() => {
        handleList();
        groupList();
        // eslint-disable-next-line
    }, [])

    const groupList = async () => {
        const data = await postRequestWithFetch("group/list", { status: "active" });
        if (data) {
            setListGroup(data.data);
        }
    }

    const handleOpen = (() => {
        setOpen(true);
    })

    const handleList = async () => {
        const res = await getRequestWithFetch("subscription/user/newList");
        const Plan = await getRequestWithFetch("subscription/plan/list")
        const Months = await getRequestWithFetch("subscription/getMonthlyPlansList")

        if (res.success) {
            const finalData = res.data.map(function (item) {
                item.isSelected = false;
                return item;
            })
            setUserList(finalData.filter(function (item) {
                return item.ReferById ? null : item;
            })
            );
            setRows(finalData);
        }
        if (Plan.success) {
            setPlanList(Plan.data);
        }
        if (Months.success) {
            setMonthList(Months.data);
        }
    };

    const handleAdd = async () => {

        const selectedMonth = month.filter(function (item) {
            return item.id === monthId ? item : null;
        })[0];

        if (selectedMonth) {
            const ppmSubscriptionMonthlyPlanChargeId = selectedMonth.ppm_subscription_monthly_plan_charges.filter(function (item) {
                return item.ppmSubscriptionPlanId === planId;
            })[0]

            if (ppmSubscriptionMonthlyPlanChargeId) {

                let endDate = new Date();
                endDate.setMonth(endDate.getMonth() + selectedMonth.monthValue)

                userList.forEach(async (item) => {

                    const userId = item.User.id

                    if (item.isSelected) {
                        const body = {
                            startDate: new Date().toLocaleString(),
                            endDate: endDate.toLocaleString(),
                            UserId: userId,
                            ppmSubscriptionPlanId: planId,
                            ppmSubscriptionMonthId: monthId,
                            ppmSubscriptionMonthlyPlanChargeId: ppmSubscriptionMonthlyPlanChargeId.id,
                            ppmUserGroupId: item.id,
                            MonthlyPlanDisplayPrice: ppmSubscriptionMonthlyPlanChargeId.displayPrice
                        }
                        const data = await postRequestWithFetch('subscription/user/add', body)
                        if (data.success === true) {
                            notifySuccess({ Message: 'User Added in Plan', ProgressBarHide: true })
                            handleList();
                        } else {
                            notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
                        }
                    }
                    return item
                })
            }
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeCheck = (value) => {
        setAllChecked(value);
        if (value) {
            setIsChecked(true)
            userList.forEach(function (item) {
                item.isSelected = true;
            })
        } else {
            setIsChecked(false);
            userList.forEach(function (item) {
                item.isSelected = false;
            })
        }
    }

    const handleChangeIndividualCheck = (rowId) => {
        let bool = false;
        let changeRows = userList.map(function (item, itemIndex) {
            if (item.id === rowId) {
                item.isSelected = !item.isSelected;
                if (item.isSelected) {
                    setIsChecked(true);
                }
            }
            if (item.isSelected) {
                bool = true;
            }
            return item;
        })
        if (!bool) {
            setIsChecked(false);
            setAllChecked(false);
        }
        setUserList(changeRows)
    }

    const handleUpdateStatus = async (row, event) => {
        const id = row.ppm_subscription_users[row.ppm_subscription_users.length - 1].id;
        const res = await postRequestWithFetch(`subscription/user/update/${id}`, { status: event.target.value })
        handleList();
        groupList();
        res.success === true ? notifySuccess({ Message: 'User Subscription Status Updated', ProgressBarHide: true }) : notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
    }

    const handleShowAllPlans = (userName, userId, userGroupId) => {
        setUserId(userId)
        setUserName(userName)
        setUserGroupId(userGroupId)
        setOpenAllPlans(true);
    }

    const column = [
        <span>
            <Checkbox checked={allChecked} value={allChecked} onChange={(event) => handleChangeCheck(event.target.checked)} />
            {"S.No"}
        </span>,
        'User Name',
        'Email',
        "Group",
        'Date Of Registraion',
        "Plan Starting Date (MM/DD/YYYY)",
        "Plan End Date (MM/DD/YYYY)",
        'Active Plan',
        'Status'
    ]

    const data = userList.map((row, index) => {
        const status = row.ppm_subscription_users.length ? row.ppm_subscription_users[row.ppm_subscription_users.length - 1].status : '-----';

        const SubsUser = row.ppm_subscription_users;
        return <TableRow key={row.id}>
            <TableCell align="left" style={{ width: "8rem" }} className={classes.borderType}>
                <Checkbox checked={row.isSelected} onChange={() => handleChangeIndividualCheck(row.id)} /> {index + 1}
            </TableCell>
            {/* <TableCell>{row.id}</TableCell> */}
            <TableCell>
                <Button variant='outlined' style={{ width: "10rem" }} onClick={() => handleShowAllPlans(row.User.userName, row.User.id, row.id)}> {row.User.userName} </Button>
            </TableCell>
            <TableCell>{row.User.email}</TableCell>
            <TableCell style={{ width: "7rem" }} align="left">{row.ppm_group.name + "-" + row.ppm_group.value}</TableCell>
            <TableCell >{row.User.dateOfRegistration}</TableCell>
            <TableCell style={{ width: "11rem" }}>{row.ppm_subscription_users.length ? row.ppm_subscription_users[row.ppm_subscription_users.length - 1].startDate.split(', ')[0] : "------"}</TableCell>
            <TableCell style={{ width: "7rem" }}>{row.ppm_subscription_users.length ? row.ppm_subscription_users[row.ppm_subscription_users.length - 1].endDate.split(', ')[0] : "------"}</TableCell>
            <TableCell>
                {
                    SubsUser.length ? SubsUser.map((rows) => {
                        return [
                            rows.ppm_subscription_month ? rows.ppm_subscription_plan.planName + '-' + rows.ppm_subscription_month.monthValue + ' Month' : "-----"
                        ]
                    }) : (
                        "-----"
                    )
                }
            </TableCell>
            <TableCell >
                {status !== '-----' ?
                    <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        value={status}
                        onChange={(event) => { handleUpdateStatus(row, event) }}
                        input={<Input />}
                        renderValue={(selected) => <Chip label={selected} classes={{ root: classes[states[status.toLowerCase()]] }} />}
                    >
                        {["active", "inactive", "deleted",].map(
                            (changeStatus) => (
                                <MenuItem key={changeStatus} value={changeStatus}>
                                    <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }} />
                                </MenuItem>
                            )
                        )}
                    </Select> : '-----'
                }
            </TableCell>
        </TableRow>
    })


    const filterByPlan = (value) => {
        if (value === "Active Plan") {
            setUserList(rows.filter(function (item) {
                return item.ppm_subscription_users.length ? item : null
            }))
        } else if (value === "All") {
            setUserList(rows);
        }
        else {
            setUserList(rows.filter(function (item) {
                return item.ppm_subscription_users.length ? null : item
            }))
        }
        setSearch("");
    }

    const filterByAmbessedor = (value) => {
        if (value === "Amebssedor") {
            setUserList(rows.filter(function (item) {
                return item.ReferById ? item : null;
            }))
        } else if (value === "All") {
            setUserList(rows);
        } else {
            setUserList(rows.filter(function (item) {
                return item.ReferById ? null : item;
            }))
        }
        setSearch("");
    }

    const filterByGroup = (value) => {
        setGroupId(value)
        setSearch("");
        if (value === "All") {
            setUserList(rows);
        } else {
            const filteredRows = rows.filter(function (item) {
                return item.ppm_group.id === value
            })
            setUserList(filteredRows);
        }
    }

    const handleSearch = (value) => {
        setSearch(value);
        const searchedRows = rows.filter(function (row) {
            return value === "" ||
                row.User.userName.toLowerCase().includes(value.toLowerCase()) ||
                row.User.email.toLowerCase().includes(value.toLowerCase())
        })
        setUserList(searchedRows);
    }

    return (
        <div>
            <Tooltip title="Add User to Plan">
                <IconButton onClick={handleOpen}>
                    <PersonAddIcon />
                </IconButton>
            </Tooltip>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {/* dialog Content */}

                <Grid item xs={12}>
                    <Widget
                        disableWidgetMenu
                        component={
                            <Grid container style={{ background: "white", alignItems: 'center', }}>

                                <Grid item lg={4}>
                                    <div className="userList">Add User To Plan</div>
                                </Grid>
                                <Grid item lg={8}>

                                    {
                                        !isChecked ?
                                            <>
                                                <FormControl variant="standard" className={classes.formControl}>
                                                    <InputLabel id="demo-simple-select-label">Group</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={groupId}
                                                        onChange={(event) => filterByGroup(event.target.value)}
                                                        label="Group"
                                                    >
                                                        <MenuItem value="All">All</MenuItem>
                                                        {
                                                            listGroup.map(function (item) {
                                                                return <MenuItem key={item.id} value={item.id}>{item.name + "-" + item.value}</MenuItem>;
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>

                                                <FormControl className={classes.formControl}>
                                                    <InputLabel id="demo-simple-select-label">Active Plan</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        onChange={(e) => filterByPlan(e.target.value)}
                                                    >
                                                        <MenuItem value="All">All</MenuItem>
                                                        <MenuItem value="Active Plan">Active Plan</MenuItem>
                                                        <MenuItem value="No Active Plan">No Active Plan</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <FormControl className={classes.formControl}>
                                                    <InputLabel id="demo-simple-select-label">Ambessedor</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        onChange={(e) => filterByAmbessedor(e.target.value)}
                                                        defaultValue="Non Ambessedor"
                                                    >
                                                        <MenuItem value="All">All</MenuItem>
                                                        <MenuItem value="Amebssedor">Amebssedor</MenuItem>
                                                        <MenuItem value="Non Ambessedor">Non Ambessedor</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </>
                                            :

                                            <FormControl variant="outlined" style={{ minWidth: 150, marginRight: 20 }}>
                                                <div style={{ display: 'flex' }}>

                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="demo-simple-select-label">Select Month</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={monthId}
                                                            onChange={(e) => setMonthId(e.target.value)}
                                                        >
                                                            {
                                                                month.map((months, index) => {
                                                                    return <MenuItem value={months.id} key={index}>{months.monthValue}-Month</MenuItem>
                                                                })
                                                            }

                                                        </Select>
                                                    </FormControl>

                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="demo-simple-select-label">Select Plan</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={planId}
                                                            onChange={(e) => setPlanId(e.target.value)}
                                                        >
                                                            {
                                                                plan.map((plans, index) => {
                                                                    return <MenuItem value={plans.id} key={index}>{plans.planName}</MenuItem>
                                                                })
                                                            }

                                                        </Select>
                                                    </FormControl>

                                                    <IconButton onClick={() => handleAdd()}>
                                                        <AddBoxIcon />
                                                    </IconButton>
                                                </div>
                                            </FormControl>
                                    }

                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            InputProps={{
                                                endAdornment: (
                                                    <SearchIcon />
                                                ),
                                            }}
                                            style={{ width: '20em', paddingBottom: '1em', float: 'right' }}
                                            id="outlined-basic"
                                            label="Search..."
                                            onChange={e => handleSearch(e.target.value)}
                                            value={search}
                                        />
                                    </FormControl>


                                </Grid>
                            </Grid>

                        }
                        upperTitle
                        noBodyPadding
                        bodyClass={classes.tableWidget}
                    >
                        <Table column={column} rows={data} search={search} />
                    </Widget>
                </Grid>

            </Dialog>

            <AllUserPlans
                open={openAllPlans}
                setOpen={setOpenAllPlans}
                userName={userName}
                userId={userId}
                ppmUserGroupId={userGroupId}
            />

        </div >
    );
}

