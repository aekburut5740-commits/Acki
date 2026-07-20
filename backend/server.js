const express = require("express");
const cors = require("cors");
const pool = require("./db");

const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/accounts");
const postRoutes = require("./routes/posts");
const notificationRoutes = require("./routes/notifications");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(accountRoutes);
app.use(postRoutes);
app.use(notificationRoutes);

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

app.get("/database-test", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS database_time"
    );

    res.json({
      message: "Connected to PostgreSQL",
      databaseTime: result.rows[0].database_time
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Cannot connect to PostgreSQL",
      error: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Acki backend running on port ${PORT}`);
});