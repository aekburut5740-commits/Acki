const ACKI_API_URL = "http://localhost:3000";
const ACKI_TOKEN_KEY = "ackiToken";
const ACKI_ACCOUNT_KEY = "ackiAccount";

function getToken() {
  return localStorage.getItem(ACKI_TOKEN_KEY);
}

function getStoredAccount() {
  const storedAccount = localStorage.getItem(
    ACKI_ACCOUNT_KEY
  );

  if (!storedAccount) {
    return null;
  }

  try {
    return JSON.parse(storedAccount);
  } catch (error) {
    console.error(
      "Cannot read stored account:",
      error
    );

    localStorage.removeItem(ACKI_ACCOUNT_KEY);

    return null;
  }
}

function isLoggedIn() {
  return Boolean(getToken());
}

function saveLogin(token, account) {
  localStorage.setItem(
    ACKI_TOKEN_KEY,
    token
  );

  localStorage.setItem(
    ACKI_ACCOUNT_KEY,
    JSON.stringify(account)
  );
}

function logout() {
  localStorage.removeItem(ACKI_TOKEN_KEY);
  localStorage.removeItem(ACKI_ACCOUNT_KEY);

  window.location.href = "/page/login.html";
}

async function fetchCurrentAccount() {
  const token = getToken();

  if (!token) {
    return null;
  }

  const response = await fetch(
    `${ACKI_API_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (response.status === 401) {
    localStorage.removeItem(ACKI_TOKEN_KEY);
    localStorage.removeItem(ACKI_ACCOUNT_KEY);

    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Cannot load account"
    );
  }

  localStorage.setItem(
    ACKI_ACCOUNT_KEY,
    JSON.stringify(data)
  );

  return data;
}