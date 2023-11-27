import { useState } from "react";
import CarsTable from "./components/CarsTable";

const handleHttpErrors = async (res) => {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
};

const makeOptions = (method, withToken, body) => {
  method = method ? method : "GET";
  var opts = {
    method: method,
    headers: {
      ...(["PUT", "POST"].includes(method) && {
        //using spread operator to conditionally add member to headers object.
        "Content-type": "application/json",
      }),
      Accept: "application/json",
    },
  };
  if (withToken && loggedIn()) {
    opts.headers["x-access-token"] = getToken();
  }
  if (body) {
    opts.body = JSON.stringify(body);
  }
  return opts;
};

const fetchAny = async (
  url,
  handleData,
  handleError,
  method,
  body,
  withToken
) => {
  if (properties.backendURL) url = properties.backendURL + url;
  const options = makeOptions(method, withToken, body);
  try {
    const res = await fetch(url, options);
    const data = await handleHttpErrors(res);
    handleData(data);
  } catch (error) {
    if (error.status) {
      error.fullError.then((e) => {
        if (handleError) handleError(error.status + ": " + e.message);
      });
      console.log("ERROR:", error.status);
    } else {
      console.log("Network error");
    }
  }
  console.log(options);
};

export default fetchAny;
