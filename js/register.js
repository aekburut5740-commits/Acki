const API_URL = "http://localhost:3000";

const registerForm = document.getElementById("register-form");
const registerButton = document.getElementById("register-button");
const registerMessage = document.getElementById("register-message");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const displayName = document
    .getElementById("display-name")
    .value
    .trim();

  const username = document
    .getElementById("username")
    .value
    .trim();

  const email = document
    .getElementById("email")
    .value
    .trim();

  const password = document
    .getElementById("password")
    .value;

  registerMessage.textContent = "";
  registerMessage.className = "form-message";

  registerButton.disabled = true;
  registerButton.textContent = "Creating account...";

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        displayName,
        username,
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Cannot create account");
    }

    registerMessage.textContent = "Account created successfully";
    registerMessage.classList.add("success");

    registerForm.reset();

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1200);
  } catch (error) {
    registerMessage.textContent = error.message;
    registerMessage.classList.add("error");
  } finally {
    registerButton.disabled = false;
    registerButton.textContent = "Create account";
  }
});