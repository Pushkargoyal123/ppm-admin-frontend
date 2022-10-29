// external dependecies
import { Dialog, DialogContent, DialogTitle, Fab, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { useEffect, useState } from 'react';

// internal dependecies
import { postRequestWithFetch } from '../../service';

// dialog to show, edit or add prize distribution
export default function PrizeDistribution(props) {

    const [prizeList, setPrizeList] = useState([]); // state for storing and showing the profits
    const [openAdd, setOpenAdd] = useState(false); // state for open or close add Modal for prize

    useEffect(function () {
        fetchPrizeDistribution()
        // eslint-disable-next-line
    }, [props.eventId])

    /**
     * function for fetching prize that should be distributed
     */
    const fetchPrizeDistribution = async () => {
        const body = { ppmDreamNiftyId: props.eventId }
        const data = await postRequestWithFetch("dreamNifty/prizeList", body);
        console.log(data);
        if (data.success) {
            setPrizeList(data.data);
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
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle>
                <div>Prize Distribution</div>
                <div style={{ margin: "0px 20px" }}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        onClick={handleOpenAddDialog}
                    > 
                        <AddIcon /> Add New
                    </Button>
                </div>
                <div>
                    <Fab size="small" style={{ background: "white" }} aria-label="add">
                        <CloseIcon onClick={() => props.setOpen(false)} />
                    </Fab>
                </div>
            </DialogTitle>
            <DialogContent>
                {
                    prizeList.length ?
                        <div></div> :
                        <div style={{ textAlign: "center" }}> There is no prize added </div>
                }
            </DialogContent>
        </Dialog>
    </div>
}