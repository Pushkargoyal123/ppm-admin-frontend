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
  logotypeContainer: {
    // backgroundColor: theme.palette.primary.main,
    // backgroundColor: "#F8EEE3",
    backgroundColor: "#f0f5df",
    width: "60%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // [theme.breakpoints.down("md")]: {
    //   width: "0%",
    // },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "40%",
      display: "flex",
    },
  },
  logotypeImage: {
    width: 265,
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      width: 125,
    },
  },
  logotypeText: {
    color: "gray",
    fontWeight: 500,
    fontSize: 60,
    [theme.breakpoints.down("md")]: {
      fontSize: "200%",
    },
  },
  formContainer: {
    backgroundColor:"#fefffa",
    width: "40%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height:"60%",
    },
  },
  form: {
    width: 320,
  },
  tab: {
    fontWeight: 400,
    fontSize: 18,
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
      borderBottomColor: theme.palette.secondary.light,
    },
    "&:after": {
      borderBottomColor: theme.palette.secondary.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme.palette.secondary.light} !important`,
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
  formControl: {
    "&:before": {
      borderBottomColor: theme.palette.secondary.light,
    },
    "&:after": {
      borderBottomColor: theme.palette.secondary.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme.palette.secondary.light} !important`,
    },
    margin: theme.spacing(0, 0 ,.9,0),
    minWidth: 320,      
  },
}));
