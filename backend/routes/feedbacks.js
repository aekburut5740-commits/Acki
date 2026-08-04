const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/requireAuth");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

router.get("/feedbacks", optionalAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                feedbacks.id,
                feedbacks.content,
                feedbacks.created_at,

                accounts.id AS account_id,
                accounts.username,
                accounts.display_name,
                accounts.avatar_url,

                COUNT(DISTINCT CASE WHEN feedback_reactions.reaction_type = 'like' THEN feedback_reactions.account_id END)::integer AS like_count,
                COUNT(DISTINCT CASE WHEN feedback_reactions.reaction_type = 'dislike' THEN feedback_reactions.account_id END)::integer AS dislike_count,

                MAX(CASE WHEN feedback_reactions.account_id = $1::integer THEN feedback_reactions.reaction_type END) AS my_reaction

            FROM feedbacks
            INNER JOIN accounts ON accounts.id = feedbacks.account_id
            LEFT JOIN feedback_reactions ON feedback_reactions.feedback_id = feedbacks.id

            GROUP BY feedbacks.id, accounts.id, accounts.username, accounts.display_name, accounts.avatar_url
            ORDER BY feedbacks.created_at DESC
            `,
            [req.accountId || null]
        );

        res.json(result.rows.map((row) => ({
            id: row.id,
            content: row.content,
            createdAt: row.created_at,
            likeCount: row.like_count,
            dislikeCount: row.dislike_count,
            myReaction: row.my_reaction,
            account: {
                id: row.account_id,
                username: row.username,
                displayName: row.display_name,
                avatarUrl: row.avatar_url
            }
        })));
    } catch (error) {
        console.error("Get feedbacks error:", error);
        res.status(500).json({ message: "Cannot load feedbacks", error: error.message });
    }
});

router.post("/feedbacks", requireAuth, async (req, res) => {
    try {
        const content = (req.body.content || "").trim();

        if (!content) {
            return res.status(400).json({ message: "Feedback content is required" });
        }

        const result = await pool.query(
            `
            INSERT INTO feedbacks (account_id, content)
            VALUES ($1, $2)
            RETURNING id, content, created_at
            `,
            [req.accountId, content]
        );

        const accountResult = await pool.query(
            `SELECT id, username, display_name, avatar_url FROM accounts WHERE id = $1`,
            [req.accountId]
        );

        const feedback = result.rows[0];
        const account = accountResult.rows[0];

        res.status(201).json({
            id: feedback.id,
            content: feedback.content,
            createdAt: feedback.created_at,
            likeCount: 0,
            dislikeCount: 0,
            myReaction: null,
            account: {
                id: account.id,
                username: account.username,
                displayName: account.display_name,
                avatarUrl: account.avatar_url
            }
        });
    } catch (error) {
        console.error("Create feedback error:", error);
        res.status(500).json({ message: "Cannot create feedback", error: error.message });
    }
});

router.post("/feedbacks/:id/react", requireAuth, async (req, res) => {
    try {
        const feedbackId = Number(req.params.id);
        const { type } = req.body;

        if (!Number.isInteger(feedbackId) || feedbackId <= 0) {
            return res.status(400).json({ message: "Invalid feedback ID" });
        }

        if (type !== "like" && type !== "dislike") {
            return res.status(400).json({ message: "type must be 'like' or 'dislike'" });
        }

        const existing = await pool.query(
            `SELECT reaction_type FROM feedback_reactions WHERE feedback_id = $1 AND account_id = $2`,
            [feedbackId, req.accountId]
        );

        if (existing.rows.length === 0) {
            await pool.query(
                `INSERT INTO feedback_reactions (feedback_id, account_id, reaction_type) VALUES ($1, $2, $3)`,
                [feedbackId, req.accountId, type]
            );
        } else if (existing.rows[0].reaction_type === type) {
            await pool.query(
                `DELETE FROM feedback_reactions WHERE feedback_id = $1 AND account_id = $2`,
                [feedbackId, req.accountId]
            );
        } else {
            await pool.query(
                `UPDATE feedback_reactions SET reaction_type = $3 WHERE feedback_id = $1 AND account_id = $2`,
                [feedbackId, req.accountId, type]
            );
        }

        const counts = await pool.query(
            `
            SELECT
                COUNT(*) FILTER (WHERE reaction_type = 'like')::integer AS like_count,
                COUNT(*) FILTER (WHERE reaction_type = 'dislike')::integer AS dislike_count
            FROM feedback_reactions
            WHERE feedback_id = $1
            `,
            [feedbackId]
        );

        const myReactionResult = await pool.query(
            `SELECT reaction_type FROM feedback_reactions WHERE feedback_id = $1 AND account_id = $2`,
            [feedbackId, req.accountId]
        );

        res.json({
            likeCount: counts.rows[0].like_count,
            dislikeCount: counts.rows[0].dislike_count,
            myReaction: myReactionResult.rows[0]?.reaction_type || null
        });
    } catch (error) {
        console.error("React to feedback error:", error);
        res.status(500).json({ message: "Cannot react to feedback", error: error.message });
    }
});

router.delete("/feedbacks/:id", requireAuth, async (req, res) => {
    try {
        const feedbackId = Number(req.params.id);

        const result = await pool.query(
            `DELETE FROM feedbacks WHERE id = $1 AND account_id = $2 RETURNING id`,
            [feedbackId, req.accountId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Feedback not found or not yours" });
        }

        res.json({ message: "Feedback deleted" });
    } catch (error) {
        console.error("Delete feedback error:", error);
        res.status(500).json({ message: "Cannot delete feedback", error: error.message });
    }
});

module.exports = router;