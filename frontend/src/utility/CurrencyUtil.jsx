import axios from "axios";

const token = localStorage.getItem("token");

export function getConvertedBalance(setter) {
  getProperty("/user/balance", "balance").then(setter);
}

export function getConvertedGoal(setter) {
  getProperty("/user/goal", "saving_goal").then(setter);
}

async function getProperty(pathName, propertyName) {
  return new Promise((resolve) => { 
    getAxiosInstance()
    .get(pathName)
    .then((response) => {
      resolve(response.data.result[propertyName])
    });
  });
}

function getAxiosInstance() {
  return axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${token}` }
  });
}