import React, { useEffect, useState } from "react";
import { Button, Chip, Grid, Input, Menu, MenuItem, Select, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { getRequestWithAxios, postRequestWithFetch } from "../../service";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import useStyles from "../dashboard/styles";
import CreateGroup from "../../components/Modal/CreateGroup";
import GroupDetailsModal from "../../components/Modal/GroupDetailsModal";
import CallingFullScreenModal from "../../components/Modal/CallingFullScreenModal";
import CriticalAnalysisModal from "../../components/Modal/CriticalAnalysisModal";
import { notifyError, notifySuccess, notifyWarning } from "../../components/notify/Notify";


const states = {
  active: "success",
  inactive: "warning",
  deleted: "default",
};

export default function Group() {
  let classes = useStyles();


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event, registerType, value, groupId) => {
    setAnchorEl(event.currentTarget);
    setCurrentGroup(registerType + "-" + value);
    setGroupId(groupId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [openGroupDetailModal, setOpenGroupDetailModal] = useState(false)
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
  const [userGroupsList, setUserGroupsList] = useState([]);
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const [openCriticalAnalysisModal, setOpenCriticalAnalysisModal] = useState(false);

  useEffect(() => {
    GroupList();
  }, []);

  const GroupList = async () => {
    const res = await getRequestWithAxios("group/fetchallgrouplist");
    setRows(res.data.data);
  }

  const GroupMemberList = async (registerType, value, groupId) => {
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
    setGroupId(groupId);
    setCurrentGroup(registerType + '-' + value);
    setInActiveMembers(inActiveMembers);
    setActiveMembers(activeMembers);
    setGroupMemberList(result.data);
    setActiveButton(1)
  }

  const LeaderBoardList = async () => {
    const result = await getRequestWithAxios(`leaderboard/fetchLeaderBoardDataForAdmin/${currentGroup.split('-')[0]}?groupId=${groupId}`);
    if (result.data.data) {
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
  }


  const handleUpdateVirtualAmount = async (groupId) => {
    const body = {
      virtualAmount: virtualAmount,
      groupId: groupId
    }
    const res = await postRequestWithFetch('group/update', body);
    res.success === true ? notifySuccess({ Message: "Virtual Amount Updated", ProgressBarHide: true }) : notifyError({ Message: "Oops! Some Error Occurs.", ProgressBarHide: true })
    GroupList()
    setChange(0)
  }

  const handleUserGroupModal = (id, userName) => {
    setOpenGroupDetailModal(true);
    setUserName(userName)
    setUserId(id)
  }

  const handleUpdate = async (groupId, event) => {
    const res = await postRequestWithFetch(`group/update`, {
      groupId: `${groupId}`,
      status: event.target.value
    })
    if (res.success === true) {
      GroupList()
      notifySuccess({ Message: "Status Updated Successfully.", ProgressBarHide: true })
    } else {
      notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
    }
  }

  const datatableData2 = leaderboardList.map((r, index) => {
    return [
      index + 1,
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleUserGroupModal(r.id, r.userName)}>
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
        onClick={() => handleUserGroupModal(r.User.id, r.User.userName)}
      >
        {r.User.userName}
      </Button>,
      r.User.email,
    ]
  })

  const datatableData = rows.map((row, index) => {
    return [
      index + 1,
      <Button onClick={() => { GroupMemberList(row.name, row.value, row.id) }} variant="outlined" color="primary">{row.name + "-" + row.value}</Button>,

      change === index + 1 ?
        !row.ppm_portfoliohistories.length ?
          (<>
            <input style={{ width: "6em", margin: "2px" }} onChange={(e) => setVirtualAmount(e.target.value)} min="0" type="number" defaultValue={row.virtualAmount} />
            <IconButton onClick={() => handleUpdateVirtualAmount(row.id)}>
              <DoneIcon color="primary" fontSize="small" />
            </IconButton>
            <IconButton onClick={() => setChange(0)}>
              <CloseIcon color="error" fontSize="small" />
            </IconButton>
          </>)
          :
          <Tooltip title="Virtual Amount Can't Update When User Active in Group">
            <Chip onClick={() => notifyWarning({ Message: "Virtual Amount Can't Update When User Active in Group", ProgressBarHide: true })} style={{ justifyContent: 'center', padding: '3px', color: 'InfoText' }} label={`${row.virtualAmount}`} />
          </Tooltip>
        :
        <Tooltip title="Click to update Virtual Amount ">
          <Chip onClick={() => setChange(index + 1)} style={{ justifyContent: 'center', padding: '3px', color: 'InfoText' }} label={`${row.virtualAmount}`} />
        </Tooltip>,

      row.ppm_userGroups.length ? row.ppm_userGroups[0].TotalMembers : "------",
      row.createdAt.split('T')[0],
      row.ppm_portfoliohistories.length ? row.ppm_portfoliohistories[0].ActiveUser : "------",
      row.ppm_portfoliohistories.length ? row.ppm_portfoliohistories[0].minDate.split(' ')[0] : "------",

      row.value ? <Select
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        value={row.status}
        onChange={(event) => { handleUpdate(row.id, event) }}
        input={<Input />}
        renderValue={(selected) => <Chip label={selected} classes={{ root: classes[states[row.status.toLowerCase()]] }} />}
      >
        {["active", "inactive", "deleted"].map(
          (changeStatus) => (
            <MenuItem key={changeStatus} value={changeStatus}>
              <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }} />
            </MenuItem>
          )
        )}
      </Select> :
        <span style={{ color: "green" }}>{row.status}</span>,

      // for Group details
      row.value ? <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={Boolean(anchorEl) ? 'long-menu' : undefined}
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
          aria-haspopup="true"
          onClick={(event) => handleClick(event, row.name, row.value, row.id)}
        >
          <MoreVertIcon />
        </IconButton>
      </div> :
        <div></div>
      // **** end ****
    ]
  })

  const title = <IconButton onClick={() => setActiveButton(0)}><ArrowBackIcon /></IconButton>

  const handleOpenCreateGroupModal = () => {
    setOpenCreateGroupModal(true);
    setGroupId(null);
  }

  const handleUpdateGroup = () => {
    setOpenCreateGroupModal(true); 
    handleClose();
  }

  return (
    <>
      <CallingFullScreenModal
        userId={userId}
        setUserId={setUserId}
        userName={userName}
        setUserName={setUserName}
        open={open}
        clickedUserGroup={groupId}
        setOpen={setOpen}
      />

      {activeButton ? <></> : (<Grid container spacing={4}>
        <Grid item xs={12}><br />
          <MUIDataTable
            title={"Groups"}

            data={datatableData}
            columns={["S.No.", "Group", "virtualAmount", "Total Members", "Starting Registration Date", "Total Active User", "Starting buying Date", "Group Status", "Action"]}
            options={{
              filterType: "none",
              selectableRows: 'none',
              customToolbar: () => {
                return (
                  <span style={{
                    display: "flex",
                    alignItems: 'center',
                    float: 'right'
                  }}>
                    <Tooltip title="Create New Group">
                      <IconButton onClick={handleOpenCreateGroupModal}>
                        <GroupAddIcon />
                      </IconButton>
                    </Tooltip>
                  </span>
                );
              }
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
                <Button onClick={() => LeaderBoardList()} color="primary" variant="contained">Leaderboard</Button>
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
      </Grid>)
      }

      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            // maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem>
          <Button onClick={() => handleUpdateGroup()} color='primary'>
            Update Group
          </Button>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => setOpenCriticalAnalysisModal(true)} color='primary'>
            Critical Analysis
          </Button>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Button onClick={() => LeaderBoardList()} color="primary">Leaderboard</Button>
        </MenuItem>
      </Menu>

      <GroupDetailsModal
          open={openGroupDetailModal}
          setOpen={setOpenGroupDetailModal}
          userId={userId}
          setClickedUserGroup={setGroupId}
          userName={userName}
          setOpenDialog={setOpen}
          userGroupsList={userGroupsList}
          setUserGroupsList={setUserGroupsList}
        />

      <CriticalAnalysisModal 
          ppmGroupId={groupId} 
          groupName={currentGroup} 
          open={openCriticalAnalysisModal}
          setOpen={setOpenCriticalAnalysisModal}
        />

       <CreateGroup
        groupId={groupId}
        GroupList={GroupList}
        handleClose={handleClose}
        open={openCreateGroupModal}
        setOpen={setOpenCreateGroupModal}
      />
    </>
  );
}


