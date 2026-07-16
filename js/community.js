// Community feed: posts, comments, likes, saves, share links.
const API_URL = ACKI_API_URL;

let activePost = null;
let activePostId = null;
let editingPostId = null;
let editingPostElement = null;
let deletingPostId = null;
let deletingPostElement = null;
let nextPostId = 4;

const commentsData = {};

function openComment(button) {
    closeAllPanels();

    const post = button.closest(".post");
    const postId = post.dataset.postId;

    activePost = post;
    activePostId = postId;

    const title = document.getElementById("commentTitle");
    const postName = post.querySelector(".post-name")?.textContent.trim()
        || "Unknown";

    if (title) {
        title.textContent = (typeof t === "function")
            ? t(
                `Comments on post by ${postName}`,
                `ความคิดเห็นในโพสต์ของ ${postName}`
            )
            : `Comments on post by ${postName}`;
    }

    loadComments(postId);

    document.querySelectorAll(".post").forEach((p) => {
        if (p !== post) p.classList.add("dimmed");
    });

    post.classList.add("focus");

    document.getElementById("focusOverlay")?.classList.add("show");
    document.getElementById("commentPanel")?.classList.add("show");
}

function renderComments(postId) {
    const commentList =
        document.getElementById("commentList");

    if (!commentList) return;

    commentList.innerHTML = "";

    const comments =
        commentsData[postId] || [];

    if (comments.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "comment-empty";

        emptyMessage.textContent =
            typeof t === "function"
                ? t(
                    "No comments yet.",
                    "ยังไม่มีความคิดเห็น"
                )
                : "No comments yet.";

        commentList.appendChild(emptyMessage);
        return;
    }

    comments.forEach((comment) => {
        const item =
            document.createElement("div");

        item.className = "comment-item";

        const avatar =
            document.createElement("img");

        avatar.className = "comment-avatar";

        avatar.src =
            comment.account?.avatarUrl ||
            "../pic/visitor.jpg";

        avatar.alt =
            comment.account?.displayName ||
            "Account";

        avatar.onerror = () => {
            avatar.src = "../pic/visitor.jpg";
        };

        const contentWrapper =
            document.createElement("div");

        contentWrapper.className =
            "comment-content";

        const user =
            document.createElement("span");

        user.className = "comment-user";

        user.textContent =
            comment.account?.displayName ||
            comment.account?.username ||
            "Unknown";

        const message =
            document.createElement("span");

        message.className =
            "comment-message";

        message.textContent =
            comment.content || "";

        const time =
            document.createElement("span");

        time.className =
            "comment-time";

        time.textContent = timeAgo(
            new Date(comment.createdAt).getTime()
        );

        contentWrapper.appendChild(user);
        contentWrapper.appendChild(message);
        contentWrapper.appendChild(time);

        item.appendChild(avatar);
        item.appendChild(contentWrapper);

        commentList.appendChild(item);
    });
}

async function loadComments(postId) {
    const commentList =
        document.getElementById("commentList");

    if (commentList) {
        commentList.innerHTML = "";

        const loading =
            document.createElement("p");

        loading.className =
            "comment-loading";

        loading.textContent =
            typeof t === "function"
                ? t(
                    "Loading comments...",
                    "กำลังโหลดความคิดเห็น..."
                )
                : "Loading comments...";

        commentList.appendChild(loading);
    }

    try {
        const response = await fetch(
            `${API_URL}/posts/${postId}/comments`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Cannot load comments"
            );
        }

        commentsData[postId] = data;

        renderComments(postId);
        updateCommentCount(postId);
    } catch (error) {
        console.error(
            "Load comments error:",
            error
        );

        if (commentList) {
            commentList.textContent =
                error.message;
        }
    }
}

function commentEnter(event) {
    if (event.key === "Enter") sendComment();
}

function closeComment() {
    if (activePost) {
        activePost.classList.remove("focus");
        activePost = null;
    }

    activePostId = null;

    document.querySelectorAll(".post").forEach((p) => {
        p.classList.remove("dimmed");
    });

    document.getElementById("focusOverlay")?.classList.remove("show");
    document.getElementById("commentPanel")?.classList.remove("show");
}

async function sendComment() {
    const input =
        document.getElementById("commentInput");

    const sendButton =
        document.querySelector(".btn-send");

    if (!input) return;

    const content = input.value.trim();

    if (!content || !activePostId) return;

    const token = getToken();

    if (!token) {
        alert(
            typeof t === "function"
                ? t(
                    "Please login before commenting.",
                    "กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น"
                )
                : "กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น"
        );

        window.location.href = "./login.html";
        return;
    }

    if (sendButton) {
        sendButton.disabled = true;

        sendButton.textContent =
            typeof t === "function"
                ? t("Sending...", "กำลังส่ง...")
                : "Sending...";
    }

    try {
        const response = await fetch(
            `${API_URL}/posts/${activePostId}/comments`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    content
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Cannot send comment"
            );
        }

        if (!commentsData[activePostId]) {
            commentsData[activePostId] = [];
        }

        commentsData[activePostId].push(data);

        renderComments(activePostId);
        updateCommentCount(activePostId);

        input.value = "";
        input.focus();
    } catch (error) {
        console.error(
            "Comment error:",
            error
        );

        alert(error.message);
    } finally {
        if (sendButton) {
            sendButton.disabled = false;

            sendButton.textContent =
                typeof t === "function"
                    ? t("Send", "ส่ง")
                    : "Send";
        }
    }
}

function toggleCreatePost() {
    const createPost =
        document.getElementById("createPost");

    if (!createPost) return;

    const isOpen =
        createPost.classList.contains("show");

    closeAllPanels();

    if (!isOpen) {
        resetCreatePostMode();
        createPost.classList.add("show");
    }
}

function resetCreatePostMode() {
    editingPostId = null;
    editingPostElement = null;

    const textarea =
        document.getElementById("createText");

    const title =
        document.getElementById("createPostTitle");

    const submitButton =
        document.getElementById(
            "createPostSubmitButton"
        );

    if (textarea) {
        textarea.value = "";
        textarea.style.height = "auto";
    }

    if (title) {
        title.textContent =
            typeof t === "function"
                ? t("Create Post", "สร้างโพสต์")
                : "Create Post";
    }

    if (submitButton) {
        submitButton.textContent =
            typeof t === "function"
                ? t("Post", "โพสต์")
                : "Post";
    }
}

function closeCreatePost() {
    document
        .getElementById("createPost")
        ?.classList.remove("show");

    resetCreatePostMode();
}

function createPostElement(postData) {
    const post = document.createElement("div");
    post.className = "post";
    post.dataset.postId = postData.id;
    post.dataset.createdAt = new Date(postData.createdAt).getTime();

    const currentAccount = getStoredAccount();
    const postAccount = postData.account || {};

    const isOwner =
        currentAccount &&
        String(currentAccount.id) === String(postAccount.id);

    const displayName =
        postAccount.displayName ||
        postAccount.username ||
        "Unknown";

    const avatarUrl =
        postAccount.avatarUrl ||
        "../pic/visitor.jpg";

    const ownerMenu = isOwner
        ? `
            <button
                type="button"
                class="post-menu-btn"
                onclick="togglePostMenu(this)"
            >
                ⋮
            </button>

            <div class="post-menu">
                <button
                    type="button"
                    onclick="editPost(this)"
                    data-en="Edit Post"
                    data-th="แก้ไขโพสต์"
                >
                    Edit Post
                </button>

                <button
                    type="button"
                    onclick="deletePost(this)"
                    data-en="Delete Post"
                    data-th="ลบโพสต์"
                >
                    Delete Post
                </button>
            </div>
        `
        : "";

    post.innerHTML = `
        <div class="post-header">
            <img
                src="${avatarUrl}"
                class="post-avatar"
                alt="${displayName}"
                onerror="this.src='../pic/visitor.jpg'"
            >

            <div>
                <p class="post-name">${displayName}</p>
                <p class="post-time">just now</p>
            </div>

            ${ownerMenu}
        </div>

        <div class="post-body">
            <p></p>
        </div>

        <div class="post-active">
            <button
                type="button"
                class="ti ti-heart btn-like"
                onclick="toggleLike(this)"
            >
                <span class="like-count">${postData.likeCount ?? 0}</span>
            </button>

            <button
                type="button"
                class="ti ti-message-circle btn-comment"
                onclick="openComment(this)"
            >
                <span class="comment-count">
    ${postData.commentCount ?? 0}
</span>
            </button>

            <button
                type="button"
                class="ti ti-bookmark btn-save notification-disabled"
                onclick="toggleSave(this)"
            ></button>

            <button
                type="button"
                class="ti ti-share-3 btn-share"
                onclick="sharePost(this)"
            >
                <span class="share-count">${postData.shares || 0}</span>
            </button>
        </div>
    `;

    post.querySelector(".post-body p").textContent =
        postData.content;

    const likeButton =
        post.querySelector(".btn-like");

    if (postData.isLiked) {
        likeButton.classList.add(
            "liked",
            "ti-heart-filled"
        );

        likeButton.classList.remove(
            "ti-heart"
        );
    }

    const savedKey = `acki-saved-${postData.id}`;
    const saveButton = post.querySelector(".btn-save");

    if (localStorage.getItem(savedKey) === "true") {
        saveButton.classList.add(
            "saved",
            "ti-bookmark-filled"
        );

        saveButton.classList.remove("ti-bookmark");
    }

    commentsData[postData.id] =
        postData.comments || [];

    return post;
}

async function createNewPost() {
    const textarea =
        document.getElementById("createText");

    const contentBox =
        document.querySelector(".content");

    const submitButton =
        document.getElementById(
            "createPostSubmitButton"
        );

    if (!textarea || !contentBox) return;

    const text = textarea.value.trim();

    if (!text) return;

    const token = getToken();

    if (!token) {
        alert(
            typeof t === "function"
                ? t(
                    "Please login before creating a post.",
                    "กรุณาเข้าสู่ระบบก่อนสร้างโพสต์"
                )
                : "กรุณาเข้าสู่ระบบก่อนสร้างโพสต์"
        );

        window.location.href = "./login.html";
        return;
    }

    const isEditing = Boolean(editingPostId);

    if (submitButton) {
        submitButton.disabled = true;

        submitButton.textContent =
            isEditing
                ? (
                    typeof t === "function"
                        ? t("Saving...", "กำลังบันทึก...")
                        : "Saving..."
                )
                : (
                    typeof t === "function"
                        ? t("Posting...", "กำลังโพสต์...")
                        : "Posting..."
                );
    }

    try {
        if (isEditing) {
            const response = await fetch(
                `${API_URL}/posts/${editingPostId}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        content: text
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Cannot edit post"
                );
            }

            const contentElement =
                editingPostElement?.querySelector(
                    ".post-body p"
                );

            if (contentElement) {
                contentElement.textContent =
                    data.post.content;
            }

            if (editingPostElement) {
                editingPostElement.dataset.updatedAt =
                    new Date(
                        data.post.updatedAt
                    ).getTime();

                editingPostElement.classList.add(
                    "post-edited"
                );

                const timeElement =
                    editingPostElement.querySelector(
                        ".post-time"
                    );

                if (timeElement) {
                    timeElement.textContent =
                        typeof t === "function"
                            ? t(
                                "edited just now",
                                "แก้ไขเมื่อกี้"
                            )
                            : "edited just now";
                }
            }
        } else {
            const response = await fetch(
                `${API_URL}/posts`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        content: text
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Cannot create post"
                );
            }

            const postElement =
                createPostElement(data);

            const firstPost =
                document.querySelector(".post");

            if (firstPost) {
                contentBox.insertBefore(
                    postElement,
                    firstPost
                );
            } else {
                contentBox.appendChild(
                    postElement
                );
            }

            commentsData[data.id] = [];

            if (
                typeof applyLanguage === "function"
            ) {
                applyLanguage();
            }

            updatePostTimes();
        }

        closeCreatePost();
    } catch (error) {
        console.error(
            isEditing
                ? "Edit post error:"
                : "Create post error:",
            error
        );

        alert(error.message);
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
        }

        if (
            document
                .getElementById("createPost")
                ?.classList.contains("show")
        ) {
            if (submitButton) {
                submitButton.textContent =
                    isEditing
                        ? (
                            typeof t === "function"
                                ? t("Save", "บันทึก")
                                : "Save"
                        )
                        : (
                            typeof t === "function"
                                ? t("Post", "โพสต์")
                                : "Post"
                        );
            }
        }
    }
}

async function loadPostsFromBackend() {

    const content = document.querySelector(".content");
    const offline = document.getElementById("serverOffline");

    if (!content) return;

    try {

        const token = getToken();

        const headers = {};

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
            `${API_URL}/posts`,
            {
                headers
            }
        );

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const posts = await response.json();

        // ซ่อนข้อความ Server Offline
        offline?.classList.remove("show");

        posts.forEach((postData) => {

            const alreadyExists = document.querySelector(
                `.post[data-post-id="${postData.id}"]`
            );

            if (alreadyExists) return;

            const postElement = createPostElement(postData);
            const firstPost = document.querySelector(".post");

            content.insertBefore(postElement, firstPost);

            if (!commentsData[postData.id]) {
                commentsData[postData.id] = [];
            }

        });

        if (typeof applyLanguage === "function") {
            applyLanguage();
        }

        updatePostTimes();

    } catch (error) {

        console.error("Backend Offline:", error);

        // ลบโพสต์ทั้งหมดออก
        content.innerHTML = "";

        // แสดงข้อความตรงกลาง
        offline?.classList.add("show");
    }
}

function autoResizePost(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

async function toggleLike(button) {
    const post = button.closest(".post");

    if (!post) return;

    const postId = post.dataset.postId;

    const countSpan =
        button.querySelector(".like-count");

    const token = getToken();

    if (!token) {
        alert(
            typeof t === "function"
                ? t(
                    "Please login before liking a post.",
                    "กรุณาเข้าสู่ระบบก่อนกดถูกใจ"
                )
                : "กรุณาเข้าสู่ระบบก่อนกดถูกใจ"
        );

        window.location.href = "./login.html";
        return;
    }

    button.disabled = true;

    try {
        const response = await fetch(
            `${API_URL}/posts/${postId}/like`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Cannot update like"
            );
        }

        if (data.isLiked) {
            button.classList.add(
                "liked",
                "ti-heart-filled"
            );

            button.classList.remove(
                "ti-heart"
            );
        } else {
            button.classList.remove(
                "liked",
                "ti-heart-filled"
            );

            button.classList.add(
                "ti-heart"
            );
        }

        if (countSpan) {
            countSpan.textContent =
                data.likeCount;
        }
    } catch (error) {
        console.error(
            "Like error:",
            error
        );

        alert(error.message);
    } finally {
        button.disabled = false;
    }
}

function toggleSave() {
    showComingSoon("Save");
}

function togglePostMenu(button) {
    const post = button.closest(".post");
    const menu = post.querySelector(".post-menu");

    document.querySelectorAll(".post-menu").forEach((m) => {
        if (m !== menu) m.classList.remove("show");
    });

    menu.classList.toggle("show");
}

async function editPost(button) {
    const post = button.closest(".post");

    if (!post) return;

    const postId = post.dataset.postId;

    const contentElement =
        post.querySelector(".post-body p");

    const textarea =
        document.getElementById("createText");

    const createPost =
        document.getElementById("createPost");

    const title =
        document.getElementById("createPostTitle");

    const submitButton =
        document.getElementById(
            "createPostSubmitButton"
        );

    if (
        !contentElement ||
        !textarea ||
        !createPost
    ) {
        return;
    }

    closeAllPanels();

    editingPostId = postId;
    editingPostElement = post;

    textarea.value =
        contentElement.textContent.trim();

    autoResizePost(textarea);

    if (title) {
        title.textContent =
            typeof t === "function"
                ? t("Edit Post", "แก้ไขโพสต์")
                : "Edit Post";
    }

    if (submitButton) {
        submitButton.textContent =
            typeof t === "function"
                ? t("Save", "บันทึก")
                : "Save";
    }

    createPost.classList.add("show");

    textarea.focus();

    const menu = post.querySelector(".post-menu");

    menu?.classList.remove("show");
}

async function deletePost(button) {
    const post = button.closest(".post");

    if (!post) return;

    deletingPostId = post.dataset.postId;
    deletingPostElement = post;

    post
        .querySelector(".post-menu")
        ?.classList.remove("show");

    document
        .getElementById("deletePostOverlay")
        ?.classList.add("show");

    document
        .getElementById("deletePostModal")
        ?.classList.add("show");
}
function closeDeletePostModal() {
    document
        .getElementById("deletePostOverlay")
        ?.classList.remove("show");

    document
        .getElementById("deletePostModal")
        ?.classList.remove("show");

    deletingPostId = null;
    deletingPostElement = null;
}
async function confirmDeletePost() {
    if (!deletingPostId || !deletingPostElement) {
        closeDeletePostModal();
        return;
    }

    const token = getToken();

    if (!token) {
        closeDeletePostModal();
        window.location.href = "./login.html";
        return;
    }

    const confirmButton =
        document.getElementById(
            "confirmDeletePostButton"
        );

    if (confirmButton) {
        confirmButton.disabled = true;

        confirmButton.textContent =
            typeof t === "function"
                ? t("Deleting...", "กำลังลบ...")
                : "Deleting...";
    }

    try {
        const response = await fetch(
            `${API_URL}/posts/${deletingPostId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Cannot delete post"
            );
        }

        delete commentsData[deletingPostId];

        deletingPostElement.remove();

        closeDeletePostModal();
    } catch (error) {
        console.error("Delete post error:", error);
        alert(error.message);
    } finally {
        if (confirmButton) {
            confirmButton.disabled = false;

            confirmButton.textContent =
                typeof t === "function"
                    ? t("Delete", "ลบ")
                    : "Delete";
        }
    }
}

function updateCommentCount(postId) {
    const post = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (!post) return;

    const countSpan = post.querySelector(".comment-count");
    if (!countSpan) return;

    const count = commentsData[postId] ? commentsData[postId].length : 0;
    countSpan.textContent = count;
}

function timeAgo(time) {
    const now = Date.now();
    const diff = Math.floor((now - time) / 1000);
    const lang = typeof getCurrentLanguage === "function" ? getCurrentLanguage() : "en";

    if (diff < 60) return lang === "th" ? "เมื่อกี้" : "just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return lang === "th" ? `${minutes} นาทีที่แล้ว` : `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return lang === "th" ? `${hours} ชม.ที่แล้ว` : `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return lang === "th" ? `${days} วันที่แล้ว` : `${days} day ago`;
}

function updatePostTimes() {
    document.querySelectorAll(".post").forEach((post) => {
        const createdAt = Number(post.dataset.createdAt);
        if (!createdAt) return;

        const timeText = post.querySelector(".post-time");
        if (timeText) timeText.textContent = timeAgo(createdAt);
    });
}

function sharePost(button) {
    const shareBox = document.getElementById("shareBox");
    const shareOverlay = document.getElementById("shareOverlay");

    if (!shareBox || !shareOverlay) return;

    const post = button.closest(".post");
    if (!post) return;

    const postId = post.dataset.postId;

    closeAllPanels();

    post.classList.add("share-active");

    const link =
        `${window.location.origin}${window.location.pathname}?post=${postId}`;

    const input = document.getElementById("shareLink");

    if (input) {
        input.value = link;
    }

    // จำว่า Share Box นี้เป็นของโพสต์ไหน
    shareBox.dataset.postId = postId;

    // สำคัญ: ให้กล่องอยู่ใต้ body ไม่อยู่ใน post
    document.body.appendChild(shareBox);

    const buttonRect = button.getBoundingClientRect();

    // ต้องแสดงกล่องก่อน เพื่อวัดขนาดจริง
    shareBox.classList.add("show");
    shareOverlay.classList.add("show");

    const boxRect = shareBox.getBoundingClientRect();
    const space = 12;

    let left = buttonRect.right - boxRect.width;
    let top = buttonRect.bottom + space;

    // กันหลุดขอบขวา
    if (left + boxRect.width > window.innerWidth - space) {
        left = window.innerWidth - boxRect.width - space;
    }

    // กันหลุดขอบซ้าย
    if (left < space) {
        left = space;
    }

    // ถ้าด้านล่างไม่พอ ให้เปิดขึ้นด้านบน
    if (top + boxRect.height > window.innerHeight - space) {
        top = buttonRect.top - boxRect.height - space;
    }

    // กันหลุดด้านบน
    if (top < space) {
        top = space;
    }

    shareBox.style.left = `${left}px`;
    shareBox.style.top = `${top}px`;
}

async function copyShareLink() {
    const input = document.getElementById("shareLink");
    const shareBox = document.getElementById("shareBox");
    if (!input || !shareBox) return;

    try {
        await navigator.clipboard.writeText(input.value);

        const postId = shareBox.dataset.postId;
        if (!postId) return;

        const post = document.querySelector(`.post[data-post-id="${postId}"]`);
        const countSpan = post?.querySelector(".share-count");

        const response = await fetch(`${API_URL}/posts/${postId}/share`, {
            method: "PATCH"
        });

        if (!response.ok) {
            throw new Error("Cannot update share count");
        }

        const updatedPost = await response.json();

        if (countSpan) {
            countSpan.textContent = updatedPost.shares || 0;
        }

        closeShareBox();
    } catch (error) {
        console.error("Copy link error:", error);
    }
}

function closeShareBox() {
    document.getElementById("shareBox")?.classList.remove("show");
    document.getElementById("shareOverlay")?.classList.remove("show");

    document.querySelectorAll(".post").forEach((post) => {
        post.classList.remove("share-active");
    });
}

function openPostFromUrl() {
    setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get("post");

        if (postId) {
            const post = document.querySelector(
                `.post[data-post-id="${postId}"]`
            );

            if (post) {
                setTimeout(() => {
                    post.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    post.classList.add("shared-post-focus");

                    setTimeout(() => {
                        post.classList.remove("shared-post-focus");
                    }, 3500);
                }, 200);
            }
        }
    }, 300);
}

function updateAckiScene() {
    const hour = new Date().getHours();
    const scene = document.getElementById("ackiScene");
    const skyObject = document.getElementById("skyObject");

    if (!scene || !skyObject) return;

    skyObject.className = "scene-sky-object";

    if (hour >= 6 && hour < 12) {
        scene.style.background = "#bfe9ff";
        skyObject.classList.add("sun");
        skyObject.style.right = "15%";
        skyObject.style.left = "auto";
        skyObject.style.top = "18%";
    } else if (hour >= 12 && hour < 17) {
        scene.style.background = "#8ed8ff";
        skyObject.classList.add("sun");
        skyObject.style.left = "50%";
        skyObject.style.right = "auto";
        skyObject.style.top = "10%";
    } else if (hour >= 17 && hour < 19) {
        scene.style.background = "#ffb07c";
        skyObject.classList.add("sun");
        skyObject.style.left = "15%";
        skyObject.style.right = "auto";
        skyObject.style.top = "24%";
    } else if (hour >= 19 || hour < 24) {
        scene.style.background = "#13213a";
        skyObject.classList.add("moon");
        skyObject.style.right = "15%";
        skyObject.style.left = "auto";
        skyObject.style.top = "18%";
    } else {
        scene.style.background = "#0b1020";
        skyObject.classList.add("moon");
        skyObject.style.left = "15%";
        skyObject.style.right = "auto";
        skyObject.style.top = "20%";
    }
}

document.addEventListener("copy", (event) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") return;

    const selectedNode = selection.anchorNode;
    const parentElement = selectedNode.nodeType === 3
        ? selectedNode.parentElement
        : selectedNode;

    const isPostBody = parentElement.closest(".post-body");

    if (!isPostBody) return;

    event.preventDefault();

    const cleanText = selection.toString().trim();
    event.clipboardData.setData("text/plain", cleanText);
});

updateAckiScene();
setInterval(updateAckiScene, 60 * 1000);

window.addEventListener("acki-language-change", () => {
    updatePostTimes();
    if (activePostId) {
        const title = document.getElementById("commentTitle");
        if (title) {
            title.textContent = (typeof t === "function")
                ? t("Comments for Post #", "ความคิดเห็นของโพสต์ #") + activePostId
                : "Comments for Post #" + activePostId;
        }
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeDeletePostModal();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadPostsFromBackend();

    document.querySelectorAll(".post").forEach((post) => {
        if (!post.dataset.createdAt) post.dataset.createdAt = Date.now();
    });

    updatePostTimes();
    setInterval(updatePostTimes, 30000);
    openPostFromUrl();
});
