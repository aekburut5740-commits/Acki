// Notification prototype: mini panel, full panel, and clickable post links.

let notifications = [
    { type: "comment", text: "Visitor commented on your post.", time: "just now", postId: "1" },
    { type: "like", text: "Visitor liked your post.", time: "2 min ago", postId: "2" },
    { type: "share", text: "Your post was shared.", time: "5 min ago", postId: "3" }
];

let currentNotificationFilter = "all";

function showNotificationDot() {
    const dot = document.getElementById("notificationDot");
    if (dot) dot.classList.add("show");
}

function hideNotificationDot() {
    const dot = document.getElementById("notificationDot");
    if (dot) dot.classList.remove("show");
}

function addNotification(type, text, postId) {
    notifications.unshift({
        type,
        text,
        time: "just now",
        postId
    });

    showNotificationDot();
    renderNotificationMini();
    renderNotificationFull();
}

function closeNotificationPanels() {
    const mini = document.getElementById("notificationMini");
    const blur = document.getElementById("notificationBlur");
    const full = document.getElementById("notificationFull");

    if (mini) mini.classList.remove("show");
    if (blur) blur.classList.remove("show");
    if (full) full.classList.remove("show");
}

function toggleNotificationMini() {
    const mini = document.getElementById("notificationMini");
    const full = document.getElementById("notificationFull");
    const blur = document.getElementById("notificationBlur");

    if (!mini) {
        goCommunity();
        return;
    }

    hideNotificationDot();

    if (full) full.classList.remove("show");
    if (blur) blur.classList.remove("show");

    renderNotificationMini();
    mini.classList.toggle("show");
}

function renderNotificationMini() {
    const list = document.getElementById("notificationMiniList");
    if (!list) return;

    list.innerHTML = "";

    notifications.slice(0, 3).forEach((noti) => {
        const item = document.createElement("div");
        item.className = "notification-item-mini";
        item.innerHTML = `
            ${noti.text}
            <span>${noti.time}</span>
        `;

        item.onclick = () => openPostFromNotification(noti.postId);
        list.appendChild(item);
    });
}

function openNotificationFull() {
    const mini = document.getElementById("notificationMini");
    const blur = document.getElementById("notificationBlur");
    const full = document.getElementById("notificationFull");

    if (mini) mini.classList.remove("show");
    if (blur) blur.classList.add("show");
    if (full) full.classList.add("show");

    renderNotificationFull();
}

function closeNotificationFull() {
    const blur = document.getElementById("notificationBlur");
    const full = document.getElementById("notificationFull");

    if (blur) blur.classList.remove("show");
    if (full) full.classList.remove("show");
}

function filterNotification(type, event) {
    currentNotificationFilter = type;

    document.querySelectorAll(".notification-tabs button").forEach((btn) => {
        btn.classList.remove("active");
    });

    const target = event?.target || window.event?.target;
    if (target) target.classList.add("active");

    renderNotificationFull();
}

function renderNotificationFull() {
    const list = document.getElementById("notificationFullList");
    if (!list) return;

    list.innerHTML = "";

    const filtered = currentNotificationFilter === "all"
        ? notifications
        : notifications.filter((noti) => noti.type === currentNotificationFilter);

    filtered.forEach((noti) => {
        const item = document.createElement("div");
        item.className = "notification-item-full";
        item.innerHTML = `
            ${noti.text}
            <span>${noti.time}</span>
        `;

        item.onclick = () => openPostFromNotification(noti.postId);
        list.appendChild(item);
    });
}

function openPostFromNotification(postId) {
    closeNotificationPanels();

    const post = document.querySelector(`.post[data-post-id="${postId}"]`);

    // If the user clicks a notification from Contact/About, jump to Community.
    if (!post) {
        window.location.href = `/page/community.html?post=${postId}`;
        return;
    }

    post.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    setTimeout(() => {
        const commentBtn = post.querySelector(".btn-comment");
        if (commentBtn && typeof openComment === "function") {
            openComment(commentBtn);
        }
    }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
    renderNotificationMini();
    renderNotificationFull();
});
