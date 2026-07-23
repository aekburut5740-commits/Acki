// Notifications loaded from the Acki backend.

let notifications = [];
let currentNotificationFilter = "all";
let notificationPollTimer = null;

function notificationTimeAgo(value) {
    const time = new Date(value).getTime();
    if (!Number.isFinite(time)) return "";

    const diffSeconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
    const lang = typeof getCurrentLanguage === "function"
        ? getCurrentLanguage()
        : "en";

    if (diffSeconds < 60) {
        return lang === "th" ? "เมื่อกี้" : "just now";
    }

    const minutes = Math.floor(diffSeconds / 60);
    if (minutes < 60) {
        return lang === "th"
            ? `${minutes} นาทีที่แล้ว`
            : `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return lang === "th"
            ? `${hours} ชม.ที่แล้ว`
            : `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);
    return lang === "th"
        ? `${days} วันที่แล้ว`
        : `${days} day ago`;
}

function showNotificationDot() {
    document.getElementById("notificationDot")?.classList.add("show");
}

function hideNotificationDot() {
    document.getElementById("notificationDot")?.classList.remove("show");
}

function updateNotificationDot() {
    const hasUnread = notifications.some((notification) => !notification.isRead);
    hasUnread ? showNotificationDot() : hideNotificationDot();
}

async function loadNotifications({ silent = false } = {}) {
    const token = typeof getToken === "function" ? getToken() : null;

    if (!token) {
        notifications = [];
        updateNotificationDot();
        renderNotificationMini();
        renderNotificationFull();
        return;
    }

    try {
        const response = await fetch(`${ACKI_API_URL}/notifications`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Cannot load notifications");
        }

        notifications = Array.isArray(data) ? data : [];
        updateNotificationDot();
        renderNotificationMini();
        renderNotificationFull();
    } catch (error) {
        if (!silent) {
            console.error("Load notifications error:", error);
        }
    }
}

async function markNotificationsAsRead() {
    const token = typeof getToken === "function" ? getToken() : null;
    if (!token || !notifications.some((notification) => !notification.isRead)) {
        hideNotificationDot();
        return;
    }

    try {
        const response = await fetch(`${ACKI_API_URL}/notifications/read`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Cannot mark notifications as read");
        }

        notifications = notifications.map((notification) => ({
            ...notification,
            isRead: true
        }));

        hideNotificationDot();
        renderNotificationMini();
        renderNotificationFull();
    } catch (error) {
        console.error("Mark notifications as read error:", error);
    }
}

function closeNotificationPanels() {
    document.getElementById("notificationMini")?.classList.remove("show");
    document.getElementById("notificationBlur")?.classList.remove("show");
    document.getElementById("notificationFull")?.classList.remove("show");
}

async function toggleNotificationMini() {
    const mini = document.getElementById("notificationMini");

    if (!mini) {
        window.location.href = "/page/community.html";
        return;
    }

    document.getElementById("notificationFull")?.classList.remove("show");
    document.getElementById("notificationBlur")?.classList.remove("show");

    await loadNotifications({ silent: true });
    mini.classList.toggle("show");

    if (mini.classList.contains("show")) {
        await markNotificationsAsRead();
    }
}

function createNotificationItem(notification, className) {
    const item = document.createElement("div");
    item.className = className;

    if (!notification.isRead) {
        item.classList.add("unread");
    }

    const text = document.createElement("div");
    text.className = "notification-text";
    text.textContent = notification.text || "Notification";

    const time = document.createElement("span");
    time.textContent = notificationTimeAgo(notification.createdAt);

    item.append(text, time);
    item.addEventListener("click", () => {
        openPostFromNotification(notification.postId);
    });

    return item;
}

function renderNotificationMini() {
    const list = document.getElementById("notificationMiniList");
    if (!list) return;

    list.innerHTML = "";

    const latest = notifications.slice(0, 3);

    if (latest.length === 0) {
        const empty = document.createElement("p");
        empty.className = "notification-empty";
        empty.textContent = typeof t === "function"
            ? t("No notifications yet.", "ยังไม่มีการแจ้งเตือน")
            : "No notifications yet.";
        list.appendChild(empty);
        return;
    }

    latest.forEach((notification) => {
        list.appendChild(
            createNotificationItem(notification, "notification-item-mini")
        );
    });
}

async function openNotificationFull() {
    document.getElementById("notificationMini")?.classList.remove("show");
    document.getElementById("notificationBlur")?.classList.add("show");
    document.getElementById("notificationFull")?.classList.add("show");

    await loadNotifications({ silent: true });
    await markNotificationsAsRead();
    renderNotificationFull();
}

function closeNotificationFull() {
    document.getElementById("notificationBlur")?.classList.remove("show");
    document.getElementById("notificationFull")?.classList.remove("show");
}

function filterNotification(type, event) {
    currentNotificationFilter = type;

    document.querySelectorAll(".notification-tabs button").forEach((button) => {
        button.classList.remove("active");
    });

    event?.currentTarget?.classList.add("active");
    renderNotificationFull();
}

function renderNotificationFull() {
    const list = document.getElementById("notificationFullList");
    if (!list) return;

    list.innerHTML = "";

    const filtered = currentNotificationFilter === "all"
        ? notifications
        : notifications.filter(
            (notification) => notification.type === currentNotificationFilter
        );

    if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.className = "notification-empty";
        empty.textContent = typeof t === "function"
            ? t("No notifications in this category.", "ไม่มีการแจ้งเตือนในหมวดนี้")
            : "No notifications in this category.";
        list.appendChild(empty);
        return;
    }

    filtered.forEach((notification) => {
        list.appendChild(
            createNotificationItem(notification, "notification-item-full")
        );
    });
}

function openPostFromNotification(postId) {
    closeNotificationPanels();

    if (!postId) return;

    const post = document.querySelector(`.post[data-post-id="${postId}"]`);

    if (!post) {
        window.location.href = `/page/community.html?post=${postId}`;
        return;
    }

    post.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    setTimeout(() => {
        const commentButton = post.querySelector(".btn-comment");
        if (commentButton && typeof openComment === "function") {
            openComment(commentButton);
        }
    }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
    loadNotifications();

    notificationPollTimer = window.setInterval(() => {
        loadNotifications({ silent: true });
    }, 10000);
});

window.addEventListener("acki-language-change", () => {
    renderNotificationMini();
    renderNotificationFull();
});
