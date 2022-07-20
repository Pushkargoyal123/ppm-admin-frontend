import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { AppBar, IconButton, makeStyles } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { Typography } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogBox(props) {
    const classes = useStyles();


    return (
        <div>
            <Button color="inherit" onClick={() => props.setOpen(true)}>
                {props.ButtonName}
            </Button>
            <Dialog fullScreen open={props.open} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => props.setOpen(false)} aria-label="close">
                            <ClearIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {props.AppBarTitle}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {props.Component}
            </Dialog>
        </div>
    );
}
