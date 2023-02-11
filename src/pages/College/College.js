import { Button, Chip, MenuItem, Select, Input, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MUIDataTable from "mui-datatables";

import { getRequestWithFetch, postRequestWithFetch } from "../../service";
import AddCollegeModal from "./AddCollegeModal";
import EditCollegeModal from "./EditCollegeModal";
import CollegeUsersListModal from "./CollegeUsersListModal";
import { notifyError, notifyInfo, notifySuccess } from "../../components/notify/Notify";


export default function College() {

  const [colleges, setColleges] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [clickedItem, setClickedItem] = useState({});
  const [openUsersModal, setOpenUsersModal] = useState(false);

  useEffect(function () {
    fetchAllColleges()
    // eslint-disable-next-line
  }, []);

  const fetchAllColleges = async () => {
    const data = await getRequestWithFetch("college/get/college");
    if (data.success) {
      const finalData = data.data.map(function (item, index) {
        return [
          <div style={{ display: "flex" }}>
            <IconButton size="large" color="default" title="adit" onClick={() => handleEditModal(item)}>
              <EditIcon />
            </IconButton>
            <IconButton size="large" color="default" title="delete" onClick={() => handleDelete(item)}>
              <DeleteIcon />
            </IconButton>
          </div>,
          index + 1,
          item.name,
          <Button variant="outlined" onClick={() => handleOpenUsersModal(item)}>{item.shortName} </Button>,
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

  const handleOpenUsersModal = (row) => {
    setOpenUsersModal(true);
    setClickedItem(row);
  }

  const handleUpdateStatus = async (value, item) => {
    const body = {
      status: value,
      id: item.id
    }
    const res = await postRequestWithFetch("college/updateStatus", body);
    if (res.success === true) {
      notifySuccess({ Message: 'College Updated Successfully', ProgressBarHide: true })
    } else {
      notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
    }
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
          notifySuccess({ Message: 'College Deleted Successfully', ProgressBarHide: true })
          fetchAllColleges();
        } else {
          Swal.fire({
            icon: "error",
            text: "!oops server error"
          })

          notifyError({ Message: "Oops! Server Error.", ProgressBarHide: true })
        }
      } else if (result.isDenied) {
        Swal.fire('Record is safe', '', 'info')
        notifyInfo({ Message: 'Record is safe', ProgressBarHide: true })
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
        style={{ marginBottom: 20 }}
      >
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

      <AddCollegeModal
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        fetchAllColleges={fetchAllColleges}
      />
      <EditCollegeModal
        openAddModal={openEditModal}
        setOpenAddModal={setOpenEditModal}
        fetchAllColleges={fetchAllColleges}
        clickedItem={clickedItem}
      />
      <CollegeUsersListModal
        row={clickedItem}
        open={openUsersModal}
        setOpen={setOpenUsersModal}
      />
    </div>
  );
}