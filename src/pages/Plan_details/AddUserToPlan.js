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
import { FormControl, Grid, InputLabel, MenuItem, Select, TableCell, TableRow, TextField, Checkbox, Button } from '@material-ui/core';
import Table from '../dashboard/components/Table/Table'
import Widget from '../../components/Widget/Widget';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { notifyError, notifySuccess } from '../../components/notify/Notify';

import AllUserPlans from '../../components/Modal/AllUserPlans';

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
    const [openAllPlans, setOpenAllPlans] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
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
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        handleList();
        groupList();
    }, [])

    const groupList = async () => {
        const data = await postRequestWithFetch("group/list", { status: true });
        if (data) {
            setListGroup(data.data);
        }
    }

    const handleOpen = (() => {
        setOpen(true);
    })

    const handleList = async () => {
        const res = await getRequestWithFetch("plans/userSubscriptionList");
        const Plan = await getRequestWithFetch("plans/planList")
        const Months = await getRequestWithFetch("plans/getMonthlyPlansList")

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

        if (groupId) {
            setShowError(false);
            const selectedMonth = month.filter(function (item) {
                return item.id === monthId ? item : null;
            })[0];

            if (selectedMonth) {

                const ppmSubscriptionMonthlyPlanChargeId = selectedMonth.ppm_subscription_monthly_plan_charges.filter(function (item) {
                    return item.ppmSubscriptionPlanId === planId ? item.id : null;
                })[0]
                if (ppmSubscriptionMonthlyPlanChargeId) {

                    let endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + selectedMonth.monthValue)
                    
                    userList.forEach(async (item) => {

                        const ppmUserGroupId = item.ppm_userGroups.filter(item => item.ppm_group.id === groupId)[0].id

                        if (item.isSelected) {
                            const body = {
                                startDate: new Date().toLocaleString(),
                                endDate: endDate.toLocaleString(),
                                UserId: item.id,
                                ppmSubscriptionPlanId: planId,
                                ppmSubscriptionMonthId: monthId,
                                ppmSubscriptionMonthlyPlanChargeId: ppmSubscriptionMonthlyPlanChargeId.id,
                                ppmUserGroupId: ppmUserGroupId,
                                MonthlyPlanDisplayPrice: ppmSubscriptionMonthlyPlanChargeId.displayPrice
                            }
                            const data = await postRequestWithFetch('plans/addUserSubscription', body)
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
        }else{
            setShowError(true);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeCheck = (value) => {
        setAllChecked(value);
        if (value) {
            userList.forEach(function (item) {
                item.isSelected = true;
            })
        } else {
            userList.forEach(function (item) {
                item.isSelected = false;
            })
        }
    }

    const handleChangeIndividualCheck = (index) => {
        let bool = false;
        let changeRows = rows.map(function (item, itemIndex) {
            if (itemIndex === index) {
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

    const handleShowAllPlans = (userName, userId) => {
        setUserId(userId)
        setUserName(userName)
        setOpenAllPlans(true);
    }

    const column = [
        <span>
            <Checkbox checked={allChecked} value={allChecked} onChange={(event) => handleChangeCheck(event.target.checked)} />
            {"S.No"}
        </span>,
        'User Name',
        'Email',
        'Date Of Registraion',
        "Plan Starting Date (MM/DD/YYYY)",
        "Plan End Date (MM/DD/YYYY)",
        'Active Plan'
    ]

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
            <TableCell align="center" className={classes.borderType}>
                <Checkbox checked={row.isSelected} onChange={() => handleChangeIndividualCheck(index)} /> {index + 1}
            </TableCell>
            {/* <TableCell>{row.id}</TableCell> */}
            <TableCell>
                <Button variant='outlined' onClick={() => handleShowAllPlans(row.userName, row.id)}> {row.userName} </Button>
            </TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.dateOfRegistration}</TableCell>
            <TableCell>{row.ppm_subscription_users.length ? row.ppm_subscription_users[0].startDate : "------"}</TableCell>
            <TableCell>{row.ppm_subscription_users.length ? row.ppm_subscription_users[0].endDate : "------"}</TableCell>
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
    }

    const filterByGroup = (value) => {
        setGroupId(value)
        if (value === "All") {
            setUserList(rows);
        } else {
            const filteredRows = rows.filter(function (item) {
                return item.ppm_userGroups[0].ppm_group.id === value
            })
            setUserList(filteredRows);
        }
    }

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
                        component={
                            <Grid container style={{ background: "white", display: 'flex', flexDirection: 'row' }}>

                                <Grid item lg={4}>
                                    <div className="userList">Add User To Plan</div>
                                </Grid>
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
                                                            return <MenuItem value={item.id}>{item.name + "-" + item.value}</MenuItem>;
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

                                                <FormControl variant="standard" error={showError} className={classes.formControl}>
                                                    <InputLabel id="demo-simple-select-label">Group</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={groupId}
                                                        onChange={(event) => filterByGroup(event.target.value)}
                                                        label="Group"
                                                    >
                                                        {
                                                            listGroup.map(function (item) {
                                                                return <MenuItem value={item.id}>{item.name + "-" + item.value}</MenuItem>;
                                                            })
                                                        }
                                                    </Select>
                                                    {
                                                        showError ?    
                                                            <div className='errorText'>Select Group</div> :
                                                            <div></div>
                                                    }
                                                </FormControl>

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
                                        style={{ width: '20em', paddingBottom: '1em', float: 'right' }} id="outlined-basic" label="Search..." onChange={e => { setSearch(e.target.value) }}
                                    />
                                </FormControl>


                            </Grid>

                        }
                        upperTitle
                        noBodyPadding
                        bodyClass={classes.tableWidget}
                    >
                        <Table column={column} rows={data} />
                    </Widget>
                </Grid>

            </Dialog>

            <AllUserPlans
                open={openAllPlans}
                setOpen={setOpenAllPlans}
                userName={userName}
                userId={userId}
            />

        </div >
    );
}

