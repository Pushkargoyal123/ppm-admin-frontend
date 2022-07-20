import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';
import DialogBox from './DialogBox';
import AddPlan from '../AddPlan';
import AddFeature from '../AddFeature';
import AddPlanFeature from '../AddPlanFeature';

export default function SimpleMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);

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
                <MenuItem><DialogBox open={open} setOpen={setOpen} AppBarTitle={'Subscription Plans'} ButtonName={'Add Plan'} Component={<AddPlan />} /></MenuItem>
                <MenuItem><DialogBox open={open} setOpen={setOpen} AppBarTitle={'Subscription Feature'} ButtonName={'Add Feature'} Component={<AddFeature />} /></MenuItem>
                <MenuItem><DialogBox open={open} setOpen={setOpen} AppBarTitle={'Subscription PlansFeature'} ButtonName={'Add Plan Features'} Component={<AddPlanFeature />} /></MenuItem>
            </Menu>
        </div>
    );
}
