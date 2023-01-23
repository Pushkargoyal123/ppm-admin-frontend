import React, { useState, useEffect } from "react";
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import InfoIcon from '@material-ui/icons/Info';
import {
    Button, TableCell, TableRow, Tooltip
} from "@material-ui/core";

import { getRequestWithFetch, postRequestWithFetch } from "../service";
import TableComponent from "../pages/dashboard/components/Table/Table";

export default function UserTransaction(props) {

    const [data, setData] = useState([]);
    const [totalBuyStock, setTotalBuyStock] = useState("");
    const [totalSellStock, setTotalSellStock] = useState("");
    const [totalBuyPrice, setTotalBuyPrice] = useState(0);
    const [totalSellPrice, setTotalSellPrice] = useState(0);

    useEffect(() => {
        const fetchcompanyStockBuySell = async () => {
            let result;
            if(props.eventId){
                const body = {
                    companyCode: props.companyCode,
                    UserId: props.UserId,
                    ppmDreamNiftyId: props.eventId
                }
                result = await postRequestWithFetch("dreamNifty/portfolio/fetchCompanyDetailForAdmin", body);
            }else{
                result = await getRequestWithFetch("stock/fetchCompanyDetailForAdmin?companyCode=" + props.companyCode + "&id=" + props.UserId + "&ppmGroupId=" + props.ppmGroupId);
            }
            let buyStockSum = 0, sellStockSum = 0, buyStockPriceSum = 0, sellStockPriceSum = 0;
            if (result.success) {
                result.data.forEach((item) => {
                    if (item.stocks > 0) {
                        buyStockSum += item.stocks;
                        buyStockPriceSum += item.totalStockPrice;
                    }
                    else {
                        sellStockSum += item.stocks;
                        sellStockPriceSum += item.totalStockPrice;
                    }
                });
                setTotalBuyStock(buyStockSum);
                setTotalSellStock(sellStockSum);
                setTotalBuyPrice(buyStockPriceSum);
                setTotalSellPrice(sellStockPriceSum);

                setData(result.data);
            }
        }
        fetchcompanyStockBuySell();
    }, [props.companyCode, props.UserId, props.ppmGroupId, props.eventId])

    const HistoryColumn = ["S.No.", "Price Per Stock", "Stocks", "Total Stock Price", "Status", "Date", "Time", "Info"];

    const historyRows = data.map(function (r, index) {
        return <TableRow>
            <TableCell> {index + 1}</TableCell>
            <TableCell> {r.pricePerStock} </TableCell>
            <TableCell> {r.stocks} </TableCell>
            <TableCell> {r.totalStockPrice} </TableCell>
            <TableCell>{
                r.totalStockPrice > 0 ?
                    <Button style={{ color: "green", fontWeight: "bold" }}>Buy</Button> :
                    <Button style={{ color: "red", fontWeight: "bold" }}>Sell</Button>}
            </TableCell>
            <TableCell> {r.dateTime.split(" ")[0]} </TableCell>
            <TableCell> {r.dateTime.split(" ")[1]} </TableCell>
            <TableCell>
                <Tooltip title={r.comment}>
                    <InfoIcon style={{ color: r.totalStockPrice > 0 ? "green" : "red" }} />
                </Tooltip>
            </TableCell>
        </TableRow>
    })

    const tableTotal = <>
        <TableRow style={{ backgroundColor: "#74b9ff", color: "black" }}>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={3}>Total Stock Buy : {totalBuyStock}</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={3}>Total Buying Price : {totalBuyPrice.toFixed(2)}</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={2}>
                <Button style={{ background: "green" }} variant="contained" color="primary">BUY</Button>
            </TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: "#81ecec", color: "black" }}>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={3}>Total Stock Sell : {totalSellStock}</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={3}>Total Selling Price : {totalSellPrice.toFixed(2)}</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={2}>
                <Button style={{ background: "red" }} variant="contained" color="primary">SELL</Button>
            </TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: "#2f3542", color: "white" }}>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={3}>Total Stock Left : {totalBuyStock + totalSellStock}</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={3}>Total Selling Price : {(totalBuyPrice + totalSellPrice).toFixed(2)}</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 16 }} colSpan={2}></TableCell>
        </TableRow>
    </>

    return <div style={{ marginTop: 20 }}>
        <div style={{ margin: "0 20px", display:"flex", justifyContent:"space-between" }}>
            <Tooltip title="back">
                <KeyboardBackspaceRoundedIcon
                    color="primary"
                    style={{ border: "1px blue solid", fontSize: "2rem", cursor: "pointer" }}
                    onClick={() => props.setShowTransaction(false)}
                />
            </Tooltip>
            <div
                style={{color:"blue", fontSize: 20, fontWeight: "bold", textDecoration:"underline"}}
                >
                {props.companyCode}
            </div>
            <div></div>
        </div>
        <TableComponent column={HistoryColumn} rows={historyRows} tableTotal={tableTotal} />
    </div>
}