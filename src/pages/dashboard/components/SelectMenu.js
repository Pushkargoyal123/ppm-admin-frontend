import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { postRequestWithFetch } from '../../../service';
import CreateGroup from '../../../components/Modal/CreateGroup';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 75,
    },
}));

export default function SelectMenu(props) {
    const classes = useStyles();
    const [groupData, setGroupData] = React.useState([]);
    const [groupID, setGroupID] = React.useState();
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const handleChange = (event) => {
        setGroupID(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = async () => {
        setOpen(true);
        const res = await postRequestWithFetch('group/list')
        res.success === true && setGroupData(res.data)
    };


    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">{props.groupName}</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={groupID}
                    onChange={handleChange}
                >
                    <MenuItem>
                        <TextField id="standard-basic" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </MenuItem>
                    {

                        groupData.filter((rows) => {
                            if (search === "")
                                return rows
                            else if (`${rows.name.toLowerCase()}-${rows.value.toLowerCase()}`.includes(search.toLowerCase()))
                                return rows
                            else
                                return rows
                        }).map((rows, _index) => {
                            return [
                                <MenuItem value={rows.id}>{`${rows.name} - ${rows.value}`}</MenuItem>,
                            ]
                        })

                    }
                    <CreateGroup />
                </Select>
            </FormControl>
        </div>
    );
}
