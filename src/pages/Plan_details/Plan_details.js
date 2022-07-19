import React, { useEffect, useState } from "react";
import { Button, Grid, Menu, MenuItem } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';

import { getRequestWithFetch } from "../../service";
import AddPlanDialog from "./AddPlanDialog";

// components

const datatableData = [
  ["1", "SILVER", ["1 Month", <br />, "3 Month", <br />, "6 Month", <br />, "12 Month"],
    [<strong><del style={{ fontWeight: 100, color: 'grey' }}>₹499/</del>&nbsp;₹249/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹999/</del>&nbsp;₹499/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹1999/</del>&nbsp;₹999/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹3999/</del>&nbsp;₹1999/- (-50%)</strong>],
    <Button variant="contained" color="primary">UserList</Button>],
  ["2", "GOLD", ["1 Month", <br />, "3 Month", <br />, "6 Month", <br />, "12 Month"],
    [<strong><del style={{ fontWeight: 100, color: 'grey' }}>₹999/</del>&nbsp;₹499/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹2499/</del>&nbsp;₹1249/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹3999/</del>&nbsp;₹1999/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹5999/</del>&nbsp;₹2999/- (-50%)</strong>],
    <Button variant="contained" color="primary">UserList</Button>],
  ["3", "DIAMOND", ["1 Month", <br />, "3 Month", <br />, "6 Month", <br />, "12 Month"],
    [<strong><del style={{ fontWeight: 100, color: 'grey' }}>₹1999/</del>&nbsp;₹999/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹4999/</del>&nbsp;₹2499/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹7999/</del>&nbsp;₹3999/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹11999/</del>&nbsp;₹5999/- (-50%)</strong>],
    // <Button variant="contained" color="primary">UserList</Button>
  ],
  ["4", "PLATINUM", ["1 Month", <br />, "3 Month", <br />, "6 Month", <br />, "12 Month"],
    [<strong><del style={{ fontWeight: 100, color: 'grey' }}>₹3999/</del>&nbsp;₹1999/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹9999/</del>&nbsp;₹4999/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹15999/</del>&nbsp;₹7999/- (-50%)</strong>,
    <br />,
    <strong><del style={{ fontWeight: 100, color: 'grey' }}>₹23999/</del>&nbsp;₹11999/- (-50%)</strong>]
    // <Button variant="contained" color="primary">UserList</Button>
  ],
];

const column = [
  { name: 'id', label: 'S.No', options: { filter: false, sort: true, } },
  { name: 'Plan', label: 'Plan', width: 205, options: { filter: true, sort: true, } },
  { name: 'Duration', label: 'Duration', width: 205, options: { filter: false, sort: true, } },
  { name: 'Price', label: 'Price', width: 205, options: { filter: false, sort: true, } },
  // { name: 'details', label: 'details', width: 205, options: { filter: false, sort: true, } },
]

// ["S.No", "Plan", "Duration", "Price", "details"]

export default function Plan_Details() {

  const [anchorAdd, setAnchorAdd] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(function () {
    fetchAllPlans();
  }, [])

  const fetchAllPlans = async () => {
    const data = await getRequestWithFetch("plans/fetchAllPlans");
    console.log(data);
  }

  return (
    <>
    <AddPlanDialog setOpen={setOpen} open={open}/>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={<div style={{
              display:"flex",
              justifyContent:"space-between"
            }}>
              <div style={{fontSize:20}}> Subscription Plan Details </div>
              <div>
                <AddCircleSharpIcon 
                  aria-controls="simple-menu" 
                  aria-haspopup="true" 
                  style={{ fontSize: 35, fontWeight: 800, cursor: "pointer" }} 
                  color="primary" 
                  onClick={(event) => setAnchorAdd(event.currentTarget)} 
                />
                <Menu
                  id="simple-menu"
                  anchorEl={anchorAdd}
                  keepMounted
                  open={Boolean(anchorAdd)}
                  onClose={() => setAnchorAdd(null)}
                >
                  <MenuItem onClick={() => setOpen(true)}>Add New Plan</MenuItem>
                  <MenuItem onClick={() => setAnchorAdd(null)}>Add New Feature</MenuItem>
                </Menu>
              </div>
            </div>}
            data={datatableData}
            columns={column}
            options={{
              filterType: "checkbox",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
