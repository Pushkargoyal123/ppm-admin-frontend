import { Box, TextField, Button } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import { getRequestWithFetch, postRequestWithFetch } from "../../service";

export default function AddMonthPlan() {

    const [rows, setRows] = useState([]);
    const [plans, setPlans] = useState([]);
    const [monthValue, setMonthValue] = useState("");

    useEffect(function () {
        monthList();
        planList();
    }, [])

    const monthList = async () => {
        const res = await getRequestWithFetch("plans/monthList");
        if (res.success) {
            setRows(res.data);
        }
    }

    const planList = async () => {
        const data = await getRequestWithFetch("plans/planList");
        if (data.success) {
            data.data.forEach(function (plan) {
                plan.strikePrice = 0;
                plan.displayPrice = 0;
            })
            setPlans(data.data);
        }
    }

    const handleAdd = async () => {
        const body = {
            monthValue: monthValue
        }
        await postRequestWithFetch("plans/addMonth", body)

        plans.forEach(async function (plan) {
            const body = {
                ppmSubscriptionPlanId: plan.id,
                displayPrice: plan.displayPrice,
                strikePrice: plan.strikePrice,
                monthValue: monthValue
            }
            await postRequestWithFetch("plans/addMonthValue", body)
        })
        monthList();
        planList();
    }

    const columns = ["SNO", "Monthly Plan", "Status", "Created At", "Updated At"];

    const data = rows.map((row, index) => {
        if (!row.length) {
            return [
                index + 1,
                row.monthValue,
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

    return <>
        <Box component="span" style={{ padding: "1rem", margin: 'auto' }}>
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
                    return <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <div
                            style={{ margin: 20, fontSize: 16, border: "1px black solid", padding: "5px 30px" }}>{item.planName}
                        </div>

                        <TextField
                            onChange={(event) => handleDisplayPriceChange(event.target.value, index)}
                            value={item.displayPrice}
                            id="standard-basic"
                            type="number"
                            label="Display Price"
                        />
                        <TextField
                            onChange={(event) => handleStrikePriceChange(event.target.value, index)}
                            value={item.strikePrice}
                            id="standard-basic"
                            type="number"
                            label="Strike Price"
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