import { Box, TextField, Button, Select, MenuItem, Input, Chip } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import { getRequestWithFetch, postRequestWithFetch } from "../../service";
import useStyles from "../dashboard/styles";

const states = {
    active: "success",
    inactive: "warning",
    deleted: "default",
};

export default function AddPlan() {

    let classes = useStyles();

    const [rows, setRows] = useState([]);
    const [planName, setPlanName] = useState('');

    useEffect(() => {
        handleList();
    }, [])

    const handleList = async () => {
        const res = await getRequestWithFetch("plans/planList");
        setRows(res.data)
    }

    const handleAdd = async () => {
        const body = {
            planName: planName
        }
        await postRequestWithFetch("plans/add", body)
        setPlanName('');
        handleList();
    }

    const handleUpdatePlan = async (id, e) => {
        const body = {
            id: id,
            planName: planName,
            status: e.target.value
        }
        await postRequestWithFetch("plans/updatePlan", body)
        handleList();
    }

    const columns = ["index", "Plan Name", "Status", "CreatedAt", "UpdatedAt"];

    // console.table(rows)

    const data = rows.map((row, index) => {
        if (!row.length) {
            return [
                index + 1,
                row.planName,
                // row.status,
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    value={row.status}
                    onChange={(event) => { handleUpdatePlan(row.id, event) }}
                    input={<Input />}
                    renderValue={(selected) => <Chip label={selected} classes={{ root: classes[states[row.status.toLowerCase()]] }} />}
                >
                    {["active", "inactive", "deleted"].map(
                        (changeStatus) => (
                            <MenuItem key={changeStatus} value={changeStatus}>
                                <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }} />
                            </MenuItem>
                        )
                    )}
                </Select>,

                row.createdAt.split('T')[0],
                row.updatedAt.split('T')[0]
            ]
        } else {
            return [
                <font color='red'>OOPS! No Data Found</font>
            ]
        }

    })

    const options = {
        filterType: 'checkbox',
    };

    return (
        <>
            <Box component="span" style={{ padding: "1rem", margin: 'auto' }}>
                <div>
                    <form>
                        <div>
                            <TextField onChange={(e) => setPlanName(e.target.value)} value={planName} id="outlined-basic" label="Plan Name" style={{ width: '30rem', }} variant="outlined" />
                            <Button onClick={() => handleAdd()} variant="contained" color="primary" style={{ height: '55px', borderRadius: '0px' }}>
                                Add Plan
                            </Button>
                        </div>
                    </form>
                </div>
            </Box>
            <Box component="span" style={{ marginTop: '0%', padding: "1rem", margin: 'auto' }}>
                <MUIDataTable
                    title={"Plan List"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </Box>
        </>
    )
}