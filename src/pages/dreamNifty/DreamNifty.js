// external dependency
import React from 'react';
import MUIDataTable from 'mui-datatables';
import { useEffect, useState } from 'react';
import { IconButton, Input, Select, Tooltip, Button, Grid } from '@material-ui/core';
import { Redeem } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import parse from 'html-react-parser'
import useStyles from "../dashboard/styles";
import EventNoteIcon from '@mui/icons-material/EventNote';
import PeopleIcon from '@material-ui/icons/People';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// internal dependecies
import { postRequestWithFetch } from '../../service';
import CreateEvent from './CreatEvent';
import EditEvent from './EditEvent';
import PrizeDistribution from './PrizeDistribution';
import { Chip, MenuItem } from '@mui/material';
import { notifyError, notifySuccess } from '../../components/notify/Notify';
import CriticalAnalysisModal from '../../components/Modal/CriticalAnalysisModal';
import CallingFullScreenModal from '../../components/Modal/CallingFullScreenModal';
import GroupDetailsModal from '../../components/Modal/GroupDetailsModal';


const states = {
  active: "success",
  inactive: "warning",
  deleted: "default",
};

// Dream Nifty component for showing, adding and updating all events
export default function DreamNifty() {

  let classes = useStyles();

  const [eventList, setEventList] = useState([]); // state for setting and showing all events 
  const [openAddModal, setOpenAddModal] = useState(false); // state for open or close add event modal
  const [openEditModal, setOpenEditModal] = useState(false); // state for open or close edit event modal
  const [openPrizeModal, setOpenPrizeModal] = useState(false); // state for open or close prize distribution modal
  const [openEventDetailModal, setOpenEventDetailModal] = useState(false)
  const [clickedEventId, setClickedEventId] = useState(0); // state for getting event Id of clicked Event
  const [clickedEventName, setClickedEventName] = useState(""); // state for getting name of the event that is clicked
  const [activeButton, setActiveButton] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [inActiuveMembers, setInActiveMembers] = useState(0);
  const [leaderboardList, setLeaderBoardList] = useState([]);
  const [eventMemberList, setEventMemberList] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [eventGroupsList, setEventGroupsList] = useState([]);
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false);

  useEffect(function () {
    fetchDreamNifty()
    // eslint-disable-next-line
  }, [])

  /**
   * function to open prize distribution modal
   *  @param {Id of clicked Event} eventId 
   * @param {name of clicked event} eventName
   */
  const handleOpenPrizeModal = (eventId, eventName) => {
    setOpenPrizeModal(true);
    setClickedEventId(eventId);
    setClickedEventName(eventName);
  }

  /**
   * function to open prize distribution modal
   *  @param {Id of clicked Event} eventId 
   * @param {name of clicked event} eventName
   */
  const handleOpenRegisteredUser = async (eventId, eventName) => {

    setClickedEventName(eventName);
    setClickedEventId(eventId);
    const body = {
      ppmDreamNiftyId: eventId
    }
    const result = await postRequestWithFetch("dreamNifty/user/dreamNiftyUsersList", body);
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
    setEventMemberList(result.data);
    setActiveButton(1);
  }

  /**
   * function for open or close edit event modal
   * @param {Id of clicked Event} eventId 
   * @param {name of clicked event} eventName
   */
  const handleOpenEditModal = (eventId, eventName) => {
    setOpenEditModal(true);
    setClickedEventId(eventId);
    setClickedEventName(eventName);
  }

  // function to update status of event

  const handleUpdateStatus = async (eventId, event) => {

    const res = await postRequestWithFetch(`dreamNifty/dreamNiftyEvent/update`, {
      id: eventId,
      status: event.target.value
    })
    if (res.success === true) {
      fetchDreamNifty();
      notifySuccess({ Message: "Status Updated Successfully.", ProgressBarHide: true })
    } else {
      notifyError({ Message: `${res.error}`, ProgressBarHide: true })
    }
  }

  /**
   * function to open LeaderBorad of a particular event
   * @param {To get the name of event} eventTitle 
   * @param {id of clicked event} ppmDreamNiftyId 
   */
  const LeaderBoardList = async (eventTitle, ppmDreamNiftyId) => {
    setClickedEventId(ppmDreamNiftyId)
    setClickedEventName(eventTitle);
    const body = { registerType: 'pgr', ppmDreamNiftyId: ppmDreamNiftyId };
    const result = await postRequestWithFetch(`dreamNifty/leaderboard/fetchLeaderBoardDataForAdmin`, body);
    let activeMembers = 0, inActiveMembers = 0;
    result.data.forEach(function (item) {
      if (item.status === "inactive") {
        inActiveMembers++;
      } else {
        activeMembers++;
      }
    })
    setInActiveMembers(inActiveMembers);
    setActiveMembers(activeMembers);
    setLeaderBoardList(result.data);
    setActiveButton(2)
  }


  /**
   * function for listing all events
   */
  const fetchDreamNifty = async () => {
    const data = await postRequestWithFetch("dreamNifty/eventList", {});
    if (data.success) {
      const finalData = data.data.map(function (item, index) {
        const status = item.status;
        item.SNO = index + 1;
        item.date = <div>
          {item.startDate}
          <div style={{ marginLeft: 20 }}><b>To</b></div>
          {item.endDate}
        </div>
        item.description = parse(item.description)
        item.Details = <div>
          <b>Members :</b> {item.maxParticipant} <br />
          <b>Total Price :</b> {item.totalRewardPrice}<br />
          <b>Entry Fee :</b> {item.entryFee}<br />
          <b>Virtual Amount :</b> {item.virtualAmount}<br />
        </div>

        item.leaderboard = <Button color="primary" onClick={() => LeaderBoardList(item.title, item.id)}>Leaderboard</Button>

        item.criticalAnalysis = <CriticalAnalysisModal
          ppmDreamNiftyId={item.id}
          title={item.title}
        />

        item.status = <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          value={status}
          onChange={(event) => { handleUpdateStatus(item.id, event) }}
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

        item.Action = <>
          <IconButton onClick={() => handleOpenEditModal(item.id, item.title)} aria-label="Edit">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenPrizeModal(item.id, item.title)} aria-label="Edit">
            <Redeem />
          </IconButton>
          <IconButton onClick={() => handleOpenRegisteredUser(item.id, item.title)}>
            <PeopleIcon />
          </IconButton>
        </>
        return item;
      })
      setEventList(finalData);
    }
  }

  /**
   * Function to view the list of users present in event
   * @param {id of clicked User} id 
   * @param {Name of clicked user} userName 
   */
  const handleUserGroupModal = (id, userName) => {
    setOpenEventDetailModal(true);
    setUserName(userName)
    setUserId(id)
  }

  const columns = [
    {
      name: "SNO",
      label: "SNO",
    },
    {
      name: "title",
      label: "Title",
    },
    {
      name: "date",
      label: "Start Date / End Date (YYYY-MM-DD)",
    },
    {
      name: "description",
      label: "Description"
    },
    {
      name: "Details",
    },
    {
      name: 'leaderboard',
    },
    {
      name: 'criticalAnalysis'
    },
    {
      name: "status",
      label: "Status"
    },
    {
      name: "Action",
    }
  ];

  const datatableData1 = eventMemberList.map((r, index) => {
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
  });

  const datatableData2 = leaderboardList.map((r, index) => {
    return [
      index + 1,
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleUserGroupModal(r.id, r.userName)}
      >
        {r.userName}
      </Button>,
      r.current_investment,
      r.totalCurrentPrice - r.current_investment,
      r.totalCurrentPrice - r.current_investment,
      r.number * 10,
      r.ppm_dream_nifty_users[0].virtualAmount,
      r.ppm_dream_nifty_users[0].netAmount,
      r.dateOfRegistration
    ]
  })

  const title = <IconButton onClick={() => setActiveButton(0)}><ArrowBackIcon /></IconButton>

  return (<>
    {activeButton ? <></> :
      <MUIDataTable
        title={<div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 20, }}> Dream Nifty Events</div>
        </div>}
        data={eventList}
        columns={columns}
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
                <Tooltip title="Create Event">
                  <IconButton className={classes.myClassName} onClick={() => setOpenAddModal(true)}>
                    <EventNoteIcon />
                  </IconButton>
                </Tooltip>
              </span>
            );
          }
        }}
      />
    }
    <CreateEvent
      open={openAddModal}
      setOpen={setOpenAddModal}
      fetchDreamNifty={fetchDreamNifty}
    />

    <EditEvent
      fetchDreamNifty={fetchDreamNifty}
      eventId={clickedEventId}
      open={openEditModal}
      setOpen={setOpenEditModal}
    />

    <PrizeDistribution
      open={openPrizeModal}
      eventId={clickedEventId}
      eventName={clickedEventName}
      setOpen={setOpenPrizeModal}
    />

    <CallingFullScreenModal
      userId={userId}
      setUserId={setUserId}
      userName={userName}
      setUserName={setUserName}
      open={openPortfolioModal}
      eventId={clickedEventId}
      setOpen={setOpenPortfolioModal}
    />

    {
      openEventDetailModal && (<GroupDetailsModal
        open={openEventDetailModal}
        setOpen={setOpenEventDetailModal}
        userId={userId}
        eventId={clickedEventId}
        setClickedUserEvent={setClickedEventId}
        userName={userName}
        setOpenDialog={setOpenPortfolioModal}
        userGroupsList={eventGroupsList}
        setUserGroupsList={setEventGroupsList}
      />)
    }

    {activeButton === 1 && (<Grid container spacing={4}>
      <Grid item xs={12}><br />
        <MUIDataTable

          title={<div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
            <span>{title}</span>
            <span>
              <Button onClick={() => LeaderBoardList(clickedEventName, clickedEventId)} color="primary" variant="contained">Leaderboard</Button>
            </span>
            <span>{clickedEventName}</span>
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
              if (eventMemberList[index].User.status === "inactive") {
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

  </>)
}
