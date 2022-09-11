import React, { useState, useEffect } from "react";
import {
  Grid,
  Select,
  OutlinedInput,
  MenuItem,
  TableRow,
  TableCell,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Radio,
  FormControlLabel,
  FormLabel,
  Button,
  Checkbox,
  // Tooltip,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  YAxis,
  XAxis,
} from "recharts";
// styles
import useStyles from "./styles";
// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Table from "./components/Table/Table";
import BigStat from "./components/BigStat/BigStat";
import { getRequestWithAxios, postRequestWithFetch } from "../../service";

import Input from "@material-ui/core/Input";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import SetGroupAmount from "../../components/Modal/SetGroupAmount";
import CallingFullScreenModal from "../../components/Modal/CallingFullScreenModal";
import { notifySuccess, notifyError } from "../../components/notify/Notify"

import GroupDetailsModal from "../../components/Modal/GroupDetailsModal";
import UserDetails from "../../components/Modal/UserDetails";



const states = {
  active: "success",
  inactive: "warning",
  deleted: "default",
};

const mainChartData = getMainChartData();

export default function Dashboard(_props) {
  let classes = useStyles();
  let theme = useTheme();
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [change, setChange] = useState(0);

  const [open, setOpen] = useState(true);
  const [groupId, setGroupId] = useState('');

  const [groupValue, setGroupValue] = useState('')
  const [listGroup, setListGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [openGroupDeatil, setOpenGroupDetail] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userGroup, setUserGroup] = useState([]);
  const [clickedUserGroup, setClickedUserGroup] = useState("");

  useEffect(() => {
    groupList();
    userData();
  }, []);

  useEffect(function () {
    const initialRows = async () => {
      try {
        const data = await getRequestWithAxios("user/fetch_data");
        if (data.data) {
          const finalData = data.data.data.filter(function (item) {
            item.isSelected = false;
            return item.ppm_userGroups[0].ppmGroupId === 1 ? item : null;
          })
          setRows(finalData)
        }
      } catch (err) {
        console.log(err);
      }
    }
    initialRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userData = async () => {
    try {
      const data = await getRequestWithAxios("user/fetch_data");
      if (data.data) {
        const finalData = data.data.data.map(function (item) {
          item.isSelected = false;
          return item;
        })
        setRows(finalData)
        setData(finalData)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const groupList = async () => {
    const data = await postRequestWithFetch("group/list", { status: true });
    if (data) {
      setListGroup(data.data);
      setGroupName(data.data[0].id)
    }
  }

  const handleUpdate = async (userId, event) => {
    const res = await postRequestWithFetch(`user/update/${userId}`, {
      status: event.target.value
    })
    if (res.success === true) {
      userData();
      notifySuccess({ Message: "Status Updated Successfully.", ProgressBarHide: true })
    } else {
      notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
    }
  }

  const handleChangeGroup = async (registerType, id, previousValue) => {
    const res = await postRequestWithFetch("group/updateUserGroup", {
      rType: registerType,
      value: groupValue,
      previousValue: previousValue,
      userId: id
    })
    if (res.success === true && res.status === 2) {
      notifySuccess({ Message: "New Group Created successfully", ProgressBarHide: true })
      setGroupId(res.data.id)
    } else if (res.success === true && res.status === 1) {
      notifySuccess({ Message: "Group Updated successfully", ProgressBarHide: true })
    } else {
      notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
    }
    setChange(0);
    userData();
  }

  const handleFilter = () => {
    const filteredRows = data.filter(function (item) {
      if (groupName === "" || userStatus === "")
        return true
      if (userStatus === "both")
        return true && item.ppm_userGroups[0].ppmGroupId === groupName;
      return item.status === userStatus && item.ppm_userGroups[0].ppmGroupId === groupName
    })
    setRows(filteredRows);
  }

  const handleResetFilter = () => {
    setRows(data);
    setUserStatus("");
    setGroupName("");
  }

  const handleChangeCheck = (checked) => {

    setAllChecked(checked);
    if (checked) {
      setIsChecked(true)
      rows.forEach(function (item) {
        item.isSelected = true;
      })
    } else {
      setIsChecked(false);
      rows.forEach(function (item) {
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
    setRows(changeRows)
  }

  const handleUpdateUserGroups = () => {
    rows.forEach(async function (item) {
      if (item.isSelected) {
        const body = { user: item, groupId: groupName, status: userStatus }
        const response = await postRequestWithFetch("group/changeMultipleUserGroups", body);

        if (response.success === true) {
          notifySuccess({ Message: 'User Group Updated Successfully', ProgressBarHide: true })
          userData();
        } else {
          notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
        }
      }
      // userData();
    })

    handleChangeCheck(false)
    handleResetFilter();
  }

  const column = [
    <span>
      <Checkbox checked={allChecked} value={allChecked} onChange={(event) => handleChangeCheck(event.target.checked)} />
      {"S.No"}
    </span>,
    "Name",
    "Email",
    "Contact",
    "Date Of Registration",
    "Gender",
    "Latest Group",
    "Status",
    "Action"
  ];

  const callingFullScreenModal = (id, userName, userGroup) => {
    setUserGroup(userGroup);
    setUserId(id)
    setUserName(userName)
    setOpenGroupDetail(true);
  } 

  const users = rows.filter((val) => {
    if (search === "") {
      return val
    } else if (val.userName.toLowerCase().includes(search.toLowerCase())) {
      return val
    } else if (val.email.toLowerCase().includes(search.toLowerCase())) {
      return val
    } else if (val.phone.toLowerCase().includes(search.toLowerCase())) {
      return val
    } else if (val.dob.toLowerCase().includes(search.toLowerCase())) {
      return val
    } else if (val.gender.toLowerCase().includes(search.toLowerCase())) {
      return val
    } else if (val.status.toLowerCase().includes(search.toLowerCase())) {
      return val
    } else {
      return 0
    }
  }).map(({ isSelected, id, userName, email, phone, dob, dateOfRegistration, gender, status, registerType, ppm_userGroups }, index) => {
    const value = ppm_userGroups[0].ppm_group.value;
    return (

      <TableRow key={id} hover={true}>
        <TableCell align="center" className={classes.borderType}>
          <Checkbox checked={isSelected} onChange={() => handleChangeIndividualCheck(index)} /> {index + 1}
        </TableCell>
        <TableCell className={classes.borderType}>
          <Button variant="outlined" color="primary" onClick={() => callingFullScreenModal(id, userName, ppm_userGroups)}>{userName} </Button>
        </TableCell>
        <TableCell className={classes.borderType}>{email}</TableCell>
        <TableCell className={classes.borderType}>{phone}</TableCell>
        <TableCell className={classes.borderType}>{dateOfRegistration}</TableCell>
        <TableCell className={classes.borderType}>{gender}</TableCell>
        <TableCell className={classes.borderType}>
          {
            change === index + 1 ? (<>
              {registerType}-<input style={{ width: "40px", margin: "2px" }} onChange={(e) => setGroupValue(e.target.value)} min="0" type="number" value={groupValue} placeholder={value} />
              <IconButton onClick={() => handleChangeGroup(registerType, id, value)}>
                <DoneIcon color="primary" fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setChange(0)}>
                <CloseIcon color="error" fontSize="small" />
              </IconButton>
            </>) : (<>
              <Chip onClick={() => setChange(index + 1)} style={{ justifyContent: 'center', padding: '3px', color: 'InfoText' }} label={`${registerType}-${value}`} />
              {groupId && <SetGroupAmount open={open} setOpen={setOpen} handleChangeGroup={handleChangeGroup} group={{ registerType, groupId, groupValue, id }} />}
            </>
            )}

        </TableCell>
        <TableCell >
          <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            value={status}
            onChange={(event) => { handleUpdate(id, event) }}
            input={<Input />}
            renderValue={(selected) => <Chip label={selected} classes={{ root: classes[states[status.toLowerCase()]] }} />}
          >
            {["active", "inactive", "deleted"].map(
              (changeStatus) => (
                <MenuItem key={changeStatus} value={changeStatus}>
                  <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }} />
                </MenuItem>
              )
            )}
          </Select>

        </TableCell>
        <TableCell align="left">
          <UserDetails Userdata={{ id, userName, email, phone, dob, dateOfRegistration, gender, status }} />
        </TableCell>
      </TableRow>

    )
  })


  // local
  var [mainChartState, setMainChartState] = useState("monthly");

  return (
    <>
      <CallingFullScreenModal
        userId={userId}
        setUserId={setUserId}
        userName={userName}
        setUserName={setUserName}
        open={openDialog}
        setOpen={setOpenDialog}
        userGroup = {userGroup}
        clickedUserGroup = {clickedUserGroup}
      />

      <PageTitle title="Dashboard" />
      <Grid container spacing={4}>

        {/* *********Medea Card*********** */}

        {/* empty */}

        {/* *******End Medea Card********* */}


        {/* *********Medea Card 2*********** */}
        {mock.bigStat.map(stat => (
          <Grid item md={4} sm={6} xs={12} key={stat.product}>
            <BigStat {...stat} />
          </Grid>
        ))}
        {/* *******End Medea Card-2********* */}

        {/* *******Graph Chart********* */}

        <Grid item xs={12}>
          <Widget
            bodyClass={classes.mainChartBody}
            header={
              <div className={classes.mainChartHeader}>
                <Typography
                  variant="h5"
                  color="text"
                  colorBrightness="secondary"
                >
                  Users Chart
                </Typography>
                {/* <div className={classes.mainChartHeaderLabels}>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="warning" />
                    <Typography className={classes.mainChartLegentElement}>
                      Tablet
                    </Typography>
                  </div>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="primary" />
                    <Typography className={classes.mainChartLegentElement}>
                      Mobile
                    </Typography>
                  </div>
                  <div className={classes.mainChartHeaderLabel}>
                    <Dot color="secondary" />
                    <Typography className={classes.mainChartLegentElement}>
                      Desktop
                    </Typography>
                  </div>
                </div> */}
                <Select
                  value={mainChartState}
                  onChange={e => setMainChartState(e.target.value)}
                  input={
                    <OutlinedInput
                      labelWidth={0}
                      classes={{
                        notchedOutline: classes.mainChartSelectRoot,
                        input: classes.mainChartSelect,
                      }}
                    />
                  }
                  autoWidth
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </div>
            }
          >
            <ResponsiveContainer width="100%" minWidth={500} height={350}>
              <ComposedChart
                margin={{ top: 0, right: -15, left: -15, bottom: 0 }}
                data={mainChartData}
              >
                <YAxis
                  ticks={[0, 2500, 5000, 7500]}
                  tick={{ fill: theme.palette.text.hint + "80", fontSize: 14 }}
                  stroke={theme.palette.text.hint + "80"}
                  tickLine={false}
                />
                <XAxis
                  tickFormatter={i => i + 1}
                  tick={{ fill: theme.palette.text.hint + "80", fontSize: 14 }}
                  stroke={theme.palette.text.hint + "80"}
                  tickLine={false}
                />
                <Area
                  type="natural"
                  dataKey="desktop"
                  fill={theme.palette.background.light}
                  strokeWidth={0}
                  activeDot={false}
                />
                <Line
                  type="natural"
                  dataKey="mobile"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
                <Line
                  type="linear"
                  dataKey="tablet"
                  stroke={theme.palette.warning.main}
                  strokeWidth={2}
                  dot={{
                    stroke: theme.palette.warning.dark,
                    strokeWidth: 2,
                    fill: theme.palette.warning.main,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>

        {/* *******End Graph Chart********* */}

        {/* *******Users Data Table********* */}

        <Grid item xs={12}>
          <Widget
            title=""
            component={<div>
              <Grid container spacing={2} style={{ background: "white" }}>

                <Grid item lg={7} style={{ display: "flex", alignItems: "center" }}>
                  <div className="userList">User List</div>
                  <FormControl variant="outlined" style={{ minWidth: 150, marginRight: 20 }}>
                    <InputLabel id="demo-simple-select-label">Group</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={groupName}
                      onChange={(event) => setGroupName(event.target.value)}
                      label="Group"
                    // defaultValue="1"
                    >
                      {
                        listGroup.map(function (item) {
                          return <MenuItem value={item.id}>{item.name + "-" + item.value}</MenuItem>;
                        })
                      }
                    </Select>
                  </FormControl>
                  <div style={{ display: "flex", alignItems: "center", border: "1px grey solid", padding: "3px 10px" }}>
                    <FormLabel component="legend">STATUS</FormLabel>
                    <FormControlLabel
                      onChange={(event) => setUserStatus(event.target.value)}
                      value="active"
                      control={<Radio />}
                      checked={userStatus === "active"}
                      label="Yes" />
                    <FormControlLabel
                      onChange={(event) => setUserStatus(event.target.value)}
                      value="inactive"
                      control={<Radio />}
                      checked={userStatus === "inactive"}
                      label="No" />
                    <FormControlLabel
                      onChange={(event) => setUserStatus(event.target.value)}
                      value="both"
                      control={<Radio />}
                      checked={userStatus === "both"}
                      label="Both" />
                  </div>
                </Grid>

                <Grid item lg={2} style={{ display: "flex", alignItems: "center" }}>
                  {
                    !isChecked ? <>
                      <Button onClick={handleFilter} color="primary" variant="contained">Apply</Button>
                      <Button onClick={handleResetFilter} color="primary" style={{ margin: 20 }} variant="outlined">Reset</Button>
                    </> :
                      <>
                        <Button onClick={() => handleUpdateUserGroups()} color="primary" variant="contained">Update</Button>
                        <Button onClick={() => handleChangeCheck(false)} color="primary" style={{ margin: 20 }} variant="outlined">Cancel</Button>
                      </>
                  }
                </Grid>

                <Grid item lg={3}>
                  <TextField
                    InputProps={{
                      endAdornment: (
                        <SearchIcon />
                      ),
                    }}
                    style={{ width: '20em', paddingBottom: '1em' }} id="outlined-basic" label="Search..." onChange={e => { setSearch(e.target.value) }} />
                </Grid>

              </Grid>
            </div>
            }
            upperTitle
            noBodyPadding
            bodyClass={classes.tableWidget}
          >
            <Table column={column} rows={users} />
          </Widget>
        </Grid>

        {/* *******End Users Table********* */}

      </Grid>

      <GroupDetailsModal
        open={openGroupDeatil}
        setOpen={setOpenGroupDetail}
        userName={userName}
        userId={userId}
        setUserId={setUserId}
        setOpenDialog={setOpenDialog}
        clickedUserGroup = {clickedUserGroup}
        setClickedUserGroup = {setClickedUserGroup}
      />

    </>
  );
}

// #######################################################################
function getRandomData(length, min, max, multiplier = 10, maxDiff = 10) {
  var array = new Array(length).fill();
  let lastValue;

  return array.map((_item, _index) => {
    let randomValue = Math.floor(Math.random() * multiplier + 1);

    while (
      randomValue <= min ||
      randomValue >= max ||
      (lastValue && randomValue - lastValue > maxDiff)
    ) {
      randomValue = Math.floor(Math.random() * multiplier + 1);
    }

    lastValue = randomValue;

    return { value: randomValue };
  });
}

function getMainChartData() {
  var resultArray = [];
  var tablet = getRandomData(31, 3500, 6500, 7500, 1000);
  var desktop = getRandomData(31, 1500, 7500, 7500, 1500);
  var mobile = getRandomData(31, 1500, 7500, 7500, 1500);

  for (let i = 0; i < tablet.length; i++) {
    resultArray.push({
      tablet: tablet[i].value,
      desktop: desktop[i].value,
      mobile: mobile[i].value,
    });
  }

  return resultArray;
}