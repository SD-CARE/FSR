const express = require("express");
const router = express.Router();
const {
  User,
  Carer,
  Metric,
  Call,
  Complied,
  Region,
  Client,
  Rating,
  PackageOfCare,
  carer_region,
  carer_client,
  metric_complied,
  Comment,
  metric_rating,
  client_call,
  client_region,
  client_POC,
} = require("./models");
const { asyncHandler } = require("./middleware/asyncHandler");
const { userAuthentication } = require("./middleware/userAuthentication");
const fs = require("fs");
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

// Route to JSON file
router.post(
  "/write",
  asyncHandler(async (req, res) => {
    try {
      const data = fs.readFileSync("../client/src/NPC.json");
      const json = JSON.parse(data);
      json.push(req.body);
      const filtered = json.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t["Employee No"] === item["Employee No"] ||
              t["Staff Name"] === item["Staff Name"] ||
              t["Item"] === item["Item"]
          )
      );
      fs.writeFile(
        "../client/src/NPC.json",
        JSON.stringify(filtered),
        (err) => {
          if (err) throw err;
          console.log("File created!");
        }
      );

      res.status(201).location("/").end();
    } catch (err) {
      throw err;
    }
  })
);

// Get the NPC JSON file
router.get(
  "/write",
  asyncHandler(async (req, res) => {
    try {
      const words = fs.readFileSync("../client/src/NPC.json");
      const data = JSON.parse(words);
      res.status(200).json(data);
    } catch (err) {
      throw err;
    }
  })
);

// Create a Carer

router.post(
  "/carers",
  asyncHandler(async (req, res) => {
    try {
      await Carer.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });
      res.status(201).location(`/carers/`).end();
    } catch (err) {
      throw err;
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
          carerID: req.params.id,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (carers) {
        res.status(200).json({ carers });
      } else {
        res.status(404).json({
          message: "Sorry Carer not found",
        });
      }
    } catch (err) {
      throw err;
    }
  })
);

// Create Clients in the database
router.post(
  "/clients",
  asyncHandler(async (req, res) => {
    try {
      await Client.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });
      res.status(201).location(`/clients/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all clients from the database
router.get(
  "/clients",
  asyncHandler(async (req, res) => {
    try {
      const clients = await Client.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ clients });
    } catch (err) {
      throw err;
    }
  })
);

// get specific clients from the database
router.get(
  `/clients`,
  asyncHandler(async (req, res) => {
    try {
      const client = await Client.findAll();
      res.status(200).json({ client });
    } catch (err) {
      throw err;
    }
  })
);

// REGIONS
router.post(
  "/regions",
  asyncHandler(async (req, res) => {
    try {
      await Region.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });
      res.status(201).location(`/regions/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all regions from the database
router.get(
  "/regions",
  asyncHandler(async (req, res) => {
    try {
      const regions = await Region.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ regions });
    } catch (err) {
      throw err;
    }
  })
);

// CARER REGIONS
router.post(
  "/carer_region",
  asyncHandler(async (req, res) => {
    try {
      await carer_region.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });
      res.status(201).location(`/carer_region/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all carer_regions from the database
router.get(
  "/carer_region",
  asyncHandler(async (req, res) => {
    try {
      const carer_regions = await carer_region.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ carer_regions });
    } catch (err) {
      throw err;
    }
  })
);

// METRICS
router.post(
  "/metrics",
  asyncHandler(async (req, res) => {
    try {
      await Metric.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });
      res.status(201).location(`/metrics/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all metrics from the database
router.get(
  "/metrics",
  asyncHandler(async (req, res) => {
    try {
      const metrics = await Metric.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ metrics });
    } catch (err) {
      throw err;
    }
  })
);

// POC
router.post(
  "/poc",
  asyncHandler(async (req, res) => {
    try {
      await PackageOfCare.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });
      res.status(201).location(`/poc/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all poc from the database
router.get(
  "/poc",
  asyncHandler(async (req, res) => {
    try {
      const poc = await PackageOfCare.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ poc });
    } catch (err) {
      throw err;
    }
  })
);

// CALLS
router.post(
  "/calls",
  asyncHandler(async (req, res) => {
    try {
      await Call.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });

      res.status(201).location(`/calls/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all calls from the database
router.get(
  "/calls",
  asyncHandler(async (req, res) => {
    try {
      const calls = await Call.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ calls });
    } catch (err) {
      throw err;
    }
  })
);

// RATINGS
router.post(
  "/ratings",
  asyncHandler(async (req, res) => {
    try {
      await Rating.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });
      res.status(201).location(`/ratings/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all ratings from the database
router.get(
  "/ratings",
  asyncHandler(async (req, res) => {
    try {
      const ratings = await Rating.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ ratings });
    } catch (err) {
      throw err;
    }
  })
);

// COMPLIED
router.post(
  "/complied",
  asyncHandler(async (req, res) => {
    try {
      await Complied.bulkCreate(req.body, {
        validate: true,
        ignoreDuplicates: true,
      });
      res.status(201).location(`/complied/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all complied from the database
router.get(
  "/complied",
  asyncHandler(async (req, res) => {
    try {
      const complied = await Complied.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json({ complied });
    } catch (err) {
      throw err;
    }
  })
);

// CLIENT REGIONS
router.post(
  "/client_region",
  asyncHandler(async (req, res) => {
    try {
      await client_region.bulkCreate(req.body, {
        validate: true,
      });
      res.status(201).location(`/client_region/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all cclientregions from the database
router.get(
  "/client_region",
  asyncHandler(async (req, res) => {
    try {
      const client_regions = await client_region.findAll();
      res.status(200).json({ client_regions });
    } catch (err) {
      throw err;
    }
  })
);

// CLIENT_CALLS
router.post(
  "/client_calls",
  asyncHandler(async (req, res) => {
    try {
      await client_call.bulkCreate(req.body, {
        validate: true,
      });
      res.status(201).location(`/client_calls/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all client_calls from the database
router.get(
  "/client_calls",
  asyncHandler(async (req, res) => {
    try {
      const client_calls = await client_call.findAll();
      res.status(200).json({ client_calls });
    } catch (err) {
      throw err;
    }
  })
);

// CLIENT_POC
router.post(
  "/client_poc",
  asyncHandler(async (req, res) => {
    try {
      await client_POC.bulkCreate(req.body, {
        validate: true,
      });
      res.status(201).location(`/client_poc/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all client_poc from the database
router.get(
  "/client_poc",
  asyncHandler(async (req, res) => {
    try {
      const client_poc = await client_POC.findAll();
      res.status(200).json({ client_poc });
    } catch (err) {
      throw err;
    }
  })
);

// METRIC_RATINGS
router.post(
  "/metric_rating",
  asyncHandler(async (req, res) => {
    try {
      await metric_rating.bulkCreate(req.body, {
        validate: true,
      });
      res.status(201).location(`/metric_rating/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all metric_rating from the database
router.get(
  "/metric_rating",
  asyncHandler(async (req, res) => {
    try {
      const metric = await metric_rating.findAll();
      res.status(200).json({ metric });
    } catch (err) {
      throw err;
    }
  })
);

// METRIC_COMPLIED
router.post(
  "/metric_complied",
  asyncHandler(async (req, res) => {
    try {
      await metric_complied.bulkCreate(req.body, {
        validate: true,
      });
      res.status(201).location(`/metric_complied/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all metric_complied from the database
router.get(
  "/metric_complied",
  asyncHandler(async (req, res) => {
    try {
      const metric = await metric_complied.findAll();
      res.status(200).json({ metric });
    } catch (err) {
      throw err;
    }
  })
);

// COMMENTS

router.post(
  "/comments",
  asyncHandler(async (req, res) => {
    try {
      await Comment.bulkCreate(req.body, {
        validate: true,
      });
      res.status(201).location(`/comments/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all comments from the database
router.get(
  "/comments",
  asyncHandler(async (req, res) => {
    try {
      const comments = await Comment.findAll();
      res.status(200).json({ comments });
    } catch (err) {
      throw err;
    }
  })
);

// CARER_CLIENT
router.post(
  "/carer_client",
  asyncHandler(async (req, res) => {
    try {
      await carer_client.bulkCreate(req.body, {
        validate: true,
      });
      res.status(201).location(`/carer_client/`).end();
    } catch (err) {
      throw err;
    }
  })
);

// Get all carer_client from the database
router.get(
  "/carer_client",
  asyncHandler(async (req, res) => {
    try {
      const carer_clients = await carer_client.findAll();
      res.status(200).json({ carer_clients });
    } catch (err) {
      throw err;
    }
  })
);

module.exports = router;
