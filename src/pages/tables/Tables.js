import React, { useEffect, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MUIDataTable from "mui-datatables";
import useStyles from '../dashboard/styles';
import CloseIcon from '@material-ui/icons/Close';
import { getRequestWithAxios, postRequestWithFetch } from "../../service";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { Tab, TableCell, TableRow } from '@material-ui/core';
import TableComponent from '../../pages/dashboard/components/Table/Table';
import Typography from '@material-ui/core/Typography';

import CreateGroup from "../../components/Modal/CreateGroup";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Tables() {
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [activeButton, setActiveButton] = React.useState(0);
  const [groupMemberlist, setGroupMemberList] = React.useState([]);
  const [leaderboardList, setLeaderBoardList] = React.useState([]);
  const [currentGroup, setCurrentGroup] = useState("");
  const [activeMembers, setActiveMembers] = useState(0);
  const [inActiuveMembers, setInActiveMembers] = useState(0);
  const [userTransactionHistory, setUserTransactionHistory] = useState([]);
  const [userName, setUserName] = useState("");

  const classes = useStyles();

  useEffect(() => {
    const GroupList = async () => {
      const res = await getRequestWithAxios("group/fetchallgrouplist");
      setRows(res.data.data);
    }
    GroupList();
  }, []);


  const GroupMemberList = async (registerType, value, groupId) => {
    setCurrentGroup(registerType + "-" + value);
    setGroupId(groupId);
    const body = {
      ppmGroupid: groupId
    }
    const result = await postRequestWithFetch("user/groupmemberlist", body);
    let activeMembers = 0, inActiveMembers = 0;
    result.data.forEach(function (item) {
      if (item.User.status === "inactive") {
        inActiveMembers++;
      } else {
        activeMembers++;
      }
    })
    setInActiveMembers(inActiveMembers);
    setActiveMembers(activeMembers);
    setGroupMemberList(result.data);
    setActiveButton(1)
  }

  const LeaderBoardList = async (registerType, value, groupId) => {
    setGroupId(groupId)
    setCurrentGroup(registerType + "-" + value);
    const result = await getRequestWithAxios(`leaderboard/fetchLeaderBoardDataForAdmin/${registerType}?groupId=${groupId}`);
    let activeMembers = 0, inActiveMembers = 0;
    result.data.data.forEach(function (item) {
      if (item.status === "inactive") {
        inActiveMembers++;
      } else {
        activeMembers++;
      }
    })
    setInActiveMembers(inActiveMembers);
    setActiveMembers(activeMembers);
    setLeaderBoardList(result.data.data);
    setActiveButton(2)
  }

  // profitloss 

  const callingFullScreenModal = async(id, userName) => {
    setOpen(true);
    setUserName(userName)
    const res = await getRequestWithAxios(`stock/fetchportfoliohistory/${id}`);
    setUserTransactionHistory(res.data.data);
  }

  const datatableData2 = leaderboardList.map((r, index) => {
    return [
      index + 1,
      <Button
        variant="outlined"
        color="primary"
        onClick={()=>callingFullScreenModal(r.id, r.userName)}>
        {r.userName}
      </Button>,
      r.current_investment,
      r.totalCurrentPrice - r.current_investment,
      r.totalCurrentPrice - r.current_investment,
      r.number * 10,
      r.ppm_userGroups[0].virtualAmount,
      r.ppm_userGroups[0].netAmount,
      r.dateOfRegistration
    ]
  })

  const datatableData1 = groupMemberlist.map((r, index) => {
    return [
      index + 1,
      <Button 
        color="primary" 
        variant="outlined"
        onClick={()=>callingFullScreenModal(r.User.id, r.userName)}>
          {r.User.userName}
        </Button>,
      r.User.email,
    ]
  })

  const datatableData = rows.map((row, index) => {
    return [
      <Button onClick={() => LeaderBoardList(row.name, row.value, row.id)} color="primary">Leaderboard</Button>,
      index + 1,
      <Button onClick={() => { GroupMemberList(row.name, row.value, row.id) }} variant="outlined" color="primary">{row.name + "-" + row.value}</Button>,
      row.virtualAmount,
      row.ppm_userGroups[0].TotalMembers,
      row.createdAt.split('T')[0],
      row.ppm_portfoliohistories[0].ActiveUser,
      row.ppm_portfoliohistories[0].minDate.split(' ')[0],
    ]
  })

  const HistoryColumn = ["Trans_id", "Company", "Status", "Stocks", "Date/Time"];

  const HistoryRows = userTransactionHistory.map((rows) => (
    <TableRow key={rows.id}>
      <TableCell>{1000 + rows.id}</TableCell>
      <TableCell>{rows.companyName}<b>({rows.companyCode})</b></TableCell>
      {
        rows.totalbuyStock === 0 ? (
          <>
            <TableCell><font color='red'>SELL</font></TableCell>
            <TableCell>{rows.totalSellStock}</TableCell>
          </>
        ) : (
          <>
            <TableCell><font color='#1bd611'>BUY</font></TableCell>
            <TableCell>{rows.totalBuyStock}</TableCell>
          </>
        )
      }
      <TableCell>{rows.dateTime.split(' ')[0]}</TableCell>
    </TableRow>
  ))

      const handleClose = ()=>{
        setOpen(false);
      }

  const title = <IconButton onClick={() => setActiveButton(0)}><ArrowBackIcon /></IconButton>

  return (
    <>

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {userName} Transaction History
            </Typography>
            <Typography variant="h6">
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.formContainer}>
          <div className={classes.form}>

              <Tab label="User Portfolio" classes={{ root: classes.tab }} />
              <Tab label="User Transaction" classes={{ root: classes.tab }} />
              <TableComponent column={HistoryColumn} rows={HistoryRows} />

          </div>
        </div>
      </Dialog>
      {activeButton === 0 && (<Grid container spacing={4}>
        <Grid item xs={12}><br />
          <MUIDataTable
            title={
              <div style={{ display: "flex", justifyContent: "space-between",flexWrap:"wrap", alignItems: "center" }}>
                <span><font size="4">Groups</font></span>
                <span><CreateGroup /></span>
              </div>
            }

            data={datatableData}
            columns={["Leaderboard", "S.No.", "Group", "virtualAmount" ,"Total Members", "Starting Registration Date", "Total Active User", "Starting buying Date"]}
            options={{
              filterType: "none",
              selectableRows: 'none'
            }}
          />
        </Grid>
      </Grid>)}

      {activeButton === 1 && (<Grid container spacing={4}>
        <Grid item xs={12}><br />
          <MUIDataTable

            title={<div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
              <span>{title}</span>
              <span>
                <Button onClick={() => LeaderBoardList(...currentGroup.split("-"), groupId)} color="primary" variant="contained">Leaderboard</Button>
              </span>
              <span>{currentGroup}</span>
              <span style={{ color: "blue" }}>
                {`There Are ${activeMembers} active members out of ${activeMembers + inActiuveMembers}`}
              </span>
            </div>
            }

            data={datatableData1}
            columns={["S.No.", "Name", "Email-ID"]}
            options={{
              filterType: "none",
              selectableRows: 'none',
              setRowProps: (_row, index) => {
                if (groupMemberlist[index].User.status === "inactive") {
                  return {
                    style: { color: "red" }
                  };
                }
                else {
                  return {
                    style: { color: "green" }
                  };
                }
              }
            }}
          />
        </Grid>
      </Grid>)}

      {activeButton === 2 && (<Grid container spacing={4}>
        <Grid item xs={12}><br />
          <MUIDataTable
            title={<div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
              <span>{title}</span>
              <span>{currentGroup}</span>
              <span style={{ color: "blue" }}>
                {`There Are ${activeMembers} active members out of ${activeMembers + inActiuveMembers}`}
              </span>
            </div>
            }
            data={datatableData2}
            columns={[
              "S.No.",
              "Name",
              "Current Investment",
              "Profit/Loss(Rs)",
              "Profit/Loss Per Day(Rs)",
              "Total Brokerage(Rs)",
              "Praedico's Virtual Amount(Rs)",
              "Net Amount",
              "Date"
            ]}
            options={{
              selectableRows: false,
              setRowProps: (_row, index) => {
                if (leaderboardList[index].status === "inactive") {
                  return {
                    style: { color: "red" }
                  };
                }
                else {
                  return {
                    style: { color: "green" }
                  };
                }
              }
            }}
          />
        </Grid>
      </Grid>)}
    </>
  );
}


