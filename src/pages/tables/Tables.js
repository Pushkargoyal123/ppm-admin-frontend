import React, { useEffect, useState } from "react";
import { Button, Chip, Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { getRequestWithAxios, postRequestWithFetch } from "../../service";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';

import CreateGroup from "../../components/Modal/CreateGroup";
import CallingFullScreenModal from "../../components/Modal/CallingFullScreenModal";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { notifyError, notifySuccess } from "../../components/notify/Notify";

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
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [change, setChange] = useState(0);
  const [virtualAmount, setVirtualAmount] = useState('')

  useEffect(() => {
    GroupList();
  }, []);

  const GroupList = async () => {
    const res = await getRequestWithAxios("group/fetchallgrouplist");
    setRows(res.data.data);
  }

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


  const handleUpdateVirtualAmount = async (groupId) => {
    const body = {
      virtualAmount: virtualAmount,
      groupId: groupId
    }
    const res = await postRequestWithFetch('http://localhost:7080/api/group/update', body);
    res.success === true ? notifySuccess({ Message: "Virtual Amount Updated", ProgressBarHide: true }) : notifyError({ Message: "Oops! Some Error Occurs.", ProgressBarHide: true })
    GroupList()
  }
  // profitloss 

  const callingFullScreenModal = async (id, userName) => {
    setOpen(true);
    setUserName(userName)
    setUserId(id)
  }

  const datatableData2 = leaderboardList.map((r, index) => {
    return [
      index + 1,
      <Button
        variant="outlined"
        color="primary"
        onClick={() => callingFullScreenModal(r.id, r.userName)}>
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
        onClick={() => callingFullScreenModal(r.User.id, r.User.userName)}>
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

      change === index + 1 ? (<>
        <input style={{ width: "6em", margin: "2px" }} onChange={(e) => setVirtualAmount(e.target.value)} min="0" type="number" value={virtualAmount} placeholder={row.virtualAmount} />
        <IconButton onClick={() => handleUpdateVirtualAmount(row.id)}>
          <DoneIcon color="primary" fontSize="small" />
        </IconButton>
        <IconButton onClick={() => setChange(0)}>
          <CloseIcon color="error" fontSize="small" />
        </IconButton>
      </>)
        : <Chip onClick={() => setChange(index + 1)} style={{ justifyContent: 'center', padding: '3px', color: 'InfoText' }} label={`${row.virtualAmount}`} />,

      // row.virtualAmount,
      row.ppm_userGroups.length ? row.ppm_userGroups[0].TotalMembers : "------",
      row.createdAt.split('T')[0],
      row.ppm_portfoliohistories.length ? row.ppm_portfoliohistories[0].ActiveUser : "------",
      row.ppm_portfoliohistories.length ? row.ppm_portfoliohistories[0].minDate.split(' ')[0] : "------",
    ]
  })

  const title = <IconButton onClick={() => setActiveButton(0)}><ArrowBackIcon /></IconButton>

  return (
    <>
      <CallingFullScreenModal
        userId={userId}
        setUserId={setUserId}
        userName={userName}
        setUserName={setUserName}
        open={open}
        setOpen={setOpen}
      />

      {activeButton === 0 && (<Grid container spacing={4}>
        <Grid item xs={12}><br />
          <MUIDataTable
            title={
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
                <span><font size="4">Groups</font></span>
                <span><CreateGroup /></span>
              </div>
            }

            data={datatableData}
            columns={["Leaderboard", "S.No.", "Group", "virtualAmount", "Total Members", "Starting Registration Date", "Total Active User", "Starting buying Date"]}
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


