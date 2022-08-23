import { useEffect, useState } from "react"
import { Select, Box, Chip, Input, MenuItem } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import useStyles from "../dashboard/styles"
import { getRequestWithFetch, postRequestWithFetch } from "../../service";
import { notifySuccess, notifyError } from "../../components/notify/Notify";

const states = {
    active: "success",
    inactive: "warning",
    deleted: "default",
};

export default function AddMonthlyPlanCharge() {

    const [chargeList, setChargeList] = useState([]);

    useEffect(function () {
        fetchPlanCharge();
    }, [])

    let classes = useStyles();

    const fetchPlanCharge = async () => {
        const data = await getRequestWithFetch("plans/getMonthlyChargeList");
        if (data.success) {
            setChargeList(data.data);
        }
    }

    const handleUpdateReferralOption = async(id, value) => {
        const body = {id, referralOption : value}
        const data = await postRequestWithFetch("plans/updateReferralOption", body);
        if(data.success){
            fetchPlanCharge();
            notifySuccess({ Message: "Status Updated Successfully.", ProgressBarHide: true })
        }else{
            notifyError({ Message: "OOPS! Server Error", ProgressBarHide: true })
        }
    }

    const handleUpdatePlanChargeStatus = async(id, value) => {
        const body = {id, status: value};
        const data = await postRequestWithFetch("plans/updatePlanChargeStatus", body);
        if(data.success){
            fetchPlanCharge();
            notifySuccess({ Message: "Status Updated Successfully.", ProgressBarHide: true })
        }else{
            notifyError({ Message: "OOPS! Server Error", ProgressBarHide: true })
        }    
    }

    const columns = ["SNO", "Display Price", "Strike Price", "Refer To Percent", "Refer By Percent", "status", "Referral Status", "Plan", "Plan Duration"];

    const data = chargeList.map((row, index) => {
        if (!row.length) {
            return [
                index + 1,
                "₹ " + row.displayPrice,
                "₹ " + row.strikePrice,
                row.referToPercent + " %",
                row.referByPercent + " %",
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    value={row.status}
                    onChange={(event) => { handleUpdatePlanChargeStatus(row.id, event.target.value) }}
                    input={<Input />}
                    renderValue={(selected) => <Chip label={selected} classes={{ root: classes[states[row.status.toLowerCase()]] }}/>}
                >
                    {["active", "inactive", "deleted"].map(
                        (changeStatus) => (
                            <MenuItem key={changeStatus} value={changeStatus}>
                                <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }}/>
                            </MenuItem>
                        )
                    )}
                </Select>,
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    value={row.referralOption}
                    onChange={(event) => { handleUpdateReferralOption(row.id, event.target.value) }}
                    input={<Input />}
                    renderValue={(selected) => <Chip label={selected} classes={{ root: classes[states[row.referralOption.toLowerCase()]] }}/>}
                >
                    {["active", "inactive", "deleted"].map(
                        (changeStatus) => (
                            <MenuItem key={changeStatus} value={changeStatus}>
                                <Chip label={changeStatus} classes={{ root: classes[states[changeStatus.toLowerCase()]] }}/>
                            </MenuItem>
                        )
                    )}
                </Select>,
                row.ppm_subscription_plan.planName,
                row.ppm_subscription_month.monthValue + " Months"
            ]
        } else {
            return [
                <font color='red'>OOPS! No Data Found</font>
            ]
        }
    })

    return <Box component="span" style={{ marginTop: '0%', padding: "1rem", margin: 'auto' }}>
        <MUIDataTable
            title={"Charges According to plans"}
            data={data}
            columns={columns}
        />
    </Box>
}