import React from 'react'
import MUIDataTable from "mui-datatables";
import { Box } from '@material-ui/core';

export default function ambessodorList() {

  const columns = ["Index","Name","Email"];
  const data = [""];
  return (
    <div>
      <Box component="span" style={{ marginTop: '0%', padding: "1rem", margin: 'auto' }}>
        <MUIDataTable
          title={"Month List"}
          data={data}
          columns={columns}
        />
      </Box>
    </div>
  )
}
