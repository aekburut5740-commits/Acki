const jwt = require("jsonwebtoken");

function optionalAuth(req, res, next) {
    const authorization = req.headers.authorization;

    req.accountId = null;

    if (!authorization) {
        return next();
    }

    const parts = authorization.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {
        return next();
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.accountId = decoded.accountId;
    } catch (error) {
        req.accountId = null;
    }

    next();
}

module.exports = optionalAuth;