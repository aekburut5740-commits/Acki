const express = require("express");
const pool = require("../db");
const requireAuth =
    require("../middleware/requireAuth");

const router = express.Router();

router.get(
    "/notifications",
    requireAuth,
    async (req, res) => {
        try {
            const result = await pool.query(
                `
                SELECT
                    notifications.id,
                    notifications.type,
                    notifications.post_id,
                    notifications.comment_id,
                    notifications.is_read,
                    notifications.created_at,

                    accounts.id AS actor_id,
                    accounts.display_name
                        AS actor_display_name,
                    accounts.username
                        AS actor_username,
                    accounts.avatar_url
                        AS actor_avatar_url

                FROM notifications

                INNER JOIN accounts
                    ON notifications.actor_account_id
                        = accounts.id

                WHERE
                    notifications.recipient_account_id
                        = $1

                ORDER BY
                    notifications.created_at DESC
                `,
                [req.accountId]
            );

            const notifications =
                result.rows.map((notification) => {
                    let text = "";

                    const actorName =
                        notification.actor_display_name ||
                        notification.actor_username ||
                        "Someone";

                    if (notification.type === "like") {
                        text =
                            `${actorName} liked your post.`;
                    }

                    if (notification.type === "comment") {
                        text =
                            `${actorName} commented on your post.`;
                    }

                    if (notification.type === "share") {
                        text =
                            `${actorName} shared your post.`;
                    }

                    return {
                        id: notification.id,
                        type: notification.type,
                        text,
                        postId: notification.post_id,
                        commentId:
                            notification.comment_id,
                        isRead:
                            notification.is_read,
                        createdAt:
                            notification.created_at,

                        actor: {
                            id: notification.actor_id,
                            displayName:
                                notification.actor_display_name,
                            username:
                                notification.actor_username,
                            avatarUrl:
                                notification.actor_avatar_url
                        }
                    };
                });

            res.json(notifications);
        } catch (error) {
            console.error(
                "Get notifications error:",
                error
            );

            res.status(500).json({
                message:
                    "Cannot load notifications",
                error: error.message
            });
        }
    }
);

router.patch(
    "/notifications/read",
    requireAuth,
    async (req, res) => {
        try {
            await pool.query(
                `
                UPDATE notifications
                SET is_read = true
                WHERE recipient_account_id = $1
                  AND is_read = false
                `,
                [req.accountId]
            );

            res.json({
                message: "Notifications marked as read"
            });
        } catch (error) {
            console.error(
                "Mark notifications as read error:",
                error
            );

            res.status(500).json({
                message:
                    "Cannot mark notifications as read",
                error: error.message
            });
        }
    }
);

module.exports = router;