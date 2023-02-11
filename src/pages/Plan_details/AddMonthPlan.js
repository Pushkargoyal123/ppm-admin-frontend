import { Box, TextField, Button, Select, Chip, MenuItem, Input } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";

import { getRequestWithFetch, postRequestWithFetch } from "../../service";
import useStyles from "../dashboard/styles";
import { notifyError, notifySuccess } from "../../components/notify/Notify";

const states = {
    active: "success",
    inactive: "warning",
    deleted: "default",
};

export default function AddMonthPlan() {

    let classes = useStyles();

    const [rows, setRows] = useState([]);
    const [plans, setPlans] = useState([]);
    const [monthValue, setMonthValue] = useState("");

    useEffect(function () {
        monthList();
        planList();
    }, [])

    const monthList = async () => {
        const res = await getRequestWithFetch("subscription/month/list");
        if (res.success) {
            setRows(res.data);
        }
    }

    const planList = async () => {
        const data = await getRequestWithFetch("subscription/plan/list");
        if (data.success) {
            data.data.forEach(function (plan) {
                plan.strikePrice = 0;
                plan.displayPrice = 0;
                plan.referToDiscountPercent = 0;
                plan.referByDiscountPercent = 0;
            })
            setPlans(data.data);
        }
    }

    const handleAdd = async () => {
        const body = {
            monthValue: monthValue
        }
        const res = await postRequestWithFetch("subscription/month/add", body)
        let res1;
        plans.forEach(async function (plan) {
            const body = {
                ppmSubscriptionPlanId: plan.id,
                displayPrice: plan.displayPrice,
                strikePrice: plan.strikePrice,
                monthValue: monthValue,
                referToPercent: plan.referToDiscountPercent,
                referByPercent: plan.referByDiscountPercent
            }
            res1 = await postRequestWithFetch("subscription/planCharge/add", body)
        })
        if (res.success === true || res1.success === true) {
            notifySuccess({ Message: "Month Added Succesfully", ProgressBarHide: true })
        } else {
            notifyError({ Message: "!Oops Some error Occure ", ProgressBarHide: true })
        }
        monthList();
        planList();
    }

    const handleUpdateMonthlyPlan = async (id, status) => {
        const body = {
            id: id,
            status: status
        }
        const res = await postRequestWithFetch('subscription/month/update', body)
        console.log(res.success);
        res.success === true ?
            notifySuccess({ Message: "Month Status Updated Successfully", ProgressBarHide: true })
            :
            notifyError({ Message: "!Oops Some error Occure ", ProgressBarHide: true })

    }

    const columns = ["SNO", "Monthly Plan", "Status", "Created At", "Updated At"];

    const data = rows.map((row, index) => {
        if (!row.length) {
            return [
                index + 1,
                row.monthValue,
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    value={row.status}
                    onChange={(event) => { handleUpdateMonthlyPlan(row.id, event.target.value) }}
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

    const handleDisplayPriceChange = (value, index) => {
        const finalPlans = plans.map(function (item, itemIndex) {
            if (itemIndex === index) {
                item.displayPrice = value
            }
            return item
        })
        setPlans(finalPlans)
    }

    const handleStrikePriceChange = (value, index) => {
        const finalPlans = plans.map(function (item, itemIndex) {
            if (itemIndex === index) {
                item.strikePrice = value
            }
            return item
        })
        setPlans(finalPlans)
    }

    const handleReferToDiscountPercentageChange = (value, index) => {
        const finalPlans = plans.map(function (item, itemIndex) {
            if (itemIndex === index) {
                item.referToDiscountPercent = value
            }
            return item
        })
        setPlans(finalPlans)
    }

    const handleReferByDiscountPercentageChange = (value, index) => {
        const finalPlans = plans.map(function (item, itemIndex) {
            if (itemIndex === index) {
                item.referByDiscountPercent = value
            }
            return item
        })
        setPlans(finalPlans)
    }

    return <>
        <Box component="span" style={{ padding: "1rem", margin: 'auto', textAlign: "center" }}>
            <div>
                <div>
                    <TextField
                        onChange={(e) => setMonthValue(e.target.value)}
                        value={monthValue}
                        id="outlined-basic"
                        type="number"
                        label="Monthly Plan"
                        style={{ width: '30rem' }}
                        variant="outlined"
                    />
                    <Button
                        onClick={() => handleAdd()}
                        variant="contained"
                        color="primary"
                        style={{ height: '55px', borderRadius: '0px' }}
                    >
                        Add Month Plan
                    </Button>
                </div>
            </div>
            {
                plans.map(function (item, index) {
                    return <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: 20 }}>
                        <div
                            style={{ margin: 20, fontSize: 16, border: "1px black solid", padding: "5px 30px" }}>{item.planName}
                        </div>

                        <TextField
                            onChange={(event) => handleDisplayPriceChange(event.target.value, index)}
                            value={item.displayPrice}
                            id="standard-basic"
                            type="number"
                            label="Display Price"
                            style={{ margin: "0px 10px" }}
                        />
                        <TextField
                            onChange={(event) => handleStrikePriceChange(event.target.value, index)}
                            value={item.strikePrice}
                            id="standard-basic"
                            type="number"
                            label="Strike Price"
                            style={{ margin: "0px 10px" }}
                        />
                        <TextField
                            onChange={(event) => handleReferToDiscountPercentageChange(event.target.value, index)}
                            value={item.referToDiscountPercent}
                            id="standard-basic"
                            type="number"
                            label="Refer To Discount Percent"
                            style={{ margin: "0px 10px" }}
                        />
                        <TextField
                            onChange={(event) => handleReferByDiscountPercentageChange(event.target.value, index)}
                            value={item.referByDiscountPercent}
                            id="standard-basic"
                            type="number"
                            label="Refer By Discount Percent"
                            style={{ margin: "0px 10px" }}
                        />
                    </div>
                })
            }
        </Box>
        <Box component="span" style={{ marginTop: '0%', padding: "1rem", margin: 'auto' }}>
            <MUIDataTable
                title={"Month List"}
                data={data}
                columns={columns}
            />
        </Box>
    </>
}