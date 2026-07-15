const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        username,
        display_name,
        email,
        bio,
        avatar_url,
        created_at,
        updated_at
      FROM accounts
      WHERE id = $1
      `,
      [req.accountId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    const account = result.rows[0];

    res.json({
      id: account.id,
      username: account.username,
      displayName: account.display_name,
      email: account.email,
      bio: account.bio,
      avatarUrl: account.avatar_url,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    });
  } catch (error) {
    console.error("Get account error:", error);

    res.status(500).json({
      message: "Cannot get account information",
      error: error.message
    });
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { displayName, bio, avatarUrl } = req.body;

    const result = await pool.query(
      `
      UPDATE accounts
      SET
        display_name = COALESCE($1, display_name),
        bio = COALESCE($2, bio),
        avatar_url = COALESCE($3, avatar_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING
        id,
        username,
        display_name,
        email,
        bio,
        avatar_url,
        created_at,
        updated_at
      `,
      [
        displayName ?? null,
        bio ?? null,
        avatarUrl ?? null,
        req.accountId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    const account = result.rows[0];

    res.json({
      message: "Profile updated successfully",
      account: {
        id: account.id,
        username: account.username,
        displayName: account.display_name,
        email: account.email,
        bio: account.bio,
        avatarUrl: account.avatar_url,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Cannot update profile",
      error: error.message
    });
  }
});

router.get("/profiles/:username", async (req, res) => {
  try {
    const username = req.params.username.trim();

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        display_name,
        bio,
        avatar_url,
        created_at
      FROM accounts
      WHERE LOWER(username) = LOWER($1)
      `,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    const account = result.rows[0];

    res.json({
      id: account.id,
      username: account.username,
      displayName: account.display_name,
      bio: account.bio,
      avatarUrl: account.avatar_url,
      createdAt: account.created_at
    });
  } catch (error) {
    console.error("Get public profile error:", error);

    res.status(500).json({
      message: "Cannot get profile",
      error: error.message
    });
  }
});

router.patch("/me/password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please enter current password and new password"
      });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({
        message: "New password must be at least 4 characters"
      });
    }

    const result = await pool.query(
      `
      SELECT password_hash
      FROM accounts
      WHERE id = $1
      `,
      [req.accountId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    const currentPasswordIsCorrect = await bcrypt.compare(
      currentPassword,
      result.rows[0].password_hash
    );

    if (!currentPasswordIsCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE accounts
      SET
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [newPasswordHash, req.accountId]
    );

    res.json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Cannot change password",
      error: error.message
    });
  }
});

router.patch("/me/account", requireAuth, async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({
        message: "Please provide username or email"
      });
    }

    const result = await pool.query(
      `
      UPDATE accounts
      SET
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING
        id,
        username,
        display_name,
        email,
        bio,
        avatar_url,
        created_at,
        updated_at
      `,
      [
        username?.trim() || null,
        email?.trim().toLowerCase() || null,
        req.accountId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    const account = result.rows[0];

    res.json({
      message: "Account information updated successfully",
      account: {
        id: account.id,
        username: account.username,
        displayName: account.display_name,
        email: account.email,
        bio: account.bio,
        avatarUrl: account.avatar_url,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }
    });
  } catch (error) {
    console.error("Update account error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Username or email is already in use"
      });
    }

    res.status(500).json({
      message: "Cannot update account information",
      error: error.message
    });
  }
});

module.exports = router;