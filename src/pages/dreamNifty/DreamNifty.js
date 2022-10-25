// external dependency
import React from 'react';
import MUIDataTable from 'mui-datatables';
import { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import parse from 'html-react-parser'


// internal dependecies
import { postRequestWithFetch } from '../../service';
import CreateEvent from './CreatEvent';
import EditEvent from './EditEvent';

export default function DreamNifty() {

  const [eventList, setEventList] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(function () {
    fetchDreamNifty()
  }, [])

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
          <EditEvent eventId={item.id} />
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
    />
  </>)
}
