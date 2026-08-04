let allFeedbacks = [];

function feedbackTimeAgo(value) {
    const time = new Date(value).getTime();
    if (!Number.isFinite(time)) return "";

    const lang = getCurrentLanguage();
    const diffSeconds = Math.max(0, Math.floor((Date.now() - time) / 1000));

    if (diffSeconds < 60) return lang === "th" ? "เมื่อกี้" : "just now";

    const minutes = Math.floor(diffSeconds / 60);
    if (minutes < 60) return lang === "th" ? `${minutes} นาทีที่แล้ว` : `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return lang === "th" ? `${hours} ชม.ที่แล้ว` : `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return lang === "th" ? `${days} วันที่แล้ว` : `${days} day ago`;
}

function createFeedbackCard(feedback) {
    const currentAccount = getStoredAccount();
    const isOwner = currentAccount && String(currentAccount.id) === String(feedback.account.id);

    const card = document.createElement("article");
    card.className = "feedback-card";

    const header = document.createElement("div");
    header.className = "feedback-card-header";

    const avatar = document.createElement("div");
    avatar.className = "feedback-avatar";
    setAvatar(avatar, feedback.account);

    const identity = document.createElement("div");
    identity.className = "feedback-identity";
    identity.innerHTML = `
        <strong>${feedback.account.displayName || feedback.account.username}</strong>
        <small>@${feedback.account.username}</small>
    `;

    const time = document.createElement("span");
    time.className = "feedback-time";
    time.textContent = feedbackTimeAgo(feedback.createdAt);

    header.append(avatar, identity, time);

    if (isOwner) {
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "feedback-delete-btn";
        deleteButton.innerHTML = '<i class="ti ti-trash"></i>';
        deleteButton.onclick = () => deleteFeedback(feedback.id);
        header.appendChild(deleteButton);
    }

    const text = document.createElement("p");
    text.className = "feedback-text";
    text.textContent = feedback.content;

    const actions = document.createElement("div");
    actions.className = "feedback-actions";

    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.className = `like ${feedback.myReaction === "like" ? "active" : ""}`;
    likeButton.innerHTML = `<i class="ti ti-thumb-up"></i> <span>${feedback.likeCount}</span>`;
    likeButton.onclick = () => reactToFeedback(feedback.id, "like");

    const dislikeButton = document.createElement("button");
    dislikeButton.type = "button";
    dislikeButton.className = `dislike ${feedback.myReaction === "dislike" ? "active" : ""}`;
    dislikeButton.innerHTML = `<i class="ti ti-thumb-down"></i> <span>${feedback.dislikeCount}</span>`;
    dislikeButton.onclick = () => reactToFeedback(feedback.id, "dislike");

    actions.append(likeButton, dislikeButton);
    card.append(header, text, actions);

    return card;
}

function renderFeedbackList() {
    const list = document.getElementById("feedbackList");
    list.innerHTML = "";

    if (allFeedbacks.length === 0) {
        list.innerHTML = `<p class="feedback-empty">No feedback yet. Be the first!</p>`;
        return;
    }

    allFeedbacks.forEach((feedback) => list.appendChild(createFeedbackCard(feedback)));
}

async function loadFeedbacks() {
    try {
        const token = getToken();
        const response = await fetch(`${ACKI_API_URL}/feedbacks`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Cannot load feedbacks");

        allFeedbacks = Array.isArray(data) ? data : [];
        renderFeedbackList();
    } catch (error) {
        document.getElementById("feedbackList").innerHTML =
            `<p class="feedback-empty">${error.message}</p>`;
    }
}

async function submitFeedback() {
    const token = getToken();
    if (!token) return;

    const input = document.getElementById("feedbackInput");
    const submitButton = document.getElementById("feedbackSubmitButton");
    const content = input.value.trim();

    if (!content) return;

    submitButton.disabled = true;

    try {
        const response = await fetch(`${ACKI_API_URL}/feedbacks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Cannot post feedback");

        input.value = "";
        allFeedbacks.unshift(data);
        renderFeedbackList();
    } catch (error) {
        alert(error.message);
    } finally {
        submitButton.disabled = false;
    }
}

async function reactToFeedback(feedbackId, type) {
    const token = getToken();
    if (!token) {
        alert("Please log in first.");
        return;
    }

    try {
        const response = await fetch(`${ACKI_API_URL}/feedbacks/${feedbackId}/react`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ type })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Cannot react to feedback");

        const feedback = allFeedbacks.find((item) => item.id === feedbackId);
        if (feedback) {
            feedback.likeCount = data.likeCount;
            feedback.dislikeCount = data.dislikeCount;
            feedback.myReaction = data.myReaction;
        }

        renderFeedbackList();
    } catch (error) {
        alert(error.message);
    }
}

let confirmDeleteCallback = null;

function openConfirmPopup(callback) {

    confirmDeleteCallback = callback;

    const popup = document.getElementById("confirmPopup");

    popup.classList.add("show");
}

function closeConfirmPopup() {

    document.getElementById("confirmPopup")
        .classList.remove("show");

    confirmDeleteCallback = null;
}

document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("confirmDeleteButton")
        .onclick = () => {

            if (confirmDeleteCallback) {

                confirmDeleteCallback();
            }

            closeConfirmPopup();
        };

});

async function deleteFeedback(feedbackId) {
    const token = getToken();
    if (!token) return;

    openConfirmPopup(async () => {

        try {

            const response = await fetch(`${ACKI_API_URL}/feedbacks/${feedbackId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok)
                throw new Error(data.message || "Cannot delete feedback");

            allFeedbacks = allFeedbacks.filter(item => item.id !== feedbackId);

            renderFeedbackList();

        } catch (error) {

            alert(error.message);

        }

    });
    return;

    try {
        const response = await fetch(`${ACKI_API_URL}/feedbacks/${feedbackId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Cannot delete feedback");

        allFeedbacks = allFeedbacks.filter((item) => item.id !== feedbackId);
        renderFeedbackList();
    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();

    document.getElementById("feedbackComposer").hidden = !token;
    document.getElementById("feedbackLoginHint").hidden = Boolean(token);

    loadFeedbacks();
});

window.addEventListener("acki-language-change", () => {
    renderFeedbackList();
});