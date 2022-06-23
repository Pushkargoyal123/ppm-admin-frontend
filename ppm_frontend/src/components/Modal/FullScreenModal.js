import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { UserPortfolio } from '../../context/UserContext';
import { CssBaseline, Tab, TableCell, TableRow, Tabs, Tooltip } from '@material-ui/core';
import useStyles from './styles';
import TableComponent from '../../pages/dashboard/components/Table/Table';
import axios from 'axios';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  let [activeTabId, setActiveTabId] = React.useState(0);
  const [state, setState] = React.useState([]);
  let id = props.Userdata.id;


  const handleClickOpen = async () => {
    setOpen(true);
    const res = await axios.get(`http://localhost:7080/api/stock/fetchportfoliohistory/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("id_token")
      }
    })
    setState(res.data.data);
  };


  const handleClose = () => {
    setOpen(false);
  };

  const HistoryColumn = ["Trans_id", "Company", "Status", "Stocks", "Date/Time"];

  const HistoryRows = state.map((rows) => (
    <TableRow key={rows.id}>
      <TableCell>{1000 + rows.id}</TableCell>
      <TableCell>{rows.companyName}<b>({rows.companyCode})</b></TableCell>
      {
        rows.totalbuyStock === 0 ? (
          <>
            <TableCell><font color='red'>SELL</font></TableCell>
            <TableCell>{rows.totalSellStock}</TableCell>
          </>
        ) : (
          <>
            <TableCell><font color='#1bd611'>BUY</font></TableCell>
            <TableCell>{rows.totalBuyStock}</TableCell>
          </>
        )
      }
      <TableCell>{rows.dateTime.split(' ')[0]}</TableCell>
    </TableRow>
  ))

  console.log(HistoryRows);

  return (
    <div>
      <CssBaseline />
      <Tooltip title="User Portfolio">
        <IconButton>
          <ReceiptIcon onClick={handleClickOpen} />
        </IconButton>
      </Tooltip>


      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              User Portfolio
            </Typography>
            <Typography variant="h6">
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.formContainer}>
          <div className={classes.form}>

            <Tabs
              value={activeTabId}
              onChange={(e, id) => setActiveTabId(id)}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="User Portfolio" classes={{ root: classes.tab }} />
              <Tab label="User Transaction" classes={{ root: classes.tab }} />
            </Tabs>
            {activeTabId === 0 && (
              <UserPortfolio Userdata={props.Userdata} />
            )}
            {activeTabId === 1 && (
              <TableComponent column={HistoryColumn} rows={HistoryRows} />
            )}

          </div>
        </div>
      </Dialog>
    </div>
  );
}
