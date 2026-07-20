const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/requireAuth");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

/*
  อ่านโพสต์ทั้งหมด

  Route นี้ไม่บังคับ Login
  คนที่ยังเป็น Visitor ก็เปิดดูโพสต์ได้
*/
router.get(
    "/posts",
    optionalAuth,
    async (req, res) => {
        try {
            const result = await pool.query(
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

        COUNT(DISTINCT comments.id)::integer AS comment_count,

        COUNT(DISTINCT post_likes.account_id)::integer AS like_count,

        CASE
            WHEN $1::bigint IS NULL THEN false
            ELSE EXISTS (
                SELECT 1
                FROM post_likes current_like
                WHERE current_like.post_id = posts.id
                  AND current_like.account_id = $1
            )
        END AS is_liked,

        COUNT(DISTINCT post_saves.account_id)::integer AS save_count,

        CASE
            WHEN $1::bigint IS NULL THEN false
            ELSE EXISTS (
                SELECT 1
                FROM post_saves current_save
                WHERE current_save.post_id = posts.id
                  AND current_save.account_id = $1
            )
        END AS is_saved

    FROM posts

    INNER JOIN accounts
        ON posts.account_id = accounts.id

    LEFT JOIN comments
        ON comments.post_id = posts.id

    LEFT JOIN post_likes
        ON post_likes.post_id = posts.id

    LEFT JOIN post_saves
        ON post_saves.post_id = posts.id

    GROUP BY
        posts.id,
        accounts.id,
        accounts.username,
        accounts.display_name,
        accounts.avatar_url

    ORDER BY posts.created_at DESC
    `,
                [req.accountId]
            );

            const posts = result.rows.map((post) => ({
                id: post.id,
                content: post.content,
                createdAt: post.created_at,
                updatedAt: post.updated_at,

                commentCount: post.comment_count,
                likeCount: post.like_count,
                isLiked: post.is_liked,
                saveCount: post.save_count,
                isSaved: post.is_saved,

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

            commentCount: 0,
            likeCount: 0,
            isLiked: false,
            isSaved: false,

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

router.post(
    "/posts/:id/save",
    requireAuth,
    async (req, res) => {
        try {
            const postId = Number(req.params.id);

            if (!Number.isInteger(postId)) {
                return res.status(400).json({
                    message: "Invalid post ID"
                });
            }

            const postResult = await pool.query(
                `
                SELECT id
                FROM posts
                WHERE id = $1
                `,
                [postId]
            );

            if (postResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Post not found"
                });
            }

            const existingSave = await pool.query(
                `
                SELECT post_id
                FROM post_saves
                WHERE
                    post_id = $1
                    AND account_id = $2
                `,
                [postId, req.accountId]
            );

            let isSaved;

            if (existingSave.rows.length > 0) {
                await pool.query(
                    `
                    DELETE FROM post_saves
                    WHERE
                        post_id = $1
                        AND account_id = $2
                    `,
                    [postId, req.accountId]
                );

                isSaved = false;
            } else {
                await pool.query(
                    `
                    INSERT INTO post_saves
                        (post_id, account_id)
                    VALUES
                        ($1, $2)
                    `,
                    [postId, req.accountId]
                );

                isSaved = true;
            }

            res.json({
                postId,
                isSaved
            });
        } catch (error) {
            console.error(
                "Toggle save error:",
                error
            );

            res.status(500).json({
                message: "Cannot update saved post",
                error: error.message
            });
        }
    }
);

router.post(
    "/posts/:id/like",
    requireAuth,
    async (req, res) => {
        try {
            const postId = Number(req.params.id);

            if (!Number.isInteger(postId)) {
                return res.status(400).json({
                    message: "Invalid post ID"
                });
            }

            const postResult = await pool.query(
                `
    SELECT
        id,
        account_id
    FROM posts
    WHERE id = $1
    `,
                [postId]
            );

            if (postResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Post not found"
                });
            }

            const postOwnerId =
                postResult.rows[0].account_id;

            const existingLike =
                await pool.query(
                    `
                    SELECT post_id
                    FROM post_likes
                    WHERE
                        post_id = $1
                        AND account_id = $2
                    `,
                    [postId, req.accountId]
                );

            let isLiked;

            if (existingLike.rows.length > 0) {
                await pool.query(
                    `
        DELETE FROM post_likes
        WHERE
            post_id = $1
            AND account_id = $2
        `,
                    [postId, req.accountId]
                );

                await pool.query(
                    `
        DELETE FROM notifications
        WHERE
            type = 'like'
            AND post_id = $1
            AND actor_account_id = $2
            AND recipient_account_id = $3
        `,
                    [
                        postId,
                        req.accountId,
                        postOwnerId
                    ]
                );

                isLiked = false;
            } else {
                await pool.query(
                    `
        INSERT INTO post_likes
            (post_id, account_id)
        VALUES
            ($1, $2)
        `,
                    [postId, req.accountId]
                );

                isLiked = true;

                const isOwnPost =
                    String(postOwnerId) ===
                    String(req.accountId);

                if (!isOwnPost) {
                    await pool.query(
                        `
            INSERT INTO notifications (
                recipient_account_id,
                actor_account_id,
                post_id,
                type
            )
            VALUES ($1, $2, $3, 'like')
            `,
                        [
                            postOwnerId,
                            req.accountId,
                            postId
                        ]
                    );
                }
            }

            const countResult =
                await pool.query(
                    `
                    SELECT COUNT(*)::integer
                        AS like_count
                    FROM post_likes
                    WHERE post_id = $1
                    `,
                    [postId]
                );

            res.json({
                postId,
                isLiked,
                likeCount:
                    countResult.rows[0].like_count
            });
        } catch (error) {
            console.error(
                "Toggle like error:",
                error
            );

            res.status(500).json({
                message: "Cannot update like",
                error: error.message
            });
        }
    }
);

router.get("/posts/:id/comments", async (req, res) => {
    try {
        const postId = Number(req.params.id);

        if (
            !Number.isInteger(postId) ||
            postId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        const result = await pool.query(
            `
            SELECT
                comments.id,
                comments.post_id,
                comments.parent_comment_id,
                comments.content,
                comments.created_at,
                comments.updated_at,

                accounts.id AS account_id,
                accounts.username,
                accounts.display_name,
                accounts.avatar_url

            FROM comments

            INNER JOIN accounts
                ON comments.account_id = accounts.id

            WHERE comments.post_id = $1

            ORDER BY
                COALESCE(
                    comments.parent_comment_id,
                    comments.id
                ) ASC,

                CASE
                    WHEN comments.parent_comment_id IS NULL
                    THEN 0
                    ELSE 1
                END ASC,

                comments.created_at ASC
            `,
            [postId]
        );

        const comments = result.rows.map((comment) => ({
            id: comment.id,
            postId: comment.post_id,

            parentCommentId:
                comment.parent_comment_id,

            content: comment.content,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,

            account: {
                id: comment.account_id,
                username: comment.username,
                displayName:
                    comment.display_name,
                avatarUrl:
                    comment.avatar_url
            }
        }));

        res.json(comments);
    } catch (error) {
        console.error(
            "Get comments error:",
            error
        );

        res.status(500).json({
            message: "Cannot load comments",
            error: error.message
        });
    }
});

router.post(
    "/posts/:id/comments",
    requireAuth,
    async (req, res) => {
        try {
            const postId =
                Number(req.params.id);

            const content =
                req.body.content?.trim();

            const parentCommentId =
                req.body.parentCommentId == null
                    ? null
                    : Number(
                        req.body.parentCommentId
                    );

            if (
                !Number.isInteger(postId) ||
                postId <= 0
            ) {
                return res.status(400).json({
                    message: "Invalid post ID"
                });
            }

            if (!content) {
                return res.status(400).json({
                    message:
                        "Comment cannot be empty"
                });
            }

            if (
                parentCommentId !== null &&
                (
                    !Number.isInteger(
                        parentCommentId
                    ) ||
                    parentCommentId <= 0
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid parent comment ID"
                });
            }

            const postResult =
                await pool.query(
                    `
                    SELECT
                        id,
                        account_id
                    FROM posts
                    WHERE id = $1
                    `,
                    [postId]
                );

            if (
                postResult.rows.length === 0
            ) {
                return res.status(404).json({
                    message: "Post not found"
                });
            }

            const postOwnerId =
                postResult.rows[0].account_id;

            let parentComment = null;

            if (parentCommentId !== null) {
                const parentResult =
                    await pool.query(
                        `
                        SELECT
                            id,
                            post_id,
                            account_id,
                            parent_comment_id
                        FROM comments
                        WHERE id = $1
                        `,
                        [parentCommentId]
                    );

                if (
                    parentResult.rows.length === 0
                ) {
                    return res.status(404).json({
                        message:
                            "Parent comment not found"
                    });
                }

                parentComment =
                    parentResult.rows[0];

                if (
                    String(parentComment.post_id) !==
                    String(postId)
                ) {
                    return res.status(400).json({
                        message:
                            "Parent comment does not belong to this post"
                    });
                }

                if (
                    parentComment.parent_comment_id !==
                    null
                ) {
                    return res.status(400).json({
                        message:
                            "Replies can only be made to top-level comments"
                    });
                }
            }

            const commentResult =
                await pool.query(
                    `
                    INSERT INTO comments (
                        post_id,
                        account_id,
                        parent_comment_id,
                        content
                    )
                    VALUES ($1, $2, $3, $4)

                    RETURNING
                        id,
                        post_id,
                        account_id,
                        parent_comment_id,
                        content,
                        created_at,
                        updated_at
                    `,
                    [
                        postId,
                        req.accountId,
                        parentCommentId,
                        content
                    ]
                );

            const newComment =
                commentResult.rows[0];

            /*
              Notification ให้เจ้าของโพสต์
              ยกเว้นผู้กระทำคือเจ้าของโพสต์เอง
            */

            const isOwnPost =
                String(postOwnerId) ===
                String(req.accountId);

            if (!isOwnPost) {
                await pool.query(
                    `
                    INSERT INTO notifications (
                        recipient_account_id,
                        actor_account_id,
                        post_id,
                        comment_id,
                        type
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        'comment'
                    )
                    `,
                    [
                        postOwnerId,
                        req.accountId,
                        postId,
                        newComment.id
                    ]
                );
            }

            /*
              ถ้าเป็น Reply:
              แจ้งเจ้าของคอมเมนต์หลักด้วย

              แต่ไม่แจ้งตัวเอง
              และไม่สร้างซ้ำถ้าเจ้าของคอมเมนต์
              คือเจ้าของโพสต์
            */

            if (parentComment) {
                const parentOwnerId =
                    parentComment.account_id;

                const isReplyingToSelf =
                    String(parentOwnerId) ===
                    String(req.accountId);

                const parentOwnerIsPostOwner =
                    String(parentOwnerId) ===
                    String(postOwnerId);

                if (
                    !isReplyingToSelf &&
                    !parentOwnerIsPostOwner
                ) {
                    await pool.query(
                        `
                        INSERT INTO notifications (
                            recipient_account_id,
                            actor_account_id,
                            post_id,
                            comment_id,
                            type
                        )
                        VALUES (
                            $1,
                            $2,
                            $3,
                            $4,
                            'comment'
                        )
                        `,
                        [
                            parentOwnerId,
                            req.accountId,
                            postId,
                            newComment.id
                        ]
                    );
                }
            }

            const accountResult =
                await pool.query(
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

            const account =
                accountResult.rows[0];

            res.status(201).json({
                id: newComment.id,
                postId: newComment.post_id,

                parentCommentId:
                    newComment.parent_comment_id,

                content: newComment.content,
                createdAt:
                    newComment.created_at,
                updatedAt:
                    newComment.updated_at,

                account: {
                    id: account.id,
                    username:
                        account.username,
                    displayName:
                        account.display_name,
                    avatarUrl:
                        account.avatar_url
                }
            });
        } catch (error) {
            console.error(
                "Create comment error:",
                error
            );

            res.status(500).json({
                message:
                    "Cannot create comment",
                error: error.message
            });
        }
    }
);

function groupComments(comments) {
    const topLevelComments = [];
    const repliesByParentId = {};

    for (const comment of comments) {
        if (comment.parentCommentId == null) {
            topLevelComments.push(comment);
            continue;
        }

        const parentId =
            String(comment.parentCommentId);

        if (!repliesByParentId[parentId]) {
            repliesByParentId[parentId] = [];
        }

        repliesByParentId[parentId].push(
            comment
        );
    }

    return {
        topLevelComments,
        repliesByParentId
    };
}

function createCommentElement(
    commentData,
    options = {}
) {
    const postAccount =
        postData.account || {};

    post.dataset.postId =
        postData.id;

    post.dataset.accountId =
        postAccount.id;

    const postOwnerId =
        postElement.dataset.accountId;

    const commentElement =
        createCommentElement(
            commentData,
            {
                isReply: false,
                postOwnerId
            }
        );
        const replyElement =
    createCommentElement(
        reply,
        {
            isReply: true,
            postOwnerId
        }
    );

    const currentAccount =
        getStoredAccount();

    const isCommentOwner =
        currentAccount &&
        String(currentAccount.id) ===
        String(commentData.account?.id);

    const isPostOwner =
        currentAccount &&
        String(currentAccount.id) ===
        String(postOwnerId);

    const canDelete =
        isCommentOwner ||
        isPostOwner;

    const deleteMenuHtml =
        canDelete
            ? `
            <button
                type="button"
                class="delete-comment-button"
                onclick="deleteComment(this)"
            >
                Delete Comment
            </button>
        `
            : "";

    const {
        isReply = false,
        postOwnerId = null
    } = options;

    const comment =
        document.createElement("div");

    comment.className =
        isReply
            ? "comment comment-reply"
            : "comment";

    comment.dataset.commentId =
        commentData.id;

    comment.dataset.accountId =
        commentData.account?.id || "";

    const commentAccount =
        commentData.account || {};

    const displayName =
        commentAccount.displayName ||
        commentAccount.username ||
        "Unknown";

    const avatarUrl =
        commentAccount.avatarUrl ||
        "../pic/visitor.jpg";

    comment.innerHTML = `
        <div class="comment-header">
            ${deleteMenuHtml}
            <img
                src="${avatarUrl}"
                class="comment-avatar profile-link"
                data-account-id="${commentAccount.id}"
                alt="${displayName}"
                onerror="this.src='../pic/visitor.jpg'"
            >

            <div class="comment-user-info">
                <p
                    class="comment-name profile-link"
                    data-account-id="${commentAccount.id}"
                >
                    ${displayName}
                </p>

                <p class="comment-time">
                    just now
                </p>
            </div>

            <button
                type="button"
                class="comment-menu-button"
                onclick="toggleCommentMenu(this)"
            >
                ⋮
            </button>

            <div class="comment-menu"></div>
        </div>

        <div class="comment-body">
            <p></p>
        </div>

        <div class="comment-actions">
            ${isReply
            ? ""
            : `
                        <button
                            type="button"
                            class="comment-reply-button"
                            onclick="startReply(this)"
                        >
                            Reply
                        </button>
                    `
        }
        </div>

        ${isReply
            ? ""
            : `
                    <div
                        class="reply-form-container"
                        hidden
                    ></div>

                    <div
                        class="comment-replies"
                    ></div>
                `
        }
    `;
    const currentAccount =
        getStoredAccount();

    const postElement =
        document.querySelector(
            `.post[data-post-id="${commentData.postId}"]`
        );

    comment.querySelector(
        ".comment-body p"
    ).textContent =
        commentData.content;

    return comment;
}

async function deleteComment(button) {
    const commentElement =
        button.closest(".comment");

    const postElement =
        button.closest(".post");

    if (
        !commentElement ||
        !postElement
    ) {
        return;
    }

    const commentId =
        Number(
            commentElement.dataset.commentId
        );

    const token = getToken();

    if (!token) {
        alert("Please login first");
        return;
    }

    const confirmed = confirm(
        "Delete this comment?"
    );

    if (!confirmed) return;

    button.disabled = true;

    try {
        const response = await fetch(
            `${API_URL}/comments/${commentId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Cannot delete comment"
            );
        }

        const deletedCount =
            Number(
                data.deletedCount || 1
            );

        commentElement.remove();

        const countElement =
            postElement.querySelector(
                ".comment-count"
            );

        if (countElement) {
            const oldCount =
                Number(
                    countElement.textContent
                ) || 0;

            countElement.textContent =
                Math.max(
                    0,
                    oldCount - deletedCount
                );
        }
    } catch (error) {
        console.error(
            "Delete comment error:",
            error
        );

        alert(error.message);
        button.disabled = false;
    }
}

function renderComments(
    comments,
    commentsContainer
) {
    commentsContainer.innerHTML = "";

    const {
        topLevelComments,
        repliesByParentId
    } = groupComments(comments);

    for (
        const topComment
        of topLevelComments
    ) {
        const topElement =
            createCommentElement(
                topComment,
                {
                    isReply: false
                }
            );

        commentsContainer.appendChild(
            topElement
        );

        const repliesContainer =
            topElement.querySelector(
                ".comment-replies"
            );

        const replies =
            repliesByParentId[
            String(topComment.id)
            ] || [];

        for (const reply of replies) {
            const replyElement =
                createCommentElement(
                    reply,
                    {
                        isReply: true
                    }
                );

            repliesContainer.appendChild(
                replyElement
            );
        }
    }
}

function startReply(button) {
    const commentElement =
        button.closest(".comment");

    if (!commentElement) return;

    const parentCommentId =
        Number(
            commentElement.dataset.commentId
        );

    const replyContainer =
        commentElement.querySelector(
            ".reply-form-container"
        );

    if (!replyContainer) return;

    const existingInput =
        replyContainer.querySelector(
            ".reply-input"
        );

    if (existingInput) {
        replyContainer.hidden = false;
        existingInput.focus();
        return;
    }

    replyContainer.innerHTML = `
        <form
            class="reply-form"
            onsubmit="submitReply(event, this)"
        >
            <input
                type="hidden"
                name="parentCommentId"
                value="${parentCommentId}"
            >

            <textarea
                class="reply-input"
                name="content"
                placeholder="Write a reply..."
                rows="2"
            ></textarea>

            <div class="reply-form-actions">
                <button
                    type="button"
                    onclick="cancelReply(this)"
                >
                    Cancel
                </button>

                <button type="submit">
                    Reply
                </button>
            </div>
        </form>
    `;

    replyContainer.hidden = false;

    replyContainer
        .querySelector(".reply-input")
        .focus();
}

function cancelReply(button) {
    const replyContainer =
        button.closest(
            ".reply-form-container"
        );

    if (!replyContainer) return;

    replyContainer.hidden = true;
}

async function submitReply(
    event,
    form
) {
    event.preventDefault();

    const postElement =
        form.closest(".post");

    if (!postElement) {
        console.error(
            "Cannot find parent post"
        );
        return;
    }

    const postId =
        Number(
            postElement.dataset.postId
        );

    const parentCommentId =
        Number(
            form.elements
                .parentCommentId
                .value
        );

    const content =
        form.elements
            .content
            .value
            .trim();

    if (!content) return;

    const token = getToken();

    if (!token) {
        alert("Please login first");
        return;
    }

    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );

    submitButton.disabled = true;

    try {
        const response = await fetch(
            `${API_URL}/posts/${postId}/comments`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    content,
                    parentCommentId
                })
            }
        );

        const newReply =
            await response.json();

        if (!response.ok) {
            throw new Error(
                newReply.message ||
                "Cannot create reply"
            );
        }

        const parentCommentElement =
            form.closest(".comment");

        const repliesContainer =
            parentCommentElement.querySelector(
                ".comment-replies"
            );

        const replyElement =
            createCommentElement(
                newReply,
                {
                    isReply: true
                }
            );

        repliesContainer.appendChild(
            replyElement
        );

        form.elements.content.value = "";

        form.closest(
            ".reply-form-container"
        ).hidden = true;

        const countElement =
            postElement.querySelector(
                ".comment-count"
            );

        if (countElement) {
            countElement.textContent =
                Number(
                    countElement.textContent
                ) + 1;
        }
    } catch (error) {
        console.error(
            "Create reply error:",
            error
        );

        alert(error.message);
    } finally {
        submitButton.disabled = false;
    }
}

router.delete(
    "/comments/:id",
    requireAuth,
    async (req, res) => {
        const client =
            await pool.connect();

        try {
            const commentId =
                Number(req.params.id);

            if (
                !Number.isInteger(commentId) ||
                commentId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Invalid comment ID"
                });
            }

            await client.query("BEGIN");

            const permissionResult =
                await client.query(
                    `
                    SELECT
                        comments.id,
                        comments.post_id,
                        comments.account_id
                            AS comment_owner_id,
                        comments.parent_comment_id,

                        posts.account_id
                            AS post_owner_id

                    FROM comments

                    INNER JOIN posts
                        ON comments.post_id =
                           posts.id

                    WHERE comments.id = $1

                    FOR UPDATE
                    `,
                    [commentId]
                );

            if (
                permissionResult.rows.length ===
                0
            ) {
                await client.query("ROLLBACK");

                return res.status(404).json({
                    message:
                        "Comment not found"
                });
            }

            const comment =
                permissionResult.rows[0];

            const isCommentOwner =
                String(
                    comment.comment_owner_id
                ) ===
                String(req.accountId);

            const isPostOwner =
                String(
                    comment.post_owner_id
                ) ===
                String(req.accountId);

            if (
                !isCommentOwner &&
                !isPostOwner
            ) {
                await client.query("ROLLBACK");

                return res.status(403).json({
                    message:
                        "You cannot delete this comment"
                });
            }

            /*
              รวบรวม Comment ที่จะถูกลบ

              ถ้าเป็นคอมเมนต์หลัก:
              รวม Reply ใต้คอมเมนต์ด้วย

              ถ้าเป็น Reply:
              มีแค่ตัวเอง
            */

            const affectedResult =
                await client.query(
                    `
                    SELECT id
                    FROM comments
                    WHERE
                        id = $1
                        OR parent_comment_id = $1
                    `,
                    [commentId]
                );

            const deletedCommentIds =
                affectedResult.rows.map(
                    (row) => row.id
                );

            /*
              ลบ Notification ก่อน
              ป้องกันกรณี Foreign Key
              ของ notifications.comment_id
              ไม่ได้ตั้ง ON DELETE CASCADE
            */

            if (
                deletedCommentIds.length > 0
            ) {
                await client.query(
                    `
                    DELETE FROM notifications
                    WHERE comment_id =
                        ANY($1::bigint[])
                    `,
                    [deletedCommentIds]
                );
            }

            /*
              Reply จะถูกลบตามด้วย
              ON DELETE CASCADE
            */

            await client.query(
                `
                DELETE FROM comments
                WHERE id = $1
                `,
                [commentId]
            );

            await client.query("COMMIT");

            res.json({
                message:
                    "Comment deleted successfully",

                commentId,

                postId:
                    comment.post_id,

                deletedCommentIds,

                deletedCount:
                    deletedCommentIds.length
            });
        } catch (error) {
            await client.query("ROLLBACK");

            console.error(
                "Delete comment error:",
                error
            );

            res.status(500).json({
                message:
                    "Cannot delete comment",
                error: error.message
            });
        } finally {
            client.release();
        }
    }
);

function toggleCommentMenu(button) {
    const commentHeader =
        button.closest(".comment-header");

    const menu =
        commentHeader?.querySelector(
            ".comment-menu"
        );

    if (!menu) return;

    document
        .querySelectorAll(
            ".comment-menu.show"
        )
        .forEach((openMenu) => {
            if (openMenu !== menu) {
                openMenu.classList.remove(
                    "show"
                );
            }
        });

    menu.classList.toggle("show");
}

const menuHtml =
    canDelete
        ? `
            <button
                type="button"
                class="comment-menu-button"
                onclick="toggleCommentMenu(this)"
            >
                ⋮
            </button>

            <div class="comment-menu">
                <button
                    type="button"
                    class="delete-comment-button"
                    onclick="deleteComment(this)"
                >
                    Delete Comment
                </button>
            </div>
        `
        : "";

        document.addEventListener(
    "click",
    (event) => {
        const profileLink =
            event.target.closest(
                ".profile-link"
            );

        if (!profileLink) return;

        event.preventDefault();
        event.stopPropagation();

        openProfile(
            profileLink.dataset.accountId
        );
    }
);

module.exports = router;