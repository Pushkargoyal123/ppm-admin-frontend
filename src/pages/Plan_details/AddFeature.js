import { Box, TextField, Button, MenuItem, Select } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import { getRequestWithFetch, postRequestWithFetch } from "../../service";

export default function AddFeature() {

    const [rows, setRows] = useState([]);
    const [featureName, setFeatureName] = useState('');
    const [plans, setPlans] = useState([]);

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
                featureName: featureName
            }
            await postRequestWithFetch("plans/addPlanFeatureList", body)
        })

        setFeatureName('');
        handleList();
    }

    const columns = ["index", "Feature Name", "Status", "CreatedAt", "UpdatedAt"];

    const data = rows.map((row, index) => {
        if (!row.length) {
            return [
                index + 1,
                row.featureName,
                row.status,
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
        plans.forEach(function (item, itemIndex) {
            if (itemIndex === index) {
                item.planFeature = value
            }
        })
        setPlans(plans)
    }

    const options = {
        filterType: 'checkbox',
    };

    return (
        <>
            <Box component="span" style={{ padding: "1rem", margin: 'auto' }}>
                <div>
                    <div>
                        <TextField onChange={(e) => setFeatureName(e.target.value)} value={featureName} id="outlined-basic" label="Feature Name" style={{ width: '30rem', }} variant="outlined" />
                        <Button onClick={() => handleAdd()} variant="contained" color="primary" style={{ height: '55px', borderRadius: '0px' }}>
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