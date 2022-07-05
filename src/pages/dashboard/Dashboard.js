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
// import Dot from "../../components/Sidebar/components/Dot";
import Table from "./components/Table/Table";
import BigStat from "./components/BigStat/BigStat";
import { getRequestWithAxios, postRequestWithFetch, getRequestWithFetch } from "../../service";


import Input from "@material-ui/core/Input";
// import FormDialog from "../../components/Modal/Modal"
// import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import FullScreenDialog from "../../components/Modal/FullScreenModal";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';



const states = {
  active: "success",
  inactive: "warning",
  deleted: "default",
};

const mainChartData = getMainChartData();

export default function Dashboard(props) {
  var classes = useStyles();
  var theme = useTheme();
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [change, setChange] = useState(0);
  const [groupValue, setGroupValue] = useState('')
  const [listGroup, setListGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    userData();
    groupList()
  }, []);

  const userData = async () => {
    try {
      const data = await getRequestWithAxios("user/fetch_data");
      if (data.data) {
        const finalData = data.data.data.map(function (item) {
          item.isSelected = false;
          return item;
        })
        setData(finalData);
        setRows(finalData)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const groupList = async () => {
    const data = await getRequestWithFetch("group/fetchallgrouplist");
    if (data.success)
      setListGroup(data.data);
  }

  const handleUpdate = async (userId, event) => {
    await postRequestWithFetch(`user/update/${userId}`, {
      status: event.target.value
    })
    userData();
  }

  const handleChangeGroup = async (registerType, id) => {
    await postRequestWithFetch("group/updateUserGroup", {
      rType: registerType,
      value: groupValue,
      userId: id
    })
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
    handleResetFilter();
  }

  const handleChangeIndividualCheck = (index) => {
    let bool = false;
    let changeRows = rows.map(function (item, itemIndex) {
      if (itemIndex === index) {
        item.isSelected = !item.isSelected;
        if(item.isSelected){
          bool = true;
          setIsChecked(true);
        }
      }
      if(!bool) setIsChecked(false);
      return item;
    })
    setRows(changeRows)
  }

  const handleUpdateUserGroups = ()=>{
    rows.forEach(async function(item){
      if(item.isSelected){
        const body = {user: item, groupId : groupName, status: userStatus}
        await postRequestWithFetch("group/changeMultipleUserGroups", body);
      }
      userData();
    })
    handleResetFilter();
    handleChangeCheck(false)
  }

  // const handleDelete = async (userId) => {
  //   window.alert('Do you want to delete');
  //   await fetch(`http://localhost:7080/api/user/delete/${userId}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + localStorage.getItem("id_token")
  //     },
  //     body: JSON.stringify({
  //       status: "deleted"
  //     })
  //   })
  //   userData();
  // }

  // console.log(groupValue);

  const column = [
    <span>
      <Checkbox checked={allChecked} value={allChecked} onChange={(event) => handleChangeCheck(event.target.checked)} />
      {"S.No"}
    </span>,
    "Name",
    "Email",
    "Contact",
    "Date of Birth",
    "Gender",
    "Group",
    "Status",
    "Action"
  ];

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
  }).map(({ isSelected, id, userName, email, phone, dob, gender, status, registerType, ppm_userGroups }, index) => {
    const value = ppm_userGroups[0].ppm_group.value;
    return (

      <TableRow key={id} hover={true}>
        <TableCell align="center" className={classes.borderType}>
          <Checkbox checked={isSelected} onChange={() => handleChangeIndividualCheck(index)} /> {index + 1}
        </TableCell>
        <TableCell className={classes.borderType}>{userName}</TableCell>
        <TableCell className={classes.borderType}>{email}</TableCell>
        <TableCell className={classes.borderType}>{phone}</TableCell>
        <TableCell className={classes.borderType}>{dob}</TableCell>
        <TableCell className={classes.borderType}>{gender}</TableCell>
        <TableCell className={classes.borderType}>
          {
            change === index + 1 ? (<>
              {registerType}-<input style={{ width: "40px", margin: "2px" }} onChange={(e) => setGroupValue(e.target.value)} min="0" type="number" value={groupValue} placeholder={value} />
              <IconButton onClick={() => handleChangeGroup(registerType, id)}>
                <DoneIcon color="primary" fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setChange(0)}>
                <CloseIcon color="error" fontSize="small" />
              </IconButton>
            </>) : <Chip onClick={() => setChange(index + 1)} style={{ justifyContent: 'center', padding: '3px', color: 'InfoText' }} label={`${registerType}-${value}`} />
          }
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
          {/* <FormDialog user={{ id, userName, email, phone, dob, gender, status }} /> */}

          <FullScreenDialog Userdata={{ id, userName, email, phone, dob, gender, status }} />

          {/* <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon onClick={() => handleDelete(id)} />
            </IconButton>
          </Tooltip> */}
        </TableCell>
      </TableRow>

    )
  })


  // local
  var [mainChartState, setMainChartState] = useState("monthly");

  return (
    <>
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
                        <Button onClick={()=>handleUpdateUserGroups()} color="primary" variant="contained">Update</Button>
                        <Button onClick={()=>handleChangeCheck(false)} color="primary" style={{ margin: 20 }} variant="outlined">Cancel</Button>
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