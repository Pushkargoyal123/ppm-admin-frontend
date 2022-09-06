import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        width: '100%',
        padding: "10rem"

    },
    typography: {
        fontSize: "8em"
    }
});

export default function Avatars(props) {
    const classes = useStyles();
    const name = props.UserName.split('')[0];

    function randomColor() {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        let color = "#" + hex.toString(16);

        return color;
    }

    return (
        <Stack direction="row" spacing={2}>
            <Avatar className={classes.root} sx={{ bgcolor: randomColor() }} variant="square">

                <Typography className={classes.typography} variant="h1" component="h2">
                    {name.toUpperCase()}
                </Typography>

            </Avatar>
        </Stack>
    );
}