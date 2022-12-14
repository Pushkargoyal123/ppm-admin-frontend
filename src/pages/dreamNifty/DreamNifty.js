// external dependency
import React from 'react';
import MUIDataTable from 'mui-datatables';
import { useEffect, useState } from 'react';
import { Button, IconButton, Input, Select } from '@material-ui/core';
import { Redeem } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import parse from 'html-react-parser'
import useStyles from "../dashboard/styles";

// internal dependecies
import { postRequestWithFetch } from '../../service';
import CreateEvent from './CreatEvent';
import EditEvent from './EditEvent';
import PrizeDistribution from './PrizeDistribution';
import { Chip, MenuItem } from '@mui/material';
import { notifyError, notifySuccess } from '../../components/notify/Notify';


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
  const [clickedEventId, setClickedEventId] = useState(0); // state for getting event Id of clicked Event
  const [clickedEventName, setClickedEventName] = useState(""); // state for getting name of the event that is clicked

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
        </>
        return item;
      })
      setEventList(finalData);
    }
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
      name: "status",
      label: "Status"
    },
    {
      name: "Action",
    }
  ]

  return (<>
    <MUIDataTable
      title={<div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 20, fontWeight: "bold", color: "blue" }}> Dream Nifty Events</div>
        <Button color="primary" variant='contained' onClick={() => setOpenAddModal(true)}> <AddIcon /> Create Event</Button>
      </div>}
      data={eventList}
      columns={columns}
    />

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
  </>)
}
