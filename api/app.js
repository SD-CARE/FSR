"use strict";

// load modules
const express = require("express");
const { sequelize } = require("./models");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const externalAPI = require("./externalAPI");
const path = require("path");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("./middleware/asyncHandler");
const { userAuthentication } = require("./middleware/userAuthentication");
const auth = require("basic-auth");
const { User } = require("./models");
const bcrypt = require("bcryptjs");

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

let refreshTokens = [];

// Create a new user
app.post(
  "/api/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location("/users").end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// request for refresh token
app.post(
  "/api/refresh",
  asyncHandler(async (req, res) => {
    // get the refresh token from the request body
    const refreshToken = req.body.token;

    // if the there is no token, return an error(401)
    if (!refreshToken)
      return res.status(401).json({ message: "You are not authenticated" });
    //  if token is there but not valid, return an error(403)
    if (!refreshTokens.includes(refreshToken))
      return res.status(403).json({ message: "Invaid refresh token" });

    // varify the token
    jwt.verify(refreshToken, "my-refresh-token-secret-key", (err, user) => {
      // send an error if varification fails
      if (err) return res.status(403).json({ message: "Invaid refresh token" });
      // if varification is successful, create a new access token and send it to the client
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      // create a new access token
      const newAccessToken = generateAccessToken(user);
      //  create new refresh token
      const newRefreshToken = generateRefreshToken(user);
      // add the new refresh token to the refreshTokens array
      refreshTokens.push(newRefreshToken);
      // send the new access token and refresh token to the client
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  })
);

// generate access token
const generateAccessToken = (user) => {
  // create a new access token
  return jwt.sign(
    {
      id: user.id,
      password: user.password,
      emailAddress: user.emailAddress,
    },
    "my-access-token-secret-key",
    // valid for 22 hours
    { expiresIn: "22h" }
  );
};

// generate refresh token
const generateRefreshToken = (user) => {
  // create a new refresh token
  return jwt.sign(
    {
      id: user.id,
      password: user.password,
      emailAddress: user.emailAddress,
    },
    "my-refresh-token-secret-key"
  );
};

// Get a User
app.get(
  "/api/users",
  asyncHandler(async (req, res) => {
    try {
      // get the user credentials from the request
      const credentials = auth(req);

      // if the credentials are available
      if (credentials) {
        // get the user from the database
        const user = await User.findOne({
          where: {
            emailAddress: credentials.name,
          },
        });
        // if the user is found
        if (user) {
          // compare the password entered with the one in the database
          const authenticated = bcrypt.compareSync(
            credentials.pass,
            user.password
          );

          // if the password is correct
          if (authenticated) {
            // generate an access token
            const accessToken = generateAccessToken(user);
            // console.log(user);
            // generate a refresh token
            const refreshToken = generateRefreshToken(user);
            // add the refresh token to the refreshTokens array
            refreshTokens.push(refreshToken);
            // send the access token and refresh token to the client
            res.status(200).json({
              id: user.userID,
              firstName: user.firstName,
              accessToken,
              refreshToken,
            });
          }
        }
      }
    } catch (err) {
      throw err;
    }
  })
);

// setup route to access external apiBaseUrl
app.use("/externalAPI", externalAPI);
app.use("/api", routes);

// create a conection to the build frontend
app.use(express.static("build"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set("port", process.env.PORT || 8080);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  await sequelize.sync({ force: false });
})();

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
