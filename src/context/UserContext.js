import React, { Fragment } from "react";
import { TableCell, TableRow } from "@material-ui/core";
import Table from '../pages/dashboard/components/Table/Table'
import { postRequestWithFetch } from "../service";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}


// ###########################################################

const LoginAdmin = async (dispatch, login, password, history, setIsLoading, setError) => {

  const data = await postRequestWithFetch("admin/login", {
    email: login,
    password: password
  })
  window.location.search = "";
  if (!data) {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
    window.alert("Invailid Credentials");
  } else {
    localStorage.setItem('id_token', data.data.token)
    setError(null)
    setIsLoading(true)
    dispatch({ type: 'LOGIN_SUCCESS' })
    history.push('/app/dashboard')
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}


function UserPortfolio(props) {
  const PortFolioRows =
    <Fragment key={props.Userdata.id}>
      <TableRow><TableCell>Name </TableCell><TableCell>{props.Userdata.userName}</TableCell></TableRow>
      <TableRow><TableCell>E-mail </TableCell><TableCell>{props.Userdata.email}</TableCell></TableRow>
      <TableRow><TableCell>Contact No.</TableCell><TableCell>{props.Userdata.phone}</TableCell></TableRow>
      <TableRow><TableCell>Date of Birth</TableCell><TableCell>{props.Userdata.dob}</TableCell></TableRow>
      <TableRow><TableCell>Status</TableCell><TableCell>{props.Userdata.status}</TableCell></TableRow>
      <TableRow><TableCell>Gender</TableCell><TableCell>{props.Userdata.gender}</TableCell></TableRow>
    </Fragment>
  return (<div>
    <center>
      <Table column={[]} rows={PortFolioRows} tableStyle={{ width: '50rem' }} />
    </center>
  </div>
  )

}

export { UserProvider, useUserState, useUserDispatch, LoginAdmin, signOut, UserPortfolio };
