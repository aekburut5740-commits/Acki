const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

/*
  อ่านโพสต์ทั้งหมด

  Route นี้ไม่บังคับ Login
  คนที่ยังเป็น Visitor ก็เปิดดูโพสต์ได้
*/
router.get("/posts", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        posts.id,
        posts.content,
        posts.created_at,
        posts.updated_at,

        accounts.id AS account_id,
        accounts.username,
        accounts.display_name,
        accounts.avatar_url

      FROM posts

      INNER JOIN accounts
        ON posts.account_id = accounts.id

      ORDER BY posts.created_at DESC
    `);

        const posts = result.rows.map((post) => ({
            id: post.id,
            content: post.content,

            createdAt: post.created_at,
            updatedAt: post.updated_at,

            account: {
                id: post.account_id,
                username: post.username,
                displayName: post.display_name,
                avatarUrl: post.avatar_url
            }
        }));

        res.json(posts);
    } catch (error) {
        console.error("Get posts error:", error);

        res.status(500).json({
            message: "Cannot load posts",
            error: error.message
        });
    }
});

/*
  สร้างโพสต์ใหม่

  ต้อง Login เพราะต้องรู้ว่าใครเป็นเจ้าของโพสต์
*/
router.post("/posts", requireAuth, async (req, res) => {
    try {
        const content = req.body.content?.trim();

        if (!content) {
            return res.status(400).json({
                message: "Post content cannot be empty"
            });
        }

        const result = await pool.query(
            `
      INSERT INTO posts
        (account_id, content)

      VALUES
        ($1, $2)

      RETURNING
        id,
        account_id,
        content,
        created_at,
        updated_at
      `,
            [
                req.accountId,
                content
            ]
        );

        const newPost = result.rows[0];

        const accountResult = await pool.query(
            `
      SELECT
        id,
        username,
        display_name,
        avatar_url

      FROM accounts

      WHERE id = $1
      `,
            [req.accountId]
        );

        const account = accountResult.rows[0];

        res.status(201).json({
            id: newPost.id,
            content: newPost.content,

            createdAt: newPost.created_at,
            updatedAt: newPost.updated_at,

            account: {
                id: account.id,
                username: account.username,
                displayName: account.display_name,
                avatarUrl: account.avatar_url
            }
        });
    } catch (error) {
        console.error("Create post error:", error);

        res.status(500).json({
            message: "Cannot create post",
            error: error.message
        });
    }
});

/*
  แก้ไขโพสต์

  ต้อง Login และต้องเป็นเจ้าของโพสต์เท่านั้น
*/
router.patch("/posts/:id", requireAuth, async (req, res) => {
    try {
        const postId = Number(req.params.id);
        const content = req.body.content?.trim();

        if (!Number.isInteger(postId)) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        if (!content) {
            return res.status(400).json({
                message: "Post content cannot be empty"
            });
        }

        const result = await pool.query(
            `
      UPDATE posts

      SET
        content = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE
        id = $2
        AND account_id = $3

      RETURNING
        id,
        account_id,
        content,
        created_at,
        updated_at
      `,
            [
                content,
                postId,
                req.accountId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Post not found or you are not the owner"
            });
        }

        const updatedPost = result.rows[0];

        res.json({
            message: "Post updated successfully",

            post: {
                id: updatedPost.id,
                accountId: updatedPost.account_id,
                content: updatedPost.content,
                createdAt: updatedPost.created_at,
                updatedAt: updatedPost.updated_at
            }
        });
    } catch (error) {
        console.error("Update post error:", error);

        res.status(500).json({
            message: "Cannot update post",
            error: error.message
        });
    }
});

/*
  ลบโพสต์

  ต้อง Login และต้องเป็นเจ้าของโพสต์เท่านั้น
*/
router.delete("/posts/:id", requireAuth, async (req, res) => {
    try {
        const postId = Number(req.params.id);

        if (!Number.isInteger(postId)) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        const result = await pool.query(
            `
      DELETE FROM posts

      WHERE
        id = $1
        AND account_id = $2

      RETURNING id
      `,
            [
                postId,
                req.accountId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Post not found or you are not the owner"
            });
        }

        res.json({
            message: "Post deleted successfully",
            postId: result.rows[0].id
        });
    } catch (error) {
        console.error("Delete post error:", error);

        res.status(500).json({
            message: "Cannot delete post",
            error: error.message
        });
    }
});

module.exports = router;