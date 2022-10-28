// external dependency
import React from 'react';
import MUIDataTable from 'mui-datatables';
import { useEffect, useState } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { Redeem } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import parse from 'html-react-parser'


// internal dependecies
import { postRequestWithFetch } from '../../service';
import CreateEvent from './CreatEvent';
import EditEvent from './EditEvent';
import PrizeDistribution from './PrizeDistribution';

// Dream Nifty component for showing, adding and updating all events
export default function DreamNifty() {

  const [eventList, setEventList] = useState([]); // state for setting and showing all events 
  const [openAddModal, setOpenAddModal] = useState(false); // state for open or close add event modal
  const [openEditModal, setOpenEditModal] = useState(false); // state for open or close edit event modal
  const [openPrizeModal, setOpenPrizeModal] = useState(false); // state for open or close prize distribution modal
  const [clickedEventId, setClickedEventId] = useState(0); // state for getting event Id of clicked Event

  useEffect(function () {
    fetchDreamNifty()
    // eslint-disable-next-line
  }, [])

  /**
   * function to open prize distribution modal
   */
  const handleOpenPrizeModal = () => {
    setOpenPrizeModal(true);
  }

  /**
   * function for open or close edit event modal
   * @param {Id of clicked Event} eventId 
   */
  const handleOpenEditModal = (eventId) => {
    setOpenEditModal(true);
    setClickedEventId(eventId);
  }

  /**
   * function for listing all events
   */
  const fetchDreamNifty = async () => {
    const data = await postRequestWithFetch("dreamNifty/eventList", {});
    if (data.success) {
      const finalData = data.data.map(function (item, index) {
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
        item.Action = <>
          <IconButton onClick={()=>handleOpenEditModal(item.id)} aria-label="Edit">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleOpenPrizeModal} aria-label="Edit">
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
      setOpen={setOpenPrizeModal}
    />
  </>)
}
