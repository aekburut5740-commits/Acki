const profileLoading = document.getElementById("profile-loading");
const profileContent = document.getElementById("profile-content");

const profileForm = document.getElementById("profile-form");
const profileMessage = document.getElementById("profile-message");
const saveProfileButton = document.getElementById(
  "save-profile-button"
);

const displayNameInput = document.getElementById("display-name");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const bioInput = document.getElementById("bio");
const avatarUrlInput = document.getElementById("avatar-url");

const profileDisplayName = document.getElementById(
  "profile-display-name"
);
const profileUsername = document.getElementById("profile-username");
const profileCreatedAt = document.getElementById(
  "profile-created-at"
);

const avatarPreview = document.getElementById("avatar-preview");
const avatarPlaceholder = document.getElementById(
  "avatar-placeholder"
);

const bioCounter = document.getElementById("bio-counter");
const logoutButton = document.getElementById("logout-button");

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

function updateBioCounter() {
  const bioLength = bioInput.value.length;
  bioCounter.textContent = `${bioLength} / 300`;
}

function showAvatar(avatarUrl, displayName) {
  const firstCharacter =
    displayName?.trim().charAt(0) ||
    usernameInput.value.trim().charAt(0) ||
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
  displayNameInput.value = account.displayName || "";
  usernameInput.value = account.username || "";
  emailInput.value = account.email || "";
  bioInput.value = account.bio || "";
  avatarUrlInput.value = account.avatarUrl || "";

  profileDisplayName.textContent =
    account.displayName || account.username || "Unknown";

  profileUsername.textContent = `@${account.username || "unknown"}`;

  profileCreatedAt.textContent = formatJoinedDate(
    account.createdAt
  );

  updateBioCounter();

  showAvatar(
    account.avatarUrl,
    account.displayName
  );
}

async function loadProfile() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const profileAccountId =
    Number(params.get("id"));

  const currentAccount =
    getStoredAccount();

  const hasValidProfileId =
    Number.isInteger(profileAccountId) &&
    profileAccountId > 0;

  const viewingOwnProfile =
    !hasValidProfileId ||
    (
      currentAccount &&
      String(currentAccount.id) ===
      String(profileAccountId)
    );

  try {
    let account;

    if (viewingOwnProfile) {
      if (!isLoggedIn()) {
        window.location.href =
          "./login.html";

        return;
      }

      account =
        await fetchCurrentAccount();
    } else {
      const response = await fetch(
        `${ACKI_API_URL}/accounts/${profileAccountId}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Cannot load profile"
        );
      }

      account = data.account || data;
    }

    displayAccount(account);

    setProfileMode(
      viewingOwnProfile
    );

    profileLoading.hidden = true;
    profileContent.hidden = false;
  } catch (error) {
    profileLoading.textContent =
      error.message;
  }
}

function setProfileMode(
  viewingOwnProfile
) {
  if (viewingOwnProfile) {
    profileForm.hidden = false;
    logoutButton.hidden = false;

    return;
  }

  profileForm.hidden = true;
  logoutButton.hidden = true;
}

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = getToken();

  if (!token) {
    window.location.href = "./login.html";
    return;
  }

  const displayName = displayNameInput.value.trim();
  const bio = bioInput.value.trim();
  const avatarUrl = avatarUrlInput.value.trim();

  profileMessage.textContent = "";
  profileMessage.className = "form-message";

  if (displayName.length < 2) {
    profileMessage.textContent =
      "Display name must be at least 2 characters";

    profileMessage.classList.add("error");
    return;
  }

  saveProfileButton.disabled = true;
  saveProfileButton.textContent = "Saving...";

  try {
    const response = await fetch(`${ACKI_API_URL}/me`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        displayName,
        bio,
        avatarUrl
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Cannot update profile"
      );
    }

    localStorage.setItem(
      ACKI_ACCOUNT_KEY,
      JSON.stringify(data.account)
    );

    displayAccount(data.account);

    profileMessage.textContent =
      "Profile updated successfully";

    profileMessage.classList.add("success");
  } catch (error) {
    profileMessage.textContent = error.message;
    profileMessage.classList.add("error");
  } finally {
    saveProfileButton.disabled = false;
    saveProfileButton.textContent = "Save profile";
  }
});

bioInput.addEventListener("input", updateBioCounter);

avatarUrlInput.addEventListener("input", () => {
  showAvatar(
    avatarUrlInput.value.trim(),
    displayNameInput.value
  );
});

displayNameInput.addEventListener("input", () => {
  profileDisplayName.textContent =
    displayNameInput.value.trim() ||
    usernameInput.value ||
    "Unknown";

  showAvatar(
    avatarUrlInput.value.trim(),
    displayNameInput.value
  );
});

logoutButton.addEventListener("click", () => {
  logout();
});

loadProfile();