import React from "react";
import { Button, Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

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
  { name: 'Duration', label: 'Duration', width: 205, options: { filter: false , sort: true, } },
  { name: 'Price', label: 'Price', width: 205, options: { filter: false, sort: true, } },
  // { name: 'details', label: 'details', width: 205, options: { filter: false, sort: true, } },
]

// ["S.No", "Plan", "Duration", "Price", "details"]

export default function Plan_Details() {
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Subscription Plan Details"
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
