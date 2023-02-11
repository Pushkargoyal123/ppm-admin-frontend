import { Box, TextField, Button, InputLabel, Select, Chip, MenuItem, FormControl, makeStyles, Input } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import { getRequestWithFetch, postRequestWithFetch } from "../../service";
import useStyles from "../dashboard/styles";
import { notifyError, notifySuccess } from "../../components/notify/Notify";


const states = {
    "YES": "success",
    "NO": "warning",
    "OTHER": "default",
};

const useStyles1 = makeStyles((theme) => ({
    formControl: {
        // margin: theme.spacing(1),
        margin: "4px 4px",
        minWidth: 120,
        width: "30rem"
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function AddPlanFeature() {
    const classes = useStyles1();
    const classess = useStyles();

    const [rows, setRows] = useState([]);
    const [planList, setPlanList] = useState([]);
    const [featureList, setFeatureList] = useState([]);
    const [featureValue, setFeatureValue] = useState('');
    const [featureValueDisplay, setFeatureValueDisplay] = useState('');
    const [planId, setPlanId] = useState('');
    const [featureId, setFeatureId] = useState('');

    useEffect(() => {
        handleList();
    }, [])

    const handleList = async () => {
        const planFeature = await getRequestWithFetch("subscription/planFeature/AllList");
        const plan = await getRequestWithFetch("subscription/plan/list");
        const feature = await getRequestWithFetch("subscription/feature/list");
        setRows(planFeature.data);
        setPlanList(plan.data);
        setFeatureList(feature.data);
    }

    const handleAdd = async () => {
        const body = {
            featureValue: featureValue,
            featureValueDisplay: featureValueDisplay,
            planId: planId,
            featureId: featureId
        }
        console.table(body);
        const res = await postRequestWithFetch("subscription/planFeature/add", body)
        res.success === true ?
            notifySuccess({ Message: 'Plan Feature Added Successfully', ProgressBarHide: true })
            : notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
        setFeatureValue('');
        setFeatureValueDisplay('');
        setPlanId('');
        setFeatureId('');
        handleList();
    }

    const handleUpdatePlanFeature = async (id, e) => {
        const body = {
            id: id,
            featureValue: e.target.value,
            featureValueDisplay: featureValueDisplay
        }
        console.table(body)
        const res = await postRequestWithFetch("subscription/planFeature/update", body)
        res.success === true ?
            notifySuccess({ Message: "Plan Feature Updated Successfully.", ProgressBarHide: true })
            : notifyError({ Message: "Oops! Some error occurred.", ProgressBarHide: true })
        handleList();
    }

    const columns = planList.map((row) => {
        const featureName = "Feature Name"
        return (
            featureName,
            row.planName
        )
    })

    const data = rows.map((row, _index) => {
        // console.table(row)
        return [
            row.featureName,
            ...row.ppm_subscription_plan_features.map((planFeature) => {
                return (


                    <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        value={planFeature.featureValue}
                        onChange={(event) => { handleUpdatePlanFeature(planFeature.id, event) }}
                        input={<Input />}
                        renderValue={(selected) => <Chip label={selected} classess={{ root: classess[states[planFeature.featureValue.toUpperCase()]] }} />}
                    >
                        {["YES", "NO", "OTHER"].map(
                            (changeStatus) => (
                                <MenuItem key={changeStatus} value={changeStatus}>
                                    <Chip label={changeStatus} classess={{ root: classess[states[planFeature.featureValue.toUpperCase()]] }} />
                                </MenuItem>
                            )
                        )}
                    </Select>
                )
            })
        ]
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
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Select Plan</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={planId}
                                    onChange={(e) => setPlanId(e.target.value)}
                                >
                                    {planList.map((plan) => {
                                        return (
                                            <MenuItem value={plan.id}>{plan.planName}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Select Feature</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={featureId}
                                    onChange={(e) => setFeatureId(e.target.value)}
                                >
                                    {featureList.map((feature) => {
                                        return (
                                            <MenuItem value={feature.id}>{feature.featureName}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </div>

                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Feature Value</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={featureValue}
                                    onChange={(e) => setFeatureValue(e.target.value)}
                                >
                                    <MenuItem value="YES">YES </MenuItem>
                                    <MenuItem value="NO">NO</MenuItem>
                                    <MenuItem value="OTHER">OTHER</MenuItem>

                                </Select>
                            </FormControl>
                        </div>

                        {featureValue === "OTHER" && <div>
                            <TextField onChange={(e) => setFeatureValueDisplay(e.target.value)} value={featureValueDisplay} id="outlined-basic" label="Enter Feature Value Display" style={{ width: '30rem', margin: "4px 4px" }} />
                        </div>}


                        <div>
                            <Button onClick={() => handleAdd()} variant="contained" color="primary" style={{ height: '55px', width: "30rem", margin: "4px 4px" }}>
                                Add Plan Feature
                            </Button>
                        </div>
                    </form>
                </div >
            </Box >
            <Box component="span" style={{ marginTop: '0%', padding: "1rem", margin: 'auto' }}>
                <MUIDataTable
                    title={"Plan Feature List"}
                    data={data}
                    columns={["Feature Name", ...columns]}
                    options={options}
                />
            </Box>
        </>
    )
}