import axios from "axios";

const token = localStorage.getItem("token");

export function refreshDisplayBalance(setter, currency) {
  refreshDisplayProperty("/user/balance", "balance", currency).then(setter);
}

export function refreshDisplayGoal(setter, currency) {
  refreshDisplayProperty("/user/goal", "saving_goal", currency).then(setter);
}

async function refreshDisplayProperty(pathName, propertyName, currency) {
  return new Promise((resolve) => {
    refreshProperty(pathName, propertyName).then((nzdValue) => {
      convertCurrency(currency, "NZD", nzdValue).then((displayValue) => {
        resolve(displayValue);
      });
    });
  });
}

/**
 * converts the currency of each transaction using the Frankfurter API
 * the conversion rates refresh at ~2am NZST every business day
 *
 * @param to // the currency to convert to
 * @param from // the currency to convert from (default value for this application is NZD)
 * @param amount // the amount of the transaction
 * @returns the converted amount in the desired currency at 3 decimal point
 */
export async function convertCurrency(to, from, amount) {
  const host = 'api.frankfurter.app';

  return new Promise((resolve) => {
    if (to === from) {

      resolve(amount);

    } else {
      fetch(`https://${host}/latest?
      amount=${amount}&
      from=${from}&
      to=${to}`)
      .then(resp => resp.json())
      .then(data => {
        console.log(data.rates);
        resolve((amount * (data.rates[to] / data.rates[from])).toFixed(2));});
    }
  });
}

async function refreshProperty(pathName, propertyName) {
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