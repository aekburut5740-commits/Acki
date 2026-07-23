const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const ACKI_API_URL = "https://acki-zq9m.onrender.com";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, displayName, email, password } = req.body;

    if (!username || !displayName || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all required fields"
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        message: "Password must be at least 4 characters"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO accounts
        (username, display_name, email, password_hash)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id,
        username,
        display_name,
        email,
        bio,
        avatar_url,
        created_at
      `,
      [username, displayName, email, passwordHash]
    );

    res.status(201).json({
      message: "Account created successfully",
      account: result.rows[0]
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Username or email is already in use"
      });
    }

    res.status(500).json({
      message: "Cannot create account",
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password"
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        display_name,
        email,
        password_hash,
        bio,
        avatar_url,
        created_at
      FROM accounts
      WHERE LOWER(email) = LOWER($1)
      `,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Email or password is incorrect"
      });
    }

    const account = result.rows[0];

    const passwordIsCorrect = await bcrypt.compare(
      password,
      account.password_hash
    );

    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Email or password is incorrect"
      });
    }

    const token = jwt.sign(
      {
        accountId: account.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      account: {
        id: account.id,
        username: account.username,
        displayName: account.display_name,
        email: account.email,
        bio: account.bio,
        avatarUrl: account.avatar_url,
        createdAt: account.created_at
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Cannot login",
      error: error.message
    });
  }
});

module.exports = router;