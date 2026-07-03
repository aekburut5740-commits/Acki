// Contact page mailto form.

function sendContactMail() {
    const email = document.getElementById("contactEmail")?.value.trim() || "";
    const subject = document.getElementById("contactSubject")?.value || "Other";
    const message = document.getElementById("contactMessage")?.value.trim() || "";

    if (message === "") {
        alert("Please write your message first.");
        return;
    }

    const body = `From: ${email || "Not provided"}\n\n${message}`;

    window.location.href =
        `mailto:aekburut5740@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
