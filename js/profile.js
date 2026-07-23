const profileLoading = document.getElementById("profileLoading");
const profileContent = document.getElementById("profileContent");
const profileDisplayName = document.getElementById("profileDisplayName");
const profileUsername = document.getElementById("profileUsername");
const profileJoined = document.getElementById("profileJoined");
const profileAvatar = document.getElementById("profileAvatar");
const profileTabContent = document.getElementById("profileTabContent");
const profileCreatePostButton = document.getElementById("profileCreatePostButton");

let currentProfileTab = "posts";
let viewedAccount = null;
let currentAccount = null;
let viewingOwnProfile = false;
let profilePosts = [];
let editingPostId = null;
let deletingPostId = null;

function formatJoinedDate(dateValue) {
    if (!dateValue) return "Joined date unavailable";

    const date = new Date(dateValue);
    return `Joined ${date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })}`;
}

function formatPostTime(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function setAvatar(element, account) {
    const initial = account?.displayName?.trim()?.charAt(0) || account?.username?.trim()?.charAt(0) || "?";
    element.innerHTML = "";

    if (account?.avatarUrl) {
        const image = document.createElement("img");
        image.src = account.avatarUrl;
        image.alt = account.displayName || account.username || "Profile";
        image.onerror = () => {
            element.innerHTML = "";
            element.textContent = initial.toUpperCase();
        };
        element.appendChild(image);
        return;
    }

    element.textContent = initial.toUpperCase();
}

function displayAccount(account) {
    profileDisplayName.textContent = account.displayName || account.username || "Unknown";
    profileUsername.textContent = `@${account.username || "unknown"}`;
    profileJoined.textContent = formatJoinedDate(account.createdAt);
    setAvatar(profileAvatar, account);
}

async function fetchProfileAccount(accountId) {
    const response = await fetch(`${ACKI_API_URL}/accounts/${accountId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Cannot load profile");
    return data.account || data;
}

async function loadProfilePosts() {
    if (!viewedAccount?.id) return;

    const response = await fetch(`${ACKI_API_URL}/accounts/${viewedAccount.id}/posts`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Cannot load posts");

    profilePosts = Array.isArray(data) ? data : [];
    if (currentProfileTab === "posts") renderPostsTab();
}

async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const requestedId = Number(params.get("id"));
    currentAccount = getStoredAccount();

    const hasRequestedId = Number.isInteger(requestedId) && requestedId > 0;

    try {
        if (!hasRequestedId) {
            if (!isLoggedIn()) {
                window.location.href = "./login.html";
                return;
            }
            viewedAccount = await fetchCurrentAccount();
        } else {
            viewedAccount = await fetchProfileAccount(requestedId);
        }

        currentAccount = getStoredAccount() || currentAccount;
        viewingOwnProfile = Boolean(
            currentAccount && String(currentAccount.id) === String(viewedAccount.id)
        );

        displayAccount(viewedAccount);
        profileCreatePostButton.hidden = !viewingOwnProfile;
        profileLoading.hidden = true;
        profileContent.hidden = false;

        await loadProfilePosts();
    } catch (error) {
        profileLoading.textContent = error.message;
    }
}

function switchProfileTab(tab, button) {
    currentProfileTab = tab;
    document.querySelectorAll(".profile-tab").forEach((tabButton) => {
        tabButton.classList.remove("active");
    });
    button.classList.add("active");
    renderProfileTab(tab);
}

function renderProfileTab(tab) {
    if (tab === "posts") {
        renderPostsTab();
        return;
    }

    const state = tab === "likes"
        ? { icon: "ti-heart", text: "Liked posts will appear here." }
        : { icon: "ti-bookmark", text: "Saved posts will appear here." };

    profileTabContent.innerHTML = `
        <div class="profile-empty-state">
            <i class="ti ${state.icon}"></i>
            <p>${state.text}</p>
        </div>
    `;
}

function createOwnerButton(post) {
    const owner = document.createElement("button");
    owner.type = "button";
    owner.className = "profile-card-owner";
    owner.addEventListener("click", (event) => {
        event.stopPropagation();
        window.location.href = `./profile.html?id=${post.account.id}`;
    });

    const avatar = document.createElement("span");
    avatar.className = "profile-card-avatar";
    setAvatar(avatar, post.account);

    const identity = document.createElement("span");
    identity.className = "profile-card-identity";

    const name = document.createElement("strong");
    name.textContent = post.account.displayName || post.account.username || "Unknown";

    const username = document.createElement("small");
    username.textContent = `@${post.account.username || "unknown"}`;

    identity.append(name, username);
    owner.append(avatar, identity);
    return owner;
}

function createProfilePostCard(post) {
    const card = document.createElement("article");
    card.className = "profile-post-card";
    card.tabIndex = 0;
    card.addEventListener("click", () => openPostFromProfile(post.id));
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPostFromProfile(post.id);
        }
    });

    const header = document.createElement("header");
    header.className = "profile-card-header";
    header.appendChild(createOwnerButton(post));

    if (viewingOwnProfile) {
        const menuWrap = document.createElement("div");
        menuWrap.className = "profile-card-menu-wrap";

        const menuButton = document.createElement("button");
        menuButton.type = "button";
        menuButton.className = "profile-card-menu-button";
        menuButton.innerHTML = '<i class="ti ti-dots"></i>';
        menuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            document.querySelectorAll(".profile-card-menu.show").forEach((menu) => {
                if (menu !== menuButton.nextElementSibling) menu.classList.remove("show");
            });
            menuButton.nextElementSibling.classList.toggle("show");
        });

        const menu = document.createElement("div");
        menu.className = "profile-card-menu";
        menu.innerHTML = `
            <button type="button" data-action="edit"><i class="ti ti-pencil"></i> Edit</button>
            <button type="button" data-action="delete" class="danger"><i class="ti ti-trash"></i> Delete</button>
        `;
        menu.addEventListener("click", (event) => event.stopPropagation());
        menu.querySelector('[data-action="edit"]').addEventListener("click", () => openProfileComposer(post));
        menu.querySelector('[data-action="delete"]').addEventListener("click", () => openProfileDeleteModal(post.id));

        menuWrap.append(menuButton, menu);
        header.appendChild(menuWrap);
    }

    const text = document.createElement("p");
    text.className = "profile-card-text";
    text.textContent = post.content;

    const footer = document.createElement("footer");
    footer.className = "profile-card-footer";
    footer.innerHTML = `
        <span><i class="ti ti-heart"></i>${post.likeCount ?? 0}</span>
        <span><i class="ti ti-message-circle"></i>${post.commentCount ?? 0}</span>
        <time>${formatPostTime(post.createdAt)}</time>
    `;

    card.append(header, text, footer);
    return card;
}

function renderPostsTab() {
    profileTabContent.innerHTML = "";

    if (profilePosts.length === 0) {
        profileTabContent.innerHTML = `
            <div class="profile-empty-state">
                <i class="ti ti-notes"></i>
                <p>No posts yet.</p>
            </div>
        `;
        return;
    }

    const grid = document.createElement("div");
    grid.className = "profile-post-grid";
    profilePosts.forEach((post) => grid.appendChild(createProfilePostCard(post)));
    profileTabContent.appendChild(grid);
}

function openPostFromProfile(postId) {
    window.location.href = `./community.html?post=${postId}`;
}

function openProfileComposer(post = null) {
    if (!viewingOwnProfile) return;

    editingPostId = post?.id || null;
    document.getElementById("profileComposerTitle").textContent = editingPostId ? "Edit Post" : "Create Post";
    document.getElementById("profileComposerSubmit").textContent = editingPostId ? "Save" : "Post";
    document.getElementById("profileComposerText").value = post?.content || "";

    const composer = document.getElementById("profileComposer");
    composer.classList.add("show");
    composer.setAttribute("aria-hidden", "false");
    setTimeout(() => document.getElementById("profileComposerText").focus(), 250);
}

function closeProfileComposer() {
    const composer = document.getElementById("profileComposer");
    composer.classList.remove("show");
    composer.setAttribute("aria-hidden", "true");
    editingPostId = null;
    document.getElementById("profileComposerText").value = "";
}

async function submitProfilePost() {
    const token = getToken();
    const textarea = document.getElementById("profileComposerText");
    const submitButton = document.getElementById("profileComposerSubmit");
    const content = textarea.value.trim();

    if (!token || !content) return;

    submitButton.disabled = true;

    try {
        const url = editingPostId
            ? `${ACKI_API_URL}/posts/${editingPostId}`
            : `${ACKI_API_URL}/posts`;

        const response = await fetch(url, {
            method: editingPostId ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Cannot save post");

        closeProfileComposer();
        await loadProfilePosts();
    } catch (error) {
        alert(error.message);
    } finally {
        submitButton.disabled = false;
    }
}

function openProfileDeleteModal(postId) {
    deletingPostId = postId;
    document.getElementById("profileDeleteOverlay").classList.add("show");
    document.getElementById("profileDeleteModal").classList.add("show");
}

function closeProfileDeleteModal() {
    deletingPostId = null;
    document.getElementById("profileDeleteOverlay").classList.remove("show");
    document.getElementById("profileDeleteModal").classList.remove("show");
}

async function confirmProfileDelete() {
    const token = getToken();
    if (!token || !deletingPostId) return;

    try {
        const response = await fetch(`${ACKI_API_URL}/posts/${deletingPostId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Cannot delete post");

        closeProfileDeleteModal();
        await loadProfilePosts();
    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener("click", () => {
    document.querySelectorAll(".profile-card-menu.show").forEach((menu) => menu.classList.remove("show"));
});

loadProfile();
