// Community feed: posts, comments, likes, saves, share links.

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
    if (title) title.textContent = "Comments for Post #" + postId;

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

function sendComment() {
    const input = document.getElementById("commentInput");
    if (!input) return;

    const text = input.value.trim();
    if (text === "" || !activePostId) return;

    if (!commentsData[activePostId]) commentsData[activePostId] = [];

    commentsData[activePostId].push({ user: "Visitor", text });

    if (typeof addNotification === "function") {
        addNotification("comment", "Visitor commented on your post.", activePostId);
    }

    renderComments(activePostId);
    updateCommentCount(activePostId);
    input.value = "";
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

function closeAllPanels() {
    closeComment();
    closeCreatePost();
    closeShareBox();

    if (typeof closeNotificationPanels === "function") {
        closeNotificationPanels();
    }
}

function createNewPost() {
    const textarea = document.getElementById("createText");
    const content = document.querySelector(".content");
    if (!textarea || !content) return;

    const text = textarea.value.trim();
    if (text === "") return;

    const post = document.createElement("div");
    post.className = "post";
    post.dataset.postId = nextPostId;
    post.dataset.createdAt = Date.now();

    post.innerHTML = `
        <div class="post-header">
            <img src="../pic/sss.jpg" class="post-avatar" alt="Visitor">
            <div>
                <p class="post-name">Visitor</p>
                <p class="post-time">just now</p>
            </div>
        </div>

        <div class="post-body">
            <p></p>
        </div>

        <div class="post-active">
            <button class="ti ti-heart btn-like" onclick="toggleLike(this)">
                <span class="like-count">0</span>
            </button>
            <button class="ti ti-message-circle btn-comment" onclick="openComment(this)">
                <span class="comment-count">0</span>
            </button>
            <button class="ti ti-bookmark btn-save" onclick="toggleSave(this)"></button>
            <button class="ti ti-share-3 btn-share" onclick="sharePost(this)"></button>
        </div>
    `;

    post.querySelector(".post-body p").textContent = text;

    const firstPost = document.querySelector(".post");
    content.insertBefore(post, firstPost);

    updatePostTimes();
    commentsData[nextPostId] = [];
    nextPostId++;

    textarea.value = "";
    closeCreatePost();
}

function autoResizePost(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

function toggleLike(button) {
    const countSpan = button.querySelector(".like-count");
    let count = Number(countSpan.textContent);

    if (button.classList.contains("liked")) {
        button.classList.remove("liked");
        button.classList.remove("ti-heart-filled");
        button.classList.add("ti-heart");
        count--;
    } else {
        button.classList.add("liked");
        button.classList.remove("ti-heart");
        button.classList.add("ti-heart-filled");
        count++;

        const post = button.closest(".post");
        if (typeof addNotification === "function") {
            addNotification("like", "Visitor liked your post.", post.dataset.postId);
        }
    }

    countSpan.textContent = count;
}

function toggleSave(button) {
    if (button.classList.contains("saved")) {
        button.classList.remove("saved");
        button.classList.remove("ti-bookmark-filled");
        button.classList.add("ti-bookmark");
    } else {
        button.classList.add("saved");
        button.classList.remove("ti-bookmark");
        button.classList.add("ti-bookmark-filled");
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

    if (diff < 60) return "just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return minutes + " min ago";

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + " hr ago";

    const days = Math.floor(hours / 24);
    return days + " day ago";
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

function copyShareLink() {
    const input = document.getElementById("shareLink");
    if (!input) return;

    input.select();
    navigator.clipboard.writeText(input.value);
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

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".post").forEach((post) => {
        if (!post.dataset.createdAt) post.dataset.createdAt = Date.now();
    });

    updatePostTimes();
    setInterval(updatePostTimes, 30000);
    openPostFromUrl();
});
