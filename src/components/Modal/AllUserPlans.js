import React, { useEffect, useState } from 'react';
import { Dialog, AppBar, Typography, IconButton, Toolbar, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MUIDataTable from 'mui-datatables';

import useStyles from './styles';
import { getRequestWithFetch } from '../../service';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AllUserPlans(props) {

    const classes = useStyles();

    const [rows, setRows] = useState([]);

    useEffect(function () {
        const fetchAllPlans = async () => {
            const data = await getRequestWithFetch("subscription/user/history?ppmUserGroupId=" + props.ppmUserGroupId);
            if (data.success) {
                const finalData = data.data.map(function (item, index) {
                    item.SNO = index + 1;
                    item["Plan Price"] = "₹" + (item.MonthlyPlanDisplayPrice - item.referToDiscountAmount);
                    item["Plan Duration"] = item.ppm_subscription_month.monthValue + " Months";
                    item["Plan Type"] = item.ppm_subscription_plan.planName;
                    item["Status"] = <span style={{ color: item.status === "active" ? "green" : "orange" }}> {item.status}</span>
                    item["Plan Start Date"] = item.startDate;
                    item["Plan End Date"] = item.endDate;
                    return item;
                })
                setRows(finalData);
            }
        }
        fetchAllPlans();
    }, [props.ppmUserGroupId])

    const handleClose = () => {
        props.setOpen(false);
    }

    const columns = [
        "SNO",
        "Plan Price",
        "Plan Duration",
        "Plan Type",
        "Status",
        "Plan Start Date",
        "Plan End Date"
    ]

    return <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {props.userName} Plans History
                </Typography>
                <Typography variant="h6">
                </Typography>
            </Toolbar>
        </AppBar>

        <MUIDataTable
            title={
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
                    <span><font size="4">{props.userName} Plans History</font></span>
                </div>
            }
            data={rows}
            columns={columns}
            options={{
                filterType: "none",
                selectableRows: 'none',
            }}
        />

    </Dialog>
}