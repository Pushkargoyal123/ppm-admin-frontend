import axios from "axios";

// const ServerUrl = "http://localhost:7080/api/";
// const ServerUrl="https://test.praedicofinance.com/api/"

async function postRequestWithFetch(url, body) {
    try {
        const res = await fetch( process.env.React_App_SERVERURL + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("id_token")
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getRequestWithAxios(url){
    try {
        const res = await axios.get( process.env.React_App_SERVERURL + url, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("id_token")
          }
        });
        return res;
      } catch (err) {
        console.log(err);
      }
}

export { postRequestWithFetch,  getRequestWithAxios}