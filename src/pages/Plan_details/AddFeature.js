import { Box, TextField, Button, Select, Input, Chip, MenuItem, IconButton } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import { getRequestWithFetch, postRequestWithFetch } from "../../service";
import useStyles from "../dashboard/styles";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

const states = {
    active: "success",
    inactive: "warning",
    deleted: "default",
};


export default function AddFeature() {

    let classes = useStyles();
    const [rows, setRows] = useState([]);
    const [featureName, setFeatureName] = useState('');
    const [plans, setPlans] = useState([]);
    const [change, setChange] = useState(0);

    useEffect(() => {
        handleList();
        planList();
    }, [])

    const handleList = async () => {
        const res = await getRequestWithFetch("plans/featureList");
        setRows(res.data)
    }

    const planList = async () => {
        const data = await getRequestWithFetch("plans/planList");
        if (data.success) {
            data.data.forEach(function (plan) {
                plan.planFeature = "YES";
                plan.featureValueDisplay = "";
            })
            setPlans(data.data);
        }
    }

    const handleAdd = async () => {
        const body = {
            featureName: featureName
        }
        await postRequestWithFetch("plans/addFeature", body)

        plans.forEach(async function (plan) {
            const body = {
                ppmSubscriptionPlanId: plan.id,
                featureValue: plan.planFeature,
                featureName: featureName,
                featureValueDisplay: plan.featureValueDisplay
            }
            await postRequestWithFetch("plans/addPlanFeatureList", body)
        })

        setFeatureName('');
        handleList();
        planList();
    }

    const handleUpdateFeature = async (id, status) => {
        const body = {
            id: id,
            featureName: featureName,
            status: status
        }
        await postRequestWithFetch("plans/updateFeature", body)
        setChange(0);
        setFeatureName('');
        handleList();
    }

    const columns = ["index", "Feature Name", "Status", "CreatedAt", "UpdatedAt"];

    const data = rows.map((row, index) => {
        if (!row.length) {
            return [
                index + 1,
                change === index + 1 ? (<>
                    <input style={{ width: "15em", margin: "2px" }} onChange={(e) => setFeatureName(e.target.value)} type="text" value={featureName} placeholder={row.featureName} />
                    <IconButton onClick={() => handleUpdateFeature(row.id)}>
                        <DoneIcon color="primary" fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setChange(0)}>
                        <CloseIcon color="error" fontSize="small" />
                    </IconButton>
                </>) : (<>
                    <Chip onClick={() => setChange(index + 1)} style={{ justifyContent: 'center', padding: '3px', color: 'InfoText' }} label={`${row.featureName}`} />
                </>
                ),
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    value={row.status}
                    onChange={(event) => { handleUpdateFeature(row.id, event.target.value) }}
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

    const handleChange = (value, index) => {
        const finalPlans = plans.map(function (item, itemIndex) {
            if (itemIndex === index) {
                item.planFeature = value
            }
            return item
        })
        setPlans(finalPlans)
    }

    const handleDisplayValueChange = (value, index) => {
        const finalPlans = plans.map(function (item, itemIndex) {
            if (itemIndex === index) {
                item.featureValueDisplay = value
            }
            return item
        })
        setPlans(finalPlans)
    }

    const options = {
        filterType: 'checkbox',
    };

    return (
        <>
            <Box component="span" style={{ padding: "1rem", margin: 'auto' }}>
                <div>
                    <div>
                        <TextField
                            onChange={(e) => setFeatureName(e.target.value)}
                            value={featureName}
                            id="outlined-basic"
                            label="Feature Name"
                            style={{ width: '30rem', }}
                            variant="outlined"
                        />
                        <Button
                            onClick={() => handleAdd()}
                            variant="contained"
                            color="primary"
                            style={{ height: '55px', borderRadius: '0px' }}
                        >
                            Add Feature
                        </Button>
                    </div>
                </div>
                {
                    plans.map(function (item, index) {
                        return <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <div
                                style={{ margin: 20, fontSize: 16, border: "1px black solid", padding: "5px 30px" }}>{item.planName}</div>
                            <div style={{ margin: 20 }}>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="status"
                                    defaultValue={item.planFeature}
                                    onChange={(event) => handleChange(event.target.value, index)}
                                >
                                    <MenuItem value={"YES"}>YES</MenuItem>
                                    <MenuItem value={"NO"}>NO</MenuItem>
                                    <MenuItem value={"OTHER"}>OTHER</MenuItem>
                                </Select>
                            </div>
                            {
                                item.planFeature.toUpperCase() === "OTHER" ?
                                    <TextField
                                        onChange={(event) => handleDisplayValueChange(event.target.value, index)}
                                        value={item.planFeature.featureValueDisplay}
                                        id="standard-basic"
                                        label="Display Value"
                                    /> :
                                    <div></div>
                            }
                        </div>
                    })
                }
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