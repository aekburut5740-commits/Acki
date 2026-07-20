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

router.get("/accounts/:id", async (req, res) => {
    try {
        const accountId = Number(req.params.id);

        if (!Number.isInteger(accountId) || accountId <= 0) {
            return res.status(400).json({
                message: "Invalid account ID"
            });
        }

        const accountResult = await pool.query(
            `
            SELECT
                accounts.id,
                accounts.username,
                accounts.display_name,
                accounts.bio,
                accounts.avatar_url,
                accounts.created_at,
                COUNT(posts.id)::INTEGER AS post_count
            FROM accounts
            LEFT JOIN posts
                ON posts.account_id = accounts.id
            WHERE accounts.id = $1
            GROUP BY accounts.id
            `,
            [accountId]
        );

        if (accountResult.rows.length === 0) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        const account = accountResult.rows[0];

        res.json({
            id: account.id,
            username: account.username,
            displayName: account.display_name,
            bio: account.bio,
            avatarUrl: account.avatar_url,
            createdAt: account.created_at,
            postCount: account.post_count
        });
    } catch (error) {
        console.error("Get account profile error:", error);

        res.status(500).json({
            message: "Cannot get account profile",
            error: error.message
        });
    }
});

router.get("/accounts/:id/posts", async (req, res) => {
  try {
    const accountId = Number(req.params.id);

    if (!Number.isInteger(accountId) || accountId <= 0) {
      return res.status(400).json({
        message: "Invalid account ID"
      });
    }

    const accountResult = await pool.query(
      `
      SELECT id
      FROM accounts
      WHERE id = $1
      `,
      [accountId]
    );

    if (accountResult.rows.length === 0) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    const postsResult = await pool.query(
      `
      SELECT
        posts.id,
        posts.content,
        posts.created_at,
        posts.updated_at,

        accounts.id AS account_id,
        accounts.username,
        accounts.display_name,
        accounts.avatar_url,

        COUNT(DISTINCT comments.id)::integer
          AS comment_count,

        COUNT(DISTINCT post_likes.account_id)::integer
          AS like_count,

        COUNT(DISTINCT post_saves.account_id)::integer
          AS save_count

      FROM posts

      INNER JOIN accounts
        ON posts.account_id = accounts.id

      LEFT JOIN comments
        ON comments.post_id = posts.id

      LEFT JOIN post_likes
        ON post_likes.post_id = posts.id

      LEFT JOIN post_saves
        ON post_saves.post_id = posts.id

      WHERE posts.account_id = $1

      GROUP BY
        posts.id,
        accounts.id,
        accounts.username,
        accounts.display_name,
        accounts.avatar_url

      ORDER BY posts.created_at DESC
      `,
      [accountId]
    );

    const posts = postsResult.rows.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.created_at,
      updatedAt: post.updated_at,

      commentCount: post.comment_count,
      likeCount: post.like_count,
      saveCount: post.save_count,

      account: {
        id: post.account_id,
        username: post.username,
        displayName: post.display_name,
        avatarUrl: post.avatar_url
      }
    }));

    res.json(posts);
  } catch (error) {
    console.error("Get account posts error:", error);

    res.status(500).json({
      message: "Cannot get account posts",
      error: error.message
    });
  }
});

module.exports = router;