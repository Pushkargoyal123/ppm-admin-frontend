import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
    container: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    logotypeContainer: {
        backgroundColor: theme.palette.primary.main,
        width: "60%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("md")]: {
            width: "50%",
        },
        [theme.breakpoints.down("md")]: {
            display: "none",
        },
    },
    logotypeImage: {
        width: 165,
        marginBottom: theme.spacing(4),
    },
    logotypeText: {
        color: "white",
        fontWeight: 500,
        fontSize: 84,
        [theme.breakpoints.down("md")]: {
            fontSize: 48,
        },
    },
    formContainer: {
        width: "100%",
        // height: "100%",
        display: "flex",
        margin: "5em 0 0 0 ",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
    },
    form: {
        // width: '100%',
        margin: 'auto',
        minWidth: '60%',
        border: '2px solid #536DFE',
        padding: '10px',
    },
    tab: {
        fontWeight: 400,
        fontSize: 16,
    },
    greeting: {
        fontWeight: 500,
        textAlign: "center",
        marginTop: theme.spacing(4),
    },
    subGreeting: {
        fontWeight: 500,
        textAlign: "center",
        marginTop: theme.spacing(2),
    },
    googleButton: {
        marginTop: theme.spacing(6),
        boxShadow: theme.customShadows.widget,
        backgroundColor: "white",
        width: "100%",
        textTransform: "none",
    },
    googleButtonCreating: {
        marginTop: 0,
    },
    googleIcon: {
        width: 30,
        marginRight: theme.spacing(2),
    },
    creatingButtonContainer: {
        marginTop: theme.spacing(2.5),
        height: 46,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    createAccountButton: {
        height: 46,
        textTransform: "none",
    },
    formDividerContainer: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        display: "flex",
        alignItems: "center",
    },
    formDividerWord: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    formDivider: {
        flexGrow: 1,
        height: 1,
        backgroundColor: theme.palette.text.hint + "40",
    },
    errorMessage: {
        textAlign: "center",
    },
    textFieldUnderline: {
        "&:before": {
            borderBottomColor: theme.palette.primary.light,
        },
        "&:after": {
            borderBottomColor: theme.palette.primary.main,
        },
        "&:hover:before": {
            borderBottomColor: `${theme.palette.primary.light} !important`,
        },
    },
    textField: {
        borderBottomColor: theme.palette.background.light,
    },
    formButtons: {
        width: "100%",
        marginTop: theme.spacing(4),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    forgetButton: {
        textTransform: "none",
        fontWeight: 400,
    },
    loginLoader: {
        marginLeft: theme.spacing(4),
    },
    copyright: {
        marginTop: theme.spacing(4),
        whiteSpace: "nowrap",
        [theme.breakpoints.up("md")]: {
            position: "absolute",
            bottom: theme.spacing(2),
        },
    },
    root: {
        display: 'flex',
        border: '1px solid black',
        padding: '2rem',
        margin: "auto",
        width: '60%',
        alignContent: 'center',

    },
    grid: {
        // display: 'flex',
        flexWrap:'wrap',
        border:'2px solid black',
        flexDirection:'row',
        // alignContent:'center',
        // alignItems:'center'
    },
    grid2: {
        backgroundColor:'black',
        color:'white',
        margin:'0.2rem',
        padding:'5rem',
        border:'5px solid blue',
        [theme.breakpoints.up("md")]: {
            padding:'10rem',

        },

    },
    grid3: {
        backgroundColor:'black',
        color:'white',
        margin:'0.2rem',
        // padding:'5rem',
        border:'5px solid blue',
        height:'4rem',
        minWidth:'9rem',
    }

}));
