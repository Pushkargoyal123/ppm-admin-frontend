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
import { FormControl, Grid, InputLabel, MenuItem, Select, TableCell, TableRow, TextField } from '@material-ui/core';
import Table from '../dashboard/components/Table/Table'
import Widget from '../../components/Widget/Widget';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
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
    const [userList, setUserList] = React.useState([]);
    const [plan, setPlanList] = React.useState([]);
    const [month, setMonthList] = React.useState([]);

    const [search, setSearch] = useState("");

    const [userId, setUserId] = React.useState('');
    const [planId, setPlanId] = React.useState('');
    const [monthId, setMonthId] = React.useState('');
    const [monthPlanChargeId, setMonthPlanChargeId] = React.useState('');
    const [userGroupId, setUserGroupId] = React.useState('');


    useEffect(() => {
        handleList()
    }, [])

    const handleOpen = (() => {
        setOpen(true);
    })

    const handleList = async () => {
        const res = await getRequestWithFetch("plans/userSubscriptionList");
        const Plan = await getRequestWithFetch("plans/planList")
        const Months = await getRequestWithFetch("plans/monthList")
        if (res.success) {
            setUserList(res.data);
        }
        if (Plan.success) {
            setPlanList(Plan.data);
        }
        if (Months.success) {
            setMonthList(Months.data);
        }
    };

    const handleAdd = async () => {
        const body = {
            userId: userId,
            planId: planId,
            monthId: monthId,
            monthPlanChargeId: monthPlanChargeId,
            userGroupId: userGroupId
        }
        await postRequestWithFetch('plans/addUserSubscription', body)

    }

    const handleClose = () => {
        setOpen(false);
    };

    const column = [
        'S.No',
        'User Name',
        'Email',
        'Date Of Registraion',
        'Active Plan'
    ]

    console.log(userList);

    const data = userList.filter((row) => {
        if (search === "") {
            return row;
        } else if (row.userName.toLowerCase().includes(search.toLowerCase())) {
            return row;
        } else if (row.email.toLowerCase().includes(search.toLowerCase())) {
            return row;
        } else {
            return 0;
        }
    }).map((row, index) => {

        const SubsUser = row.ppm_subscription_users;

        return <TableRow>
            <TableCell>{index + 1}</TableCell>
            {/* <TableCell>{row.id}</TableCell> */}
            <TableCell>{row.userName}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.dateOfRegistration}</TableCell>
            <TableCell>
                {
                    SubsUser.length ? SubsUser.map((rows) => {
                        return [
                            rows.ppm_subscription_plan.planName + '-' + rows.ppm_subscription_month.monthValue + ' Month'
                        ]
                    }) : (
                        "-----"
                    )
                }
            </TableCell>
        </TableRow>
    })


    return (
        <div>
            <IconButton onClick={handleOpen}>
                <PersonAddIcon />
            </IconButton>
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
                        title=""
                        component={<div>
                            <Grid container spacing={2} style={{ background: "white" }}>

                                <Grid item lg={7} style={{ display: "flex", alignItems: "center" }}>
                                    <div className="userList">Add User To Plan</div>
                                </Grid>
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

                                <Grid item lg={3}>
                                    <TextField
                                        InputProps={{
                                            endAdornment: (
                                                <SearchIcon />
                                            ),
                                        }}
                                        style={{ width: '20em', paddingBottom: '1em', float: 'right' }} id="outlined-basic" label="Search..." onChange={e => { setSearch(e.target.value) }} />
                                </Grid>

                            </Grid>
                        </div>
                        }
                        upperTitle
                        noBodyPadding
                        bodyClass={classes.tableWidget}
                    >
                        <Table column={column} rows={data} />
                    </Widget>
                </Grid>



                {/* dialog Content End */}

            </Dialog>
        </div >
    );
}