import { TextField, Fab } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

// showing error message of red colours
const errorStyle = {
    color: "red",
    fontSize: 14
}

export default function AddPrizeFields(props) {

    return <fieldset style={{ position: 'relative' }}>
        <legend>{props.count}</legend>
        <Fab
            onClick={() => props.handleRemovePrize(props.count)}
            color="primary"
            size='small'
            style={{ position: 'absolute', top: -20, right: -20 }}
        >
            <CloseIcon />
        </Fab>
        <div style={{ margin: "10px 0px", width: 340 }}>
            <div style={errorStyle}>{props.memberError}</div>
            <TextField
                fullWidth
                value={props.member}
                onChange={(e) => props.setMember(e.target.value, props.count)}
                type='number'
                label="Members"
                variant="outlined"
            />
        </div>
        <div style={{ margin: "10px 0px", width: 340 }}>
            <div style={errorStyle}>{props.percentageError}</div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                    fullWidth
                    value={props.percentage}
                    onChange={(e) => props.setPercentage(e.target.value, props.count)}
                    type='number'
                    label="Percentage Distribution"
                    variant="outlined"
                />
                <span style={{ fontSize: 20, fontWeight: 600 }}> % </span>
            </div>
        </div>
        <div style={{ margin: "10px 0px", width: 340 }}>
            <div style={errorStyle}>{props.priorityError}</div>
            <TextField
                fullWidth
                value={props.priority}
                onChange={(e) => props.setPriority(e.target.value, props.count)}
                type='number'
                label="Priority"
                variant="outlined"
            />
        </div>
    </fieldset>
}