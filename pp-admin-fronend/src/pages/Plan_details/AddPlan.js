import { Box, TextField, Button, Select, MenuItem, Input, Chip, IconButton, Tooltip } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import { getRequestWithFetch, postRequestWithFetch } from "../../service";
import useStyles from "../dashboard/styles";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { notifyError, notifySuccess } from "../../components/notify/Notify";


const states = {
    active: "success",
    inactive: "warning",
    deleted: "default",
};

export default function AddPlan() {

    let classes = useStyles();

    const [rows, setRows] = useState([]);
    const [change, setChange] = useState(0);

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
        const res = await postRequestWithFetch("plans/add", body)
        res.success === true ?
            notifySuccess({ Message: 'New Plan Added', ProgressBarHide: true })
            : notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
            setPlanName('');
            handleList();
        }
        
        const handleUpdatePlan = async (id, status) => {
            const body = {
                id: id,
                planName: planName,
                status: status
            }
            console.table(body)
            const res = await postRequestWithFetch("plans/updatePlan", body)
            res.success === true ?
            notifySuccess({ Message: 'Plan Added Successfully', ProgressBarHide: true })
             :notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
        setChange(0);
        setPlanName('');
        handleList();
    }

    const columns = ["index", "Plan Name", "Status", "CreatedAt", "UpdatedAt"];

    // console.table(rows)

    const data = rows.map((row, index) => {
        if (!row.length) {
            return [
                index + 1,
                change === index + 1 ? (<>
                    <TextField id="outlined-basic" label="Plan Name" variant="outlined" onChange={(e) => setPlanName(e.target.value)} value={planName} placeholder={row.planName} />
                    <IconButton onClick={() => handleUpdatePlan(row.id)}>
                        <DoneIcon color="primary" fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setChange(0)}>
                        <CloseIcon color="error" fontSize="small" />
                    </IconButton>
                </>) : (<>
                    <Tooltip title="Click to Update Plan Name">
                        <Chip onClick={() => setChange(index + 1)} style={{ justifyContent: 'center', padding: '3px', color: 'InfoText' }} label={`${row.planName}`} />
                    </Tooltip>
                </>
                ),
                // row.status,
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    value={row.status}
                    onChange={(event) => { handleUpdatePlan(row.id, event.target.value) }}
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
            {/* <ToastContainer /> */}
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