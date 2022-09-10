import { Button, Dialog, Slide, Typography, IconButton, Toolbar, AppBar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import CloseIcon from '@material-ui/icons/Close';
import MUIDataTable from "mui-datatables";

import useStyles from './styles';
import { getRequestWithFetch } from "../../service";
// import UserTransaction from "../../context/UserTransaction";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CriticalAnalysisModal(props) {

    const [open, setOpen] = useState();
    const [data, setData] = useState([]);
    // const [showTransaction, setShowTransaction] = useState(false);
    // const [companyCode, setCompanyCode] = useState()

    const classes = useStyles();

    useEffect(function () {

        const fetchAllHistory = async () => {
            const resultHistory = await getRequestWithFetch("criticalanalysis/criticalanalysisdata/" + props.ppmGroupId);
            if (resultHistory.success) {
                const finalData = resultHistory.data.map(function (rowData, index) {
                    rowData.SNO = index + 1
                    rowData.companyName = rowData.companyName + "(" + rowData.companyCode + ")";
                    rowData.averageBuyPrice = "₹" + (rowData.totalBuyPrice / rowData.totalBuyStock).toFixed(2)
                    rowData.PL = (rowData.currentPrice * rowData.totalBuyStock - rowData.totalBuyPrice).toFixed(2)
                    rowData.PLPercent = ((rowData.currentPrice * rowData.totalBuyStock - rowData.totalBuyPrice) * 100 / rowData.totalBuyPrice).toFixed(2)
                    return rowData;
                })
                setData(finalData);
            }
        }
        fetchAllHistory()
    }, [props.ppmGroupId]);

    // const handleCompanyDetail = (tableMeta) => {
    //     console.log(tableMeta)
    //     setShowTransaction(true);
    // }

    const tableColumns = [
        {
            name: "SNO",
            label: "SNO",
            options: {
                customBodyRender: (value, tableMeta) => (
                    <div>{value}</div>
                )
            }
        },
        {
            name: "companyName",
            label: "Company Name",
            // options: {
            //     customBodyRender: (value, tableMeta) => (
            //         <Button color="primary" variant="outlined" onClick={() => handleCompanyDetail(tableMeta.rowIndex)}>{value}</Button>
            //     )
            // }
        },
        {
            name: "userCount",
            label: "Number of users Purchased"
        },
        {
            name: "currentPrice",
            label: "Current Price (Rs)",
            options: {
                customBodyRender: (value, tableMeta) => (
                    <div>₹{value}</div>
                )
            }
        },
        {
            label: "Total Buy Stock",
            name: "totalBuyStock",
        },
        {
            label: "Total Sell Stock",
            name: "totalSellStock",
        },
        {
            name: "averageBuyPrice",
            label: "Average Buy Price",
        },
        {
            name: "PL",
            label: "Profit/Loss",
            options: {
                customBodyRender: (value, tableMeta) => (
                    <div style={{ color: value >= 0 ? value > 0 ? "green" : "orange" : "red" }}>₹{Math.abs(value)}</div>
                )
            }
        },
        {
            name: "PLPercent",
            label: "Profit/Loss(%)",
            options: {
                customBodyRender: (value, tableMeta) => (
                    <div style={{ color: value >= 0 ? value > 0 ? "green" : "orange" : "red" }}>{Math.abs(value)}%</div>
                )
            }
        }
    ]

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return <>
        <Button onClick={handleOpen} color="primary">Critical Analysis</Button>

        <Dialog
            fullScreen
            onClose={handleClose}
            open={open}
            TransitionComponent={Transition}
            aria-labelledby="responsive-dialog-title"
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ textTransform: "uppercase" }} className={classes.title}>
                        {props.groupName}
                    </Typography>
                    <Typography variant="h6">
                    </Typography>
                </Toolbar>
            </AppBar>
            {/* {
                showTransaction ?
                    <UserTransaction
                        setShowTransaction={setShowTransaction}
                        ppmGroupId={props.clickedUserGroup}
                        companyCode={"hello"}
                        UserId={props.userId}
                    /> : */}
                    <MUIDataTable
                        title="Critical Analysis"
                        columns={tableColumns}
                        data={data}
                    />
            {/* } */}
        </Dialog>
    </>
}