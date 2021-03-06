import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import SimpleMenu from "./component/Menu";
import { getRequestWithFetch } from "../../service";


// components

const options = {
  filterType: 'none',
  selectableRows: 'none',
  customToolbar: () => {
    return (
      <SimpleMenu />
    );
  }
};


export default function Plan_Details() {

  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    const handlePlanFeatures = async () => {
      const res = await getRequestWithFetch("plans/AllPlanFeatureList");
      setRows(res.data)
    }
    handlePlanFeatures();
  }, [])

  const columns = ["Name", "Company", "City", "State"];

  const data = rows.map((_row, _index) => {

    return [

    ]
  })


  return (
    <>
      <MUIDataTable
        title={"Membership Levels"}
        data={data}
        columns={columns}
        options={options}
      />
    </>
  );
}
