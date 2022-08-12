import { Button, Fab, Chip, MenuItem, Select, Input } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MUIDataTable from "mui-datatables";

import { getRequestWithFetch, postRequestWithFetch } from "../../service";
import AddCollegeModal from "./AddCollegeModal";
import EditCollegeModal from "./EditCollegeModal";

export default function College() {

  const [colleges, setColleges] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [clickedItem, setClickedItem] = useState({});

  useEffect(function () {
    fetchAllColleges()
    // eslint-disable-next-line
  }, []);

  const fetchAllColleges = async() => {
    const data = await getRequestWithFetch("college/collegeList");
    if (data.success) {
      const finalData = data.data.map(function (item, index) {
        return [
          <div style={{ display: "flex" }}>
            <Fab size="small" color="default" aria-label="add" onClick={() => handleEditModal(item)}>
              <EditIcon />
            </Fab>
            <Fab size="small" color="default" onClick={() => handleDelete(item)}>
              <DeleteIcon />
            </Fab>
          </div>,
          index + 1,
          item.name,
          item.shortName,
          item.email,

          <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            value={item.status}
            onChange={(event) => { handleUpdateStatus(event.target.value, item) }}
            input={<Input />}
            renderValue={(selected) => <Chip label={selected} />}
          >
            {["active", "inactive"].map(
              (changeStatus) => (
                <MenuItem key={changeStatus} value={changeStatus}>
                  <Chip label={changeStatus} />
                </MenuItem>
              )
            )}
          </Select>,

          item.contactPerson,
          item.contactNumber,
          item.dateOfRegistration
        ]
      })
      setColleges(finalData);
    }
  }

  const handleUpdateStatus = async(value, item) => {
    const body = {
      status : value,
      id : item.id
    }
    await postRequestWithFetch("college/updateCollegeStatus", body);
    fetchAllColleges();
  }

  const handleDelete = (item) => {
    Swal.fire({
      title: 'Are you sure you want to delete',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const data = await postRequestWithFetch("college/delete", { id: item.id });
        if (data.success) {
          Swal.fire('Deleted', '', 'success');
          fetchAllColleges();
        } else {
          Swal.fire({
            icon: "error",
            text: "!oops server error"
          })
        }
      } else if (result.isDenied) {
        Swal.fire('Record is safe', '', 'info')
      }
    })
  }

  const handleEditModal = (item) => {
    setClickedItem(item);
    setOpenEditModal(true);
  }

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpenAddModal(true)}
        style={{ marginBottom: 20 }}>
        <AddIcon /> Add College
      </Button>

      <MUIDataTable
        title={"Membership Levels"}
        data={colleges}
        columns={["actions", "S.No.", "College Name", "Short Name", "College Email", "Status", "Conatact Person", "Phone Number", "Date of Registration"]}
        options={{
          selectableRows: 'none',
          selectableRowsOnClick: true,
        }}
      />

      <AddCollegeModal openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} fetchAllColleges={fetchAllColleges} />
      <EditCollegeModal openAddModal={openEditModal} setOpenAddModal={setOpenEditModal} fetchAllColleges={fetchAllColleges} clickedItem={clickedItem} />
    </div>
  );
}