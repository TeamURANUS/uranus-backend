const admin = require("../utils/firebaseService");

const authMiddleware = (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    res.status(401).json({ message: "Invalid token" });
  }

  const token = headerToken.split(" ")[1];
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.loggedUser = {
        email: decodedToken.email,
        isVerified: decodedToken.email_verified,
        id: decodedToken.user_id,
      };
      next();
    })
    .catch(() => res.status(403).json({ message: "Could not authorize" }));
};

module.exports = authMiddleware;
