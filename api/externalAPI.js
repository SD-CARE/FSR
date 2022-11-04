const axios = require("axios");
require("dotenv").config();
const express = require("express");
const { asyncHandler } = require("./middleware/asyncHandler");
const router = express.Router();
// EXTERNAL API

// Get token from api
const getToken = async () => {
  const options = {
    method: "POST",
    url: process.env.TOKEN_URL,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      organisation_name: process.env.ORGANISATION_NAME,
    },
  };
  try {
    const response = await axios(options);
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.log(error);
  }
};

// Get data from external api
const exAPi = (path, method = "GET", body = null) => {
  return getToken().then((token) => {
    const options = {
      method,
      url: process.env.SERVER_URL + path,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "CP-Org-Name": process.env.ORGANISATION_NAME,
      },
    };
    // if the body is not null
    if (body !== null) {
      // add the body to the options and turn JSON to string formate
      options.body = JSON.stringify(body);
    }
    const response = axios(options);
    return response;
  });
};

// Get All Carers
router.get(
  "/carers",
  asyncHandler(async (req, res) => {
    try {
      const carers = await exAPi("carers?limit=200");
      res.status(200).json(carers.data);
    } catch (err) {
      throw err;
    }
  })
);

// Get All Clients
router.get(
  "/clients",
  asyncHandler(async (req, res) => {
    try {
      const clients = await exAPi("clients?limit=200");
      res.status(200).json(clients.data);
    } catch (err) {
      throw err;
    }
  })
);

// Get a carer by query string
router.get(
  "/carer*",
  asyncHandler(async (req, res) => {
    try {
      const carer = await exAPi(`carers?&filters=${req.query.filters}`);
      res.status(200).json(carer.data);
    } catch (err) {
      throw err;
    }
  })
);

// Get a client by id
router.get(
  "/client*",
  asyncHandler(async (req, res) => {
    try {
      const client = await exAPi(`clients?&filters=${req.query.filters}`);
      res.status(200).json(client.data);
    } catch (err) {
      throw err;
    }
  })
);

// get scheduleby id
router.get(
  "/regions",
  asyncHandler(async (req, res) => {
    try {
      const schedule = await exAPi(`regions?limit=200`);
      res.status(200).json(schedule.data);
    } catch (err) {
      throw err;
    }
  })
);

// get all runs
router.get(
  "/runs",
  asyncHandler(async (req, res) => {
    try {
      const runs = await exAPi(`appointment-runs?limit=200`);
      res.status(200).json(runs.data);
    } catch (err) {
      throw err;
    }
  })
);

// Get Apointments by carer
router.get(
  "/appointments*",
  asyncHandler(async (req, res) => {
    try {
      const appointments = await exAPi(
        `carers/${req.query.singlecarer}?&filters=${req.query.filters}`
      );
      res.status(200).json(appointments.data);
    } catch (err) {
      throw err;
    }
  })
);

module.exports = router;
