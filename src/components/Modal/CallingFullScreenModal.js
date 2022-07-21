import React, { useState, useEffect } from "react";
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import { Tab, TableCell, TableRow, Tabs, Button, Slide, TableFooter } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MUIDataTable from "mui-datatables";
import IconButton from '@material-ui/core/IconButton';

import { getRequestWithAxios, postRequestWithFetch } from "../../service";
import TableComponent from '../../pages/dashboard/components/Table/Table';
import UserTransaction from "../../context/UserTransaction";
import useStyles from './styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CallingFullScreenModal(props) {

    const [UserPortfolioHistory, setUserPortfolioHistory] = useState([]);
    const [userTransactionHistory, setUserTransactionHistory] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [activeTabId, setActiveTabId] = useState(0);
    const [showTransaction, setShowTransaction] = useState(false);
    const [count, setCount] = useState(0);
    const [virtualAmount, setVirtualAmount] = useState(0);
    const [totalPL, setTotalPL] = useState(0);
    const [totalBuyPrice, setTotalBuyPrice] = useState(0);
    const [totalStock, setTotalStock] = useState("");
    const [totalCurrentPrice, setTotalCurrentPrice] = useState(0);

    console.log(count,virtualAmount,totalBuyPrice,totalPL,totalCurrentPrice,totalStock);

    useEffect(function () {
        const callingFullScreenModal = async (id) => {
            if (props.open) {
                const res1 = await getRequestWithAxios(`stock/fetchportfoliohistory/${id}`);

                const res2 = await getRequestWithAxios(`stock/fetchusertransactionhistoryForAdmin/${id}`);
                setUserTransactionHistory(res2.data.data);

                let totalBuyPrice = 0, stockLeft = 0, totalCurrentPrice = 0, count = 0, totalProfitLoss = 0;
                res1.data.data.forEach(function (item, _index) {
                    item.averageBuyingPrice = item.totalBuyingPrice / item.totalBuyStock;
                    item.totalBuyingPrice = item.totalBuyingPrice - item.totalSellingPrice;
                    item.PL = item.totalCurrentPrice - item.totalBuyingPrice;
                })
                res1.data.data.forEach(function (item, _index) {
                    totalProfitLoss += item.PL
                    totalBuyPrice += item.totalBuyingPrice;
                    stockLeft += parseInt(item.stockLeft);
                    totalCurrentPrice += parseFloat(item.totalCurrentPrice);
                    count += item.count;
                })
                setTotalBuyPrice(totalBuyPrice);
                setTotalStock(stockLeft);
                setTotalCurrentPrice(totalCurrentPrice);
                setTotalPL(totalProfitLoss);
                setCount(count);
                setUserPortfolioHistory(res1.data.data);

                const result = await postRequestWithFetch("user/findvirtualamountyuserid", { userId: id });
                if (result.success)
                    setVirtualAmount(result.data.virtualAmount.toFixed(2));
            }
        }

        callingFullScreenModal(props.userId);
    }, [props.userId, props.open])

    const classes = useStyles();

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleGetTransaction = (companyCode, _userId) => {
        setShowTransaction(true);
        setCompanyName(companyCode);
    }

    const HistoryColumn = ["S.No.", "Company Code", "Average Buying Price", "Total Buying Price", "Stock Left", "Current Price", "Total Current Price", "Profit/Loss"];

    const HistoryRows = UserPortfolioHistory.map((rows, index) => (
        [
            index + 1,
            <Button variant="outlined" color="primary" onClick={() => handleGetTransaction(rows.companyCode, rows.id)}>{rows.companyName}<b>({rows.companyCode})</b> </Button>,
            rows.averageBuyingPrice.toFixed(2),
            rows.totalBuyingPrice.toFixed(2),
            rows.stockLeft,
            rows.currentPrice,
            rows.totalCurrentPrice.toFixed(2),
            <span style={{ color: rows.PL > 0 ? "green" : rows.PL < 0 ? "red" : "orange" }}>{rows.PL.toFixed(2)}</span>
        ]
    ))

    const transactionHistoryColumn = ["Trans_id", "Company", "Status", "Stocks", "Date/Time"];

    const TransactionHistoryRows = userTransactionHistory.map((rows) => ([
        1000 + rows.id,
        rows.companyName + "(" + rows.companyCode + ")",
        rows.buyStock === 0 ? (
                <TableCell><font color='red'>SELL</font></TableCell>
        ) : (
                <TableCell><font color='#1bd611'>BUY</font></TableCell>
        ),
        rows.buyStock === 0 ? (
            <TableCell>{rows.sellStock}</TableCell>
        ) : (
            <TableCell>{rows.buyStock}</TableCell>
        ),
        rows.dateTime.split(' ')[0]
    ]
    ))

    return <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {props.userName} Transaction History
                </Typography>
                <Typography variant="h6">
                </Typography>
            </Toolbar>
        </AppBar>

        {
            showTransaction ? <UserTransaction setShowTransaction={setShowTransaction} companyCode={companyName} UserId={props.userId} /> :
                <div className={classes.formContainer}>
                    <div className={classes.form}>
                        <Tabs
                            value={activeTabId}
                            onChange={(_e, id) => setActiveTabId(id)}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="User Portfolio" classes={{ root: classes.tab }} />
                            <Tab label="User Transaction" classes={{ root: classes.tab }} />
                        </Tabs>

                        {activeTabId === 0 && (
                            // <TableComponent column={HistoryColumn} rows={HistoryRows} tableTotal={tableTotal} />
                            <MUIDataTable
                                title={
                                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
                                        <span><font size="4">User Portfolio</font></span>
                                    </div>
                                }

                                data={HistoryRows}
                                columns={HistoryColumn}
                                options={{
                                    filterType: "none",
                                    selectableRows: 'none',
                                    customFooter: (
                                        count,
                                    ) => {
                                        return (
                                            <>
                                                <TableRow style={{ backgroundColor: "skyblue" }}>
                                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }}>Total</TableCell>
                                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }} >{totalBuyPrice.toFixed(2)}</TableCell>
                                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }} >{totalStock}</TableCell>
                                                    <TableCell style={{ fontWeight: "bold", fontSize: 16 }} >{totalCurrentPrice.toFixed(2)}</TableCell>
                                                    <TableCell style={{ fontWeight: "bold", fontSize: 20 }} >  ₹{totalPL.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={8}>
                                                        <div style={{ margin: 10, textAlign: "center" }}>Current Invested Amount : <span style={{ color: "red" }}>₹{totalBuyPrice.toFixed(2)}</span></div>
                                                        <div style={{ margin: 10, textAlign: "center" }}>Total Brokerage Charge : <span style={{ color: "red" }}>₹{count * 10} </span></div>
                                                        <div style={{ margin: 10, textAlign: "center" }}>Amount left in your bucket for buying stocks : <span style={{ color: "red" }}>₹{virtualAmount}</span></div>
                                                        <div style={{ margin: 10, textAlign: "center" }}>Net Amount : <span style={{ color: "red" }}>₹{(parseFloat(totalBuyPrice) + parseFloat(virtualAmount) + totalPL).toFixed(2)}</span></div>
                                                        <div style={{ margin: 10, color: totalPL > 0 ? "green" : "red", textAlign: "center" }}>{props.userName} is in {totalPL > 0 ? "Profit" : "Loss"} of ₹{totalPL.toFixed(2)}</div>
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )
                                    }
                                }}
                            />
                        )}
                        {activeTabId === 1 && (
                            <MUIDataTable
                                title={
                                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
                                        <span><font size="4">User Transaction</font></span>
                                    </div>
                                }

                                data={TransactionHistoryRows}
                                columns={transactionHistoryColumn}
                                options={{
                                    filterType: "none",
                                    selectableRows: 'none',
                                }}
                            />
                        )}

                    </div>
                </div>
        }
    </Dialog>
}