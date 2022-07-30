import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import SimpleMenu from "./component/Menu";
import { getRequestWithFetch } from "../../service";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import AddUserToPlan from "./AddUserToPlan";


// components

const options = {
  filterType: 'none',
  selectableRows: 'none',
  customToolbar: () => {
    return (
      <span style={{
        display:"flex",
        alignItems:'center',
        float:'right'
      }}>
        <SimpleMenu />
        <AddUserToPlan />
      </span>
    );
  }
};

export default function Plan_Details() {


  const [featurePlans, setFeaturePlans] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planChargeList, setPLanChargeList] = useState([]);

  useEffect(function () {
    fetchAllData();
  }, [])

  const fetchAllData = async () => {
    const plan = await getRequestWithFetch("plans/planList");

    const featurePlans = await getRequestWithFetch("plans/getFeaturePlans");

    const planCharges = await getRequestWithFetch("plans/getMonthlyPlansList");

    if (plan.success && featurePlans.success) {
      setPlans(plan.data)
      setFeaturePlans(featurePlans.data);
    }
    if (planCharges.success) {
      setPLanChargeList(planCharges.data);
    }
  }


  const columns = plans.map((row, _index) => {
    return (
      row.planName
    )
  })

  const PlanCharge = planChargeList.map((month) => {
    return [
      month.monthValue + " Months",
      ...month.ppm_subscription_monthly_plan_charges.map((planCharge) => {
        return [
          <div>
            <span> <s style={{ color: "grey" }}> ₹{planCharge.strikePrice}/- </s></span>
            <span>₹{planCharge.displayPrice}/-</span>
            <span> (-{Math.round((planCharge.strikePrice - planCharge.displayPrice) * 100 / planCharge.strikePrice)} %)</span>
          </div>
        ]
      })
    ]
  })

  const data = featurePlans.map((row, _index) => {
    return [

      row.featureName,

      ...row.ppm_subscription_plan_features.map((planFeature) => {
        return (

          planFeature.featureValue === "YES" ?
            <DoneIcon style={{ color: "green" }} />
            :
            planFeature.featureValue === "NO" ?
              <CloseIcon style={{ color: "red" }} />
              :
              <font color="blue" >{planFeature.featureValueDisplay}</font>
        )
      }),

    ]
  })


  return (
    <>
      <MUIDataTable
        title={"Membership Levels"}
        data={[...data, ...PlanCharge]}
        columns={["Feature Name", ...columns]}
        options={options}
      />
    </>
  );
}
