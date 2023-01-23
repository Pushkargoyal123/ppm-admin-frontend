import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, Chip, MenuItem, Input, Select, Button } from "@material-ui/core";

import { getRequestWithAxios, postRequestWithFetch } from "../../service";
import useStyles from "../dashboard/styles";
import { notifySuccess, notifyError } from "../../components/notify/Notify";
import ReferralListModal from "./ReferralListModal";

const states = {
  "Make Ambessedor": "success",
  "Remove Ambessedor": "warning",
};

export default function AmbessodorList() {
  const [userList, setUserList] = useState([]);
  const [openReferralModal, setOpenReferralModal] = useState(false);
  const [clickedUserName, setClickedUserName] = useState("");
  const [clickedUser, setClickedUser] = useState({});

  useEffect(function () {
    userData();
  }, []);

  let classes = useStyles();

  const userData = async () => {
    try {
      const data = await getRequestWithAxios("user/list");
      if (data.data) {
        const actualData = data.data.data;
        for (let i = 0; i < actualData.length; i++) {
          let count = 0;
          for (let j = 0; j < actualData.length; j++) {
            if (actualData[i].id === actualData[j].ReferById) {
              count++;
            }
          }
          actualData[i].referrals = count;
        }
        setUserList(actualData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (row) => {
    setClickedUserName(row.userName);
    setClickedUser(row);
    setOpenReferralModal(true);
  };

  const columns = [
    "SNO",
    "Name",
    "Email",
    "Referrals",
    "Date Of Registration",
    "Group",
    "Status",
    "Ambessedor",
    "Wallet Balance",
  ];

  const data = userList.map((row, index) => {
    if (!row.length) {
      return [
        index + 1,
        <Button variant="outlined" onClick={() => handleClick(row)}>
          {row.userName}{" "}
        </Button>,
        row.email,
        row.referrals,
        row.dateOfRegistration,
        row.registerType + "-" + row.ppm_userGroups[0].ppm_group.value,
        <span style={{ color: row.status === "active" ? "green" : "red" }}>
          {" "}
          {row.status}{" "}
        </span>,
        <span style={{ color: row.canReferToNewUser ? "green" : "red" }}>
          {row.canReferToNewUser ? "Ambessedor" : "Non-Ambessedor"}
        </span>,
        "₹" + row.referralWalletBalance,
      ];
    } else {
      return [<font color="red">OOPS! No Data Found</font>];
    }
  });

  const handleUpdate = (selectedData, value) => {
    if (value !== "") {
      selectedData.forEach(async function (item) {
        const body = {
          canReferToNewUser: value === "Make Ambessedor" ? true : false,
          id: item.id,
        };
        const data = await postRequestWithFetch("user/makeAmbessedor", body);
        if (data.success) {
          notifySuccess({
            Message: "User Ambessedor status Updated Successfully",
            ProgressBarHide: true,
          });
          userData();
        } else {
          notifyError({
            Message: "Oops! Some error occurred.",
            ProgressBarHide: true,
          });
        }
      });
    }
  };

  return (
    <div>
      <ReferralListModal
        open={openReferralModal}
        setOpen={setOpenReferralModal}
        userName={clickedUserName}
        user={clickedUser}
      />
      <Box
        component="span"
        style={{ marginTop: "0%", padding: "1rem", margin: "auto" }}
      >
        <MUIDataTable
          title={"User List"}
          data={data}
          columns={columns}
          options={{
            customToolbarSelect: (rowIndex, rowData) => {
              const selectedData = rowIndex.data.map(function (item) {
                return userList[item.index];
              });

              return (
                <Select
                  style={{ width: 200 }}
                  labelId="demo-mutiple-checkbox-label"
                  id="demo-mutiple-checkbox"
                  label="Ambessedor"
                  onChange={(event) => {
                    handleUpdate(selectedData, event.target.value);
                  }}
                  input={<Input />}
                  renderValue={(selected) => (
                    <Chip
                      label={selected}
                      classes={{
                        root: classes[states[selected.toLowerCase()]],
                      }}
                    />
                  )}
                >
                  {["None", "Make Ambessedor", "Remove Ambessedor"].map(
                    (changeStatus) => (
                      <MenuItem
                        key={changeStatus}
                        value={
                          changeStatus === "None" ? "Select" : changeStatus
                        }
                      >
                        <Chip
                          label={changeStatus}
                          classes={{ root: classes[states[changeStatus]] }}
                        />
                      </MenuItem>
                    ),
                  )}
                </Select>
              );
            },
          }}
        />
      </Box>
    </div>
  );
}
