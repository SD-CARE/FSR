const express = require("express");
const router = express.Router();
const {
  User,
  Carer,
  Metric,
  Call,
  Complied,
  Schedule,
  Client,
  Rating,
  PackageOfCare,
  DateRange,
} = require("./models");
const { asyncHandler } = require("./middleware/asyncHandler");
const { userAuthentication } = require("./middleware/userAuthentication");
const user = require("./models/user");

// Routes for Authenticated Users
//Create a User
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (err) {
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = err.errors.map((er) => er.message);
        res.status(400).json({ errors });
      } else {
        throw err;
      }
    }
  })
);
// Get a User
router.get(
  "/users",
  userAuthentication,
  asyncHandler(async (req, res) => {
    try {
      const user = req.currentUser;
      res.status(200).json({
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
      });
    } catch (err) {
      throw err;
    }
  })
);

// Routes for Appointments

// Create a Carer
router.post(
  "/carers",
  asyncHandler(async (req, res) => {
    try {
      const carer = await Carer.create(req.body);
      res.status(201).location(`/carers/${carer.carerID}`).end();
    } catch (err) {
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = err.errors.map((er) => er.message);
        res.status(400).json({ errors });
      } else {
        throw err;
      }
    }
  })
);

// Get all carers
router.get(
  "/carers",
  asyncHandler(async (req, res) => {
    try {
      const carers = await Carer.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json({ carers });
    } catch (err) {
      throw err;
    }
  })
);

// Get a single carer
router.get(
  "/carers/:id",
  asyncHandler(async (req, res) => {
    try {
      const carers = await Carer.findOne({
        where: {
          id: req.params.id,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["firstName", "lastName"],
          },
        ],
      });
      if (carers) {
        res.status(200).json({ carers });
      } else {
        res.status(404).json({
          message: "Sorry Appointment not found",
        });
      }
    } catch (err) {
      throw err;
    }
  })
);

// Create the calls
router.post(
  "/calls",
  asyncHandler(async (req, res) => {
    try {
      const call = await Call.bulkCreate([
        { call: "Breakfast" },
        { call: "Lunch" },
        { call: "Tea" },
        { call: "Dinner" },
      ]);
      res.status(201).location(`/calls/${call.callID}`).end();
    } catch (err) {
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = err.errors.map((er) => er.message);
        res.status(400).json({ errors });
      } else {
        throw err;
      }
    }
  })
);

// Get the Calls
router.get(
  "/calls",
  asyncHandler(async (req, res) => {
    try {
      const calls = await Call.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json({ calls });
    } catch (err) {
      throw err;
    }
  })
);

module.exports = router;
