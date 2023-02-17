const jwt = require("jsonwebtoken");

// A middleware function to authenticate the request;
exports.userAuthentication = async (req, res, next) => {
  // Parse the user's credentials from the Authorisation header
  const credentials = req.headers.authorization;

  // If the user's credentials are in the database
  if (credentials) {
    // Get the user's data from the database by email
    const token = credentials.split(" ")[1];
    // Verify the token
    jwt.verify(token, "my-access-token-secret-key", (err, user) => {
      // if there's an error
      if (err) {
        return res.status(403).json({ message: "Invalid access token" });
      }
      // if there's no error
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Access Denied" });
  }
};
