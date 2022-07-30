import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';
import DialogBox from './DialogBox';
import AddPlan from '../AddPlan';
import AddFeature from '../AddFeature';
import AddPlanFeature from '../AddPlanFeature';
import AddMonthPlan from '../AddMonthPlan';

export default function SimpleMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const [open4, setOpen4] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton aria-haspopup="true" onClick={(e) => handleClick(e)}>
                <AddIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem>
                    <DialogBox open={open1} setOpen={() => setOpen1(!open1)} AppBarTitle={'Subscription Plans'} ButtonName={'Add Plan'} Component={<AddPlan />} />
                </MenuItem>
                <MenuItem>
                    <DialogBox open={open2} setOpen={() => setOpen2(!open2)} AppBarTitle={'Subscription Feature'} ButtonName={'Add Feature'} Component={<AddFeature />} />
                </MenuItem>
                <MenuItem>
                    <DialogBox open={open3} setOpen={() => setOpen3(!open3)} AppBarTitle={'Subscription PlansFeature'} ButtonName={'Add Plan Features'} Component={<AddPlanFeature />} />
                </MenuItem>
                <MenuItem>
                    <DialogBox open={open4} setOpen={() => setOpen4(!open4)} AppBarTitle={'Monthly Plans'} ButtonName={'Add Month'} Component={<AddMonthPlan />} />
                </MenuItem>
            </Menu>
        </div>
    );
}
