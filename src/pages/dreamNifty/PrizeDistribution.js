// external dependecies
import { Dialog, DialogContent, DialogTitle, Fab } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export default function PrizeDistribution(props) {

    return <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="responsive-dialog-title"
    >
        <DialogTitle>
            <div>Add New Event</div>
            <div>
                <Fab size="small" style={{ background: "white" }} aria-label="add">
                    <CloseIcon onClick={() => props.setOpen(false)} />
                </Fab>
            </div>
        </DialogTitle>
        <DialogContent>
        </DialogContent>
    </Dialog>
}