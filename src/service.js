import axios from "axios";

const ServerUrl = "http://localhost:7080/api/"; 
// const ServerUrl="https://test.praedicofinance.com/api/"

async function postRequestWithFetch(url, body) {
  try {
    const res = await fetch(ServerUrl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("id_token"),
      },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

async function getRequestWithFetch(url, _body) {
  try {
    const res = await fetch(ServerUrl + url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("id_token"),
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

async function getRequestWithAxios(url) {
  try {
    return await axios.get(ServerUrl + url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("id_token"),
      },
    });
  } catch (err) {
    console.log(err);
  }
}

export { postRequestWithFetch, getRequestWithAxios, getRequestWithFetch };
