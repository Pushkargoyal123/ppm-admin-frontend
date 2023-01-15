// external dependecies
import { Dialog, Button, Typography, AppBar, Toolbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";

// internal dependecies
import { postRequestWithFetch } from '../../service';
import AddPrize from './AddPrize';
import EditPrize from './EditPrize';
import useStyles from "../dashboard/styles";

// dialog to show, edit or add prize distribution
export default function PrizeDistribution(props) {

    const [prizeList, setPrizeList] = useState([]); // state for storing and showing the profits
    const [openAdd, setOpenAdd] = useState(false); // state for open or close add Modal for prize
    const [openEdit, setOpenEdit] = useState(false); // state for open or close Modal for edit the prizes
    const [clickedPrizeId, setclickedPrizeId] = useState(""); // state for storing id of clicked prize

    // style for dialog header
    const classes = useStyles();

    useEffect(function () {
        fetchPrizeDistribution()
        // eslint-disable-next-line
    }, [props.eventId])

    const columns = [
        "SNO",
        "Members(Rank)",
        "Total (per members) percentage",
        "Priority",
        "status",
        "Action"
    ]

    /**
     * function for open or close the edit Prize modal
     * @param {PrizeId for get the id of clicked prize} prizeId 
     */
    const handleOpenEdit = (prizeId) => {
        setOpenEdit(true);
        setclickedPrizeId(prizeId);
    }

    /**
     * function for fetching prize that should be distributed
     */
    const fetchPrizeDistribution = async () => {
        const body = { ppmDreamNiftyId: props.eventId }
        const data = await postRequestWithFetch("dreamNifty/prize/prizeDistribution", body);
        if (data.success) {
            let sum = 0;
            const finalData = data.data.map(function (item, index) {
                sum += item.participant;
                if (index)
                    item.members = item.participant + " (" + (sum - item.participant) + "-" + sum + ")";
                else
                    item.members = item.participant + " (1-" + sum + ")";
                item.percentage = item.percentDistribution + "% (" + (Math.round(item.percentDistribution / item.participant * 100) / 100) + "%)";
                item.SNO = index + 1;
                item.Priority = item.priority;
                item["Members(Rank)"] = item.members;
                item["Total (per members) percentage"] = item.percentage;
                item.Action = <IconButton aria-label="Edit" onClick = {()=>handleOpenEdit(item.id)}>
                    <EditIcon />
                </IconButton>
                return item;
            })
            setPrizeList(finalData);
        }
    }

    /**
     * function for opening a dialog for adding a prize
     */
    const handleOpenAddDialog = () => {
        setOpenAdd(true)
    }

    return <div>
        <Dialog
            fullScreen
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="responsive-dialog-title"
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => props.setOpen(false)} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Prize Distribution of {props.eventName}
                    </Typography>
                    <Typography variant="h6" style={{marginLeft:30}}>
                        <Button
                            color='secondary'
                            variant='contained'
                            onClick={handleOpenAddDialog}
                        >
                            <AddIcon /> Add New
                        </Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <div>
                <MUIDataTable
                    columns={columns}
                    data={prizeList}
                />
            </div>
        </Dialog>

        <AddPrize
            open={openAdd}
            setOpen={setOpenAdd}
            eventId={props.eventId}
            fetchPrizeDistribution={fetchPrizeDistribution}
            prizeDistribution={prizeList}
        />

        <EditPrize
            open={openEdit}
            setOpen={setOpenEdit}
            eventId={props.eventId}
            fetchPrizeDistribution={fetchPrizeDistribution}
            prizeId={clickedPrizeId}
        />
    </div>
}