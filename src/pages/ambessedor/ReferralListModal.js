import { Dialog, AppBar, Typography, IconButton, Toolbar, Slide } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";

import useStyles from "../../components/Modal/styles";
import { getRequestWithFetch } from "../../service";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReferralListModal(props) {

    const [rows, setRows] = useState([]);

    useEffect(function(){
        if(props.user.id){
            fetchALLReferrals();
        }
        // eslint-disable-next-line
    }, [props.user.id])

    const fetchALLReferrals = async() => {
        const data = await getRequestWithFetch("user/fetchAllReferralsForAdmin?UserId="+props.user.id);
        console.log(data);
        if(data.success){
            const finalData = data.data.map(function (item, index) {
                item.SNO = index + 1;
                item["Plan Name"] = item.ppm_subscription_users[0].ppm_subscription_plan.planName;
                item["Plan Price"] = "₹" + item.ppm_subscription_users[0].ppm_subscription_monthly_plan_charge.displayPrice.toFixed(2);
                item["Name"] = item.userName;
                item["Date of Plan Buyed"] = item.ppm_subscription_users[0].startDate;
                return item
            })
            setRows(finalData);
        }
    }

    const classes = useStyles();

    const columns = [
        "SNO",
        "Name",
        "Plan Name",
        "Plan Price",
        "Date of Plan Buyed"
    ]

    return <Dialog fullScreen open={props.open} onClose={() => props.setOpen(false)} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => props.setOpen(false)} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {props.userName}'s Referrals
                </Typography>
                <Typography variant="h6">
                </Typography>
            </Toolbar>
        </AppBar>

        {
            props.user.userName ?
                <div style={{
                    textAlign: "center",
                    color: "blue",
                    fontSize: 20,
                    margin: "20px 0px"
                }}>You have refered {props.user.referrals} {props.user.referrals < 2 ? "person" : "persons"} and for that you earned ₹{props.user.referralWalletBalance}</div> :
                <div></div>
        }

        <MUIDataTable
            data={rows}
            columns={columns}
            options={{
                filterType: "none",
                selectableRows: 'none',
            }}
        />

    </Dialog>
}