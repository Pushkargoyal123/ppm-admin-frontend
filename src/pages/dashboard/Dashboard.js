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
  Tooltip,
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
import axios from "axios";


import Input from "@material-ui/core/Input";
import FormDialog from "../../components/Modal/Modal"
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import FullScreenDialog from "../../components/Modal/FullScreenModal";



const states = {
  active: "success",
  inactive: "warning",
  deleted: "default",
};

const mainChartData = getMainChartData();

export default function Dashboard(props) {
  var classes = useStyles();
  var theme = useTheme();
  const [rows, setData] = useState([]);

  useEffect(() => {
    userData();
  }, []);

  const userData = async () => {
    try {
      const res = await axios.get(`http://localhost:7080/api/user/fetch_data`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("id_token")
        }
      })
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log("==========================", rows);

  const [search, setSearch] = useState("")

  const handleUpdate = async (userId, event) => {
    await fetch(`http://localhost:7080/api/user/update/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("id_token")
      },
      body: JSON.stringify({
        status: event.target.value
      })
    })
    userData();
  }



  const handleDelete = async (userId) => {
    window.alert('Do you want to delete');
    await fetch(`http://localhost:7080/api/user/delete/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("id_token")
      },
      body: JSON.stringify({
        status: "deleted"
      })
    })
    userData();
  }

  const column = ["S.No", "Name", "Email", "Contact", "Date of Birth", "Gender", "Group", "Status", "Action"];

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
  }).map(({ id, userName, email, phone, dob, gender, status, registerType, ppm_userGroups }, index) => {
    const value = ppm_userGroups[0].ppm_group.value;
    return (

      <TableRow key={id} hover={true}>
        <TableCell align="center" className={classes.borderType}>{index + 1}</TableCell>
        <TableCell className={classes.borderType}>{userName}</TableCell>
        <TableCell className={classes.borderType}>{email}</TableCell>
        <TableCell className={classes.borderType}>{phone}</TableCell>
        <TableCell className={classes.borderType}>{dob}</TableCell>
        <TableCell className={classes.borderType}>{gender}</TableCell>
        <TableCell className={classes.borderType}>
          <Chip style={{ justifyContent: 'center', padding: '3px', color: 'InfoText' }} label={`${registerType}-${value}`} />
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
            {["active", "inactive"].map(
              (changeStatus) => (
                <MenuItem key={changeStatus} value={changeStatus}>
                  <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }} />
                </MenuItem>
              )
            )}
          </Select>

        </TableCell>
        <TableCell align="left">
          <FormDialog user={{ id, userName, email, phone, dob, gender, status }} />

          <FullScreenDialog Userdata={{ id, userName, email, phone, dob, gender, status }} />

          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon onClick={() => handleDelete(id)} />
            </IconButton>
          </Tooltip>
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
            title="User Data"
            component={
              <TextField
                InputProps={{
                  endAdornment: (
                    <SearchIcon />
                  ),
                }}
                style={{ marginLeft: '44em', width: '26em', paddingBottom: '1em' }} id="outlined-basic" label="Search..." onChange={e => { setSearch(e.target.value) }} />
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

  return array.map((item, index) => {
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