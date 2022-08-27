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
import { getRequestWithAxios } from '../../service';
import { Divider } from '@mui/material';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserDetails(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  let [activeTabId, setActiveTabId] = React.useState(0);
  const [state, setState] = React.useState([]);
  let id = props.Userdata.id;


  const handleClickOpen = async () => {
    setOpen(true);
    const res = await getRequestWithAxios(`stock/fetchportfoliohistory/${id}`);
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

        <div className='con-p-1'>
          <div className='con-p-11'>
            <img src='https://picsum.photos/id/1025/300/300' alt='myphoto' />
          </div>
          <div className='con-p-12'>
            <div className='con-p-121'>
              <font> Suraj Ojha </font>
              <font style={{ float: "right", backgroundColor: "green", padding: "13px" }} size="4" color='white'>{props.Userdata.status}</font>
            </div>
            <span style={{ float: "right" }}>
              {/* <font color='#2F2E41'>Status : </font> */}
            </span>
            <Divider />
            <div className='con-p-122'>
              <table className='table'>
                <tr><td>E-mail</td><td>{props.Userdata.email}</td></tr>
                <tr><td>Mobile No.</td><td>{props.Userdata.phone}</td></tr>
                <tr><td>Date of Birth</td><td>{props.Userdata.dob}</td></tr>
                <tr><td>Gender</td><td>{props.Userdata.gender}</td></tr>
              </table>
            </div>
          </div>

        </div>

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
