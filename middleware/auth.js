const jwt = require("jsonwebtoken");
const config = process.env;

const auth = (roles, req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  console.log(token);
  if (!token && !req.session.user) {
    res.status(403).json({ message: "You are not authenticated!" });
  } else {
    if (req.session.user === "authenticated") {
      try {
        const decoded = jwt.verify(token, "secret");
        const roles = _.intersection([decodedToken.role], roles);
        if (roles.length > 0) {
          req.user = decoded;
          next();
        }
      } catch (err) {
        res.status(401).send("Invalid token");
      }
    } else {
      res.status(403).json({ message: "You are not authenticated!" });
    }
  }
};

module.exports = auth;
