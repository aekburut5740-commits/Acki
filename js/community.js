// Community feed: posts, comments, likes, saves, share links.
const API_URL = "http://localhost:3000";

let activePost = null;
let activePostId = null;
let nextPostId = 4;

const commentsData = {
    1: [{ user: "Visitor", text: "Nice first post!" }],
    2: [{ user: "Visitor", text: "This second post looks good." }],
    3: [{ user: "Visitor", text: "I like this one." }]
};

function openComment(button) {
    closeAllPanels();

    const post = button.closest(".post");
    const postId = post.dataset.postId;

    activePost = post;
    activePostId = postId;

    const title = document.getElementById("commentTitle");
    if (title) {
        title.textContent = (typeof t === "function")
            ? t("Comments for Post #", "ความคิดเห็นของโพสต์ #") + postId
            : "Comments for Post #" + postId;
    }

    renderComments(postId);

    document.querySelectorAll(".post").forEach((p) => {
        if (p !== post) p.classList.add("dimmed");
    });

    post.classList.add("focus");

    document.getElementById("focusOverlay")?.classList.add("show");
    document.getElementById("commentPanel")?.classList.add("show");
}

function renderComments(postId) {
    const commentList = document.getElementById("commentList");
    if (!commentList) return;

    commentList.innerHTML = "";
    const comments = commentsData[postId] || [];

    comments.forEach((comment) => {
        const item = document.createElement("div");
        item.className = "comment-item";

        const user = document.createElement("span");
        user.className = "comment-user";

        const message = document.createElement("span");
        message.className = "comment-message";

        if (typeof comment === "string") {
            user.textContent = "Visitor:";
            message.textContent = comment.replace("Visitor:", "").trim();
        } else {
            user.textContent = comment.user + ":";
            message.textContent = comment.text;
        }

        item.appendChild(user);
        item.appendChild(message);
        commentList.appendChild(item);
    });
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
    const input = document.getElementById("commentInput");
    if (!input) return;

    const text = input.value.trim();
    if (text === "" || !activePostId) return;

    try {
        const response = await fetch(`${API_URL}/posts/${activePostId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: "Visitor",
                text: text
            })
        });

        if (!response.ok) {
            throw new Error("Cannot send comment");
        }

        const newComment = await response.json();

        if (!commentsData[activePostId]) commentsData[activePostId] = [];
        commentsData[activePostId].push(newComment);

        renderComments(activePostId);
        updateCommentCount(activePostId);

        input.value = "";

        if (typeof addNotification === "function") {
            addNotification("comment", "Visitor commented on your post.", activePostId);
        }
    } catch (error) {
        console.error("Comment error:", error);
        alert(typeof t === "function" ? t("Cannot send comment. Please check if the backend is running.", "ส่งคอมเมนต์ไม่ได้ เช็กว่า backend เปิดอยู่หรือยัง") : "ส่งคอมเมนต์ไม่ได้ เช็กว่า backend เปิดอยู่หรือยัง");
    }
}

function toggleCreatePost() {
    const createPost = document.getElementById("createPost");
    if (!createPost) return;

    const isOpen = createPost.classList.contains("show");
    closeAllPanels();

    if (!isOpen) createPost.classList.add("show");
}

function closeCreatePost() {
    document.getElementById("createPost")?.classList.remove("show");
}

function createPostElement(postData) {
    const post = document.createElement("div");
    post.className = "post";
    post.dataset.postId = postData.id;
    post.dataset.createdAt = new Date(postData.createdAt).getTime();

    post.innerHTML = `
        <div class="post-header">
            <img src="../pic/visitor.jpg" class="post-avatar" alt="Visitor">

            <div>
                <p class="post-name">${postData.username || "Visitor"}</p>
                <p class="post-time">just now</p>
            </div>

            <button type="button" class="post-menu-btn" onclick="togglePostMenu(this)">⋮</button>

            <div class="post-menu">
                <button type="button" onclick="showComingSoon('Edit Post')" data-en="Edit Post" data-th="แก้ไขโพสต์">Edit Post</button>
                <button type="button" onclick="showComingSoon('Delete Post')" data-en="Delete Post" data-th="ลบโพสต์">Delete Post</button>
            </div>
        </div>

        <div class="post-body">
            <p></p>
        </div>

        <div class="post-active">
            <button type="button" class="ti ti-heart btn-like" onclick="toggleLike(this)">
                <span class="like-count">${postData.likes || 0}</span>
            </button>

            <button type="button" class="ti ti-message-circle btn-comment" onclick="openComment(this)">
                <span class="comment-count">${postData.comments ? postData.comments.length : 0}</span>
            </button>

            <button type="button" class="ti ti-bookmark btn-save notification-disabled" onclick="toggleSave(this)"></button>

            <button type="button" class="ti ti-share-3 btn-share" onclick="sharePost(this)">
                <span class="share-count">${postData.shares || 0}</span>
            </button>
        </div>
    `;

    post.querySelector(".post-body p").textContent = postData.content;

    const likedKey = `acki-liked-${postData.id}`;
    const likeButton = post.querySelector(".btn-like");

    if (localStorage.getItem(likedKey) === "true") {
        likeButton.classList.add("liked", "ti-heart-filled");
        likeButton.classList.remove("ti-heart");
    }

    const savedKey = `acki-saved-${postData.id}`;
    const saveButton = post.querySelector(".btn-save");

    if (localStorage.getItem(savedKey) === "true") {
        saveButton.classList.add("saved", "ti-bookmark-filled");
        saveButton.classList.remove("ti-bookmark");
    }

    commentsData[postData.id] = postData.comments || [];

    return post;
}

async function createNewPost() {
    try {
        const textarea = document.getElementById("createText");
        const contentBox = document.querySelector(".content");
        if (!textarea || !contentBox) return;

        const text = textarea.value.trim();
        if (text === "") return;

        const response = await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "Visitor",
                content: text
            })
        });

        if (!response.ok) {
            throw new Error("Cannot create post");
        }

        const newPost = await response.json();
        const postElement = createPostElement(newPost);
        const firstPost = document.querySelector(".post");

        if (firstPost) {
            contentBox.insertBefore(postElement, firstPost);
        } else {
            contentBox.appendChild(postElement);
        }

        if (typeof applyLanguage === "function") applyLanguage();

        commentsData[newPost.id] = [];

        textarea.value = "";
        closeCreatePost();
        updatePostTimes();
    } catch (error) {
        console.error("Create post error:", error);
        alert(typeof t === "function" ? t("Cannot create post. Please check if the backend is running.", "สร้างโพสต์ไม่ได้ เช็กว่า backend เปิดอยู่หรือยัง") : "สร้างโพสต์ไม่ได้ เช็กว่า backend เปิดอยู่หรือยัง");
    }
}

async function loadPostsFromBackend() {
    const content = document.querySelector(".content");
    if (!content) return;

    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();

    posts.forEach((postData) => {
        const alreadyExists = document.querySelector(`.post[data-post-id="${postData.id}"]`);
        if (alreadyExists) return;

        const postElement = createPostElement(postData);
        const firstPost = document.querySelector(".post");
        content.insertBefore(postElement, firstPost);

        if (!commentsData[postData.id]) commentsData[postData.id] = [];
    });

    if (typeof applyLanguage === "function") applyLanguage();
    updatePostTimes();
}

function autoResizePost(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

async function toggleLike(button) {

    try {
        const post = button.closest(".post");
        const postId = post.dataset.postId;
        const countSpan = button.querySelector(".like-count");

        const likedKey = `acki-liked-${postId}`;
        const isLiked = localStorage.getItem(likedKey) === "true";
        const change = isLiked ? -1 : 1;

        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ change })
        });

        if (!response.ok) {
            throw new Error("Cannot update like");
        }

        const updatedPost = await response.json();

        if (isLiked) {
            localStorage.removeItem(likedKey);
            button.classList.remove("liked", "ti-heart-filled");
            button.classList.add("ti-heart");
        } else {
            localStorage.setItem(likedKey, "true");
            button.classList.add("liked", "ti-heart-filled");
            button.classList.remove("ti-heart");
        }

        countSpan.textContent = updatedPost.likes;
    } catch (error) {
        console.error("Like error:", error);
        alert(typeof t === "function" ? t("Cannot like this post. Please check the backend or /like route.", "กดหัวใจไม่ได้ เช็กว่า backend เปิดอยู่หรือมี route /like หรือยัง") : "กดหัวใจไม่ได้ เช็กว่า backend เปิดอยู่หรือมี route /like หรือยัง");
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
    const postId = post.dataset.postId;

    const isOpen = shareBox.classList.contains("show");
    const currentPost = shareBox.closest(".post");

    closeAllPanels();
    post.classList.add("share-active");

    if (isOpen && currentPost === post) return;

    if (typeof addNotification === "function") {
        addNotification("share", "Your post was shared.", postId);
    }

    const link = `${window.location.origin}${window.location.pathname}?post=${postId}`;
    const input = document.getElementById("shareLink");
    if (input) input.value = link;

    post.appendChild(shareBox);

    const postRect = post.getBoundingClientRect();
    const btnRect = button.getBoundingClientRect();

    shareBox.style.left = (btnRect.left - postRect.left + 40) + "px";
    shareBox.style.top = (btnRect.top - postRect.top - 20) + "px";

    shareBox.classList.add("show");
    shareOverlay.classList.add("show");
}

async function copyShareLink() {
    const input = document.getElementById("shareLink");
    const shareBox = document.getElementById("shareBox");
    if (!input || !shareBox) return;

    input.select();
    await navigator.clipboard.writeText(input.value);

    const post = shareBox.closest(".post");
    if (!post) return;

    const postId = post.dataset.postId;
    const countSpan = post.querySelector(".share-count");

    const response = await fetch(`${API_URL}/posts/${postId}/share`, {
        method: "PATCH"
    });

    const updatedPost = await response.json();

    if (countSpan) {
        countSpan.textContent = updatedPost.shares || 0;
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
        if (!postId) return;

        const post = document.querySelector(`.post[data-post-id="${postId}"]`);
        if (!post) return;

        post.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        setTimeout(() => {
            const commentBtn = post.querySelector(".btn-comment");
            if (commentBtn) openComment(commentBtn);
        }, 500);
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

document.addEventListener("DOMContentLoaded", () => {
    loadPostsFromBackend();

    document.querySelectorAll(".post").forEach((post) => {
        if (!post.dataset.createdAt) post.dataset.createdAt = Date.now();
    });

    updatePostTimes();
    setInterval(updatePostTimes, 30000);
    openPostFromUrl();
});
