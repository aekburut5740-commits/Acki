const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Please login first"
    });
  }

  const parts = authorization.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Invalid authorization format"
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.accountId = decoded.accountId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is invalid or expired"
    });
  }
}

module.exports = requireAuth;