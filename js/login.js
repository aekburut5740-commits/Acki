const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document
    .getElementById("email")
    .value
    .trim();

  const password = document
    .getElementById("password")
    .value;

  loginMessage.textContent = "";
  loginMessage.className = "form-message";

  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";

  try {
    const response = await fetch(`${ACKI_API_URL}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Cannot login"
      );
    }

    saveLogin(data.token, data.account);

    loginMessage.textContent = "Login successful";
    loginMessage.classList.add("success");

    setTimeout(() => {
      window.location.href = "community.html";
    }, 700);
  } catch (error) {
    loginMessage.textContent = error.message;
    loginMessage.classList.add("error");
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
});