const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

// A middleware function to authenticate the request;
exports.userAuthentication = async (req, res, next) => {
  // Store the Message to display
  let message;

  // Parse the user's credentials from the Authorisation header
  const credentials = auth(req);

  // If the user's credentials are in the database
  if (credentials) {
    // Get the user's data from the database by email
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });
    // If the the user exsits
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);

      // If password matches the user
      if (authenticated) {
        console.log(`Authentication Successful for ${user.firstName}`);
        // Store the user on the request object
        req.currentUser = user;
      } else {
        message = `Authentication failure for ${user.emailAddress}`;
      }
    } else {
      message = `Authentication for ${credentials.name} failed`;
    }
  } else {
    message = "Auth header not found";
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};
