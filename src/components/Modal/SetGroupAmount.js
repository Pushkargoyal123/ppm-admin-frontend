import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TextField } from '@material-ui/core';
import { postRequestWithFetch } from '../../service';


export default function SetGroupAmount(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [virtualAmount, setVirtualAmount] = React.useState(0)

  const handleUpdate = async () => {
    const res = await postRequestWithFetch(`group/update`, {
      groupId: props.group.groupId + "",
      virtualAmount: virtualAmount
    })
    // console.log(res.data);
    if (res.data !== '') {
      props.handleChangeGroup(props.group.registerType, props.group.id);
      props.setOpen(false);
    }
  }

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open responsive dialog
      </Button> */}
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {`Set Virtual Amount for Group ${props.group.registerType}-${props.group.groupValue}`}
        </DialogTitle>
        <DialogContent style={{ height: "10rem", width: "30rem", }}>
          <DialogContentText>
            <form style={{ margin: "3rem", width: "20rem" }}>
              <TextField type="number" minLength="0" value={virtualAmount} onChange={(e) => setVirtualAmount(e.target.value)} id="outlined-basic" label="Virtual Amount" variant="outlined" />
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => { props.setOpen(false) }}>
            Cancel
          </Button>
          <Button onClick={() => { handleUpdate() }} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
