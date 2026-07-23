const profileLoading = document.getElementById("profile-loading");
const profileContent = document.getElementById("profile-content");

const profileDisplayName = document.getElementById("profile-display-name");
const profileUsername = document.getElementById("profile-username");
const profileCreatedAt = document.getElementById("profile-created-at");

const avatarPreview = document.getElementById("avatar-preview");
const avatarPlaceholder = document.getElementById("avatar-placeholder");

function formatJoinedDate(dateValue) {
  if (!dateValue) {
    return "Joined date unavailable";
  }

  const date = new Date(dateValue);

  return `Joined ${date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })}`;
}

function showAvatar(avatarUrl, displayName, username) {
  const firstCharacter =
    displayName?.trim().charAt(0) ||
    username?.trim().charAt(0) ||
    "?";

  avatarPlaceholder.textContent = firstCharacter;

  if (!avatarUrl) {
    avatarPreview.style.display = "none";
    avatarPlaceholder.style.display = "flex";
    avatarPreview.removeAttribute("src");
    return;
  }

  avatarPreview.onload = () => {
    avatarPreview.style.display = "block";
    avatarPlaceholder.style.display = "none";
  };

  avatarPreview.onerror = () => {
    avatarPreview.style.display = "none";
    avatarPlaceholder.style.display = "flex";
  };

  avatarPreview.src = avatarUrl;
}

function displayAccount(account) {
  profileDisplayName.textContent =
    account.displayName || account.username || "Unknown";

  profileUsername.textContent = `@${account.username || "unknown"}`;
  profileCreatedAt.textContent = formatJoinedDate(account.createdAt);

  showAvatar(
    account.avatarUrl,
    account.displayName,
    account.username
  );
}

async function loadProfile() {
  const params = new URLSearchParams(window.location.search);
  const profileAccountId = Number(params.get("id"));
  const currentAccount = getStoredAccount();

  const hasValidProfileId =
    Number.isInteger(profileAccountId) &&
    profileAccountId > 0;

  const viewingOwnProfile =
    !hasValidProfileId ||
    (
      currentAccount &&
      String(currentAccount.id) === String(profileAccountId)
    );

  try {
    let account;

    if (viewingOwnProfile) {
      if (!isLoggedIn()) {
        window.location.href = "./login.html";
        return;
      }

      account = await fetchCurrentAccount();
    } else {
      const response = await fetch(
        `${ACKI_API_URL}/accounts/${profileAccountId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cannot load profile");
      }

      account = data.account || data;
    }

    displayAccount(account);

    profileLoading.hidden = true;
    profileContent.hidden = false;
  } catch (error) {
    profileLoading.textContent = error.message;
  }
}

let currentProfileTab = "posts";

function switchProfileTab(tab, button) {
    currentProfileTab = tab;

    document
        .querySelectorAll(".profile-tab")
        .forEach((tabButton) => {
            tabButton.classList.remove("active");
        });

    button.classList.add("active");

    renderProfileTab(tab);
}

function renderProfileTab(tab) {
    const content =
        document.getElementById(
            "profileTabContent"
        );

    if (!content) return;

    const emptyStates = {
        posts: {
            icon: "ti-notes",
            text: "No posts yet."
        },

        likes: {
            icon: "ti-heart",
            text: "No liked posts yet."
        },

        saved: {
            icon: "ti-bookmark",
            text: "No saved posts yet."
        }
    };

    const state =
        emptyStates[tab] ||
        emptyStates.posts;

    content.innerHTML = `
        <div class="profile-empty-state">
            <i class="ti ${state.icon}"></i>
            <p>${state.text}</p>
        </div>
    `;
}

loadProfile();
