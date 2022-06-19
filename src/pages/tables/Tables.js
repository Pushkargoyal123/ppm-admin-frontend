import React, { useEffect } from "react";
import { Button, Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';



export default function Tables() {
  const [rows, setRows] = React.useState([]);
  const [activeButton, setActiveButton] = React.useState(0);
  const [groupMemberlist, setGroupMemberList] = React.useState([]);
  const [leaderboardList, setLeaderBoardList] = React.useState([]);

  useEffect(() => {
    const GroupList = async () => {
      const res = await axios.get(`http://localhost:7080/api/group/fetchallgrouplist`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("id_token")
        }
      });
      const data = res.data.data;
      setRows(data);
    }
    GroupList();
  }, []);


  const GroupMemberList = async (groupId) => {
    const body = {
      ppmGroupid: groupId
    }
    const result = await axios.post(`http://localhost:7080/api/user/groupmemberlist`, body, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("id_token")
      },
    });
    // console.log('-----------------', result.data.data);
    setGroupMemberList(result.data.data);
    setActiveButton(1)
  }

  const LeaderBoardList = async (registerType,groupId) => {
    const result = await axios.get(`http://localhost:7080/api/leaderboard/fetchleaderboarddata/${registerType}?groupId=${groupId}`, {
      
      headers: {
        Authorization: "Bearer " + localStorage.getItem("id_token")
      },
    });
    // console.log('------------++++-----', result.data.data);
    setLeaderBoardList(result.data.data);
    setActiveButton(2)
  }

  // profitloss 
  // profitloss 

  const datatableData2 = leaderboardList.map((r, index) => {
    return [
      index + 1,
      r.userName,
      r.current_investment,
      r.totalCurrentPrice-r.current_investment,
      r.totalCurrentPrice-r.current_investment,
      r.number*10,
      r.ppm_userGroups[0].virtualAmount,
      r.ppm_userGroups[0].netAmount,
      r.dateOfRegistration
    ]
  })

  const datatableData1 = groupMemberlist.map((r, index) => {
    return [
      index + 1,
      r.User.userName,
      r.User.email,
    ]
  })

  const datatableData = rows.map((rows, index) => {
    return [
      <Button onClick={() => LeaderBoardList(rows.name,rows.id)} color="primary">Leaderboard</Button>,
      index + 1,
      <Button onClick={() => { GroupMemberList(rows.id) }} variant="outlined" color="primary">{rows.name + "-" + rows.value}</Button>,
      rows.ppm_userGroups[0].TotalMembers,
      rows.createdAt,
      rows.ppm_portfoliohistories[0].ActiveUser,
      rows.ppm_portfoliohistories[0].minDate,
    ]
  })

  const title = <IconButton onClick={() => setActiveButton(0)}><ArrowBackIcon /></IconButton>

  return (
    <>
      {activeButton === 0 && (<Grid container spacing={4}>
        <Grid item xs={12}><br />
          <MUIDataTable
            title={"Groups"}
            data={datatableData}
            columns={["Leaderboard", "S.No.", "Group", "Total Members", "Starting Registration Date", "Total Active User", "Starting buying Date"]}
            options={{
              filterType: "none",
            }}
          />
        </Grid>
      </Grid>)}

      {activeButton === 1 && (<Grid container spacing={4}>
        <Grid item xs={12}><br />
          <MUIDataTable
            title={[title," Group Members"]}
            data={datatableData1}
            columns={["S.No.", "Name", "Email-ID"]}
            options={{
              filterType: "none",
            }}
          />
        </Grid>
      </Grid>)}

      {activeButton === 2 && (<Grid container spacing={4}>
        <Grid item xs={12}><br />
          <MUIDataTable
            title={[title," LeaderBoard"]}
            data={datatableData2}
            columns={["S.No.", "Name", "Current Investment","Profit/Loss(Rs)","Profit/Loss Per Day(Rs)","Total Brokerage(Rs)","Praedico's Virtual Amount(Rs)","Net Amount","Date"]}
            options={{
              filterType: "none",
            }}
          />
        </Grid>
      </Grid>)}
    </>
  );
}


