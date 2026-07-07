// Contact page mailto form.

function sendContactMail() {
    const email = document.getElementById("contactEmail")?.value.trim() || "";
    const subject = document.getElementById("contactSubject")?.value || "Other";
    const message = document.getElementById("contactMessage")?.value.trim() || "";

    if (message === "") {
        alert(typeof t === "function" ? t("Please write your message first.", "กรุณาเขียนข้อความก่อนนะครับ") : "Please write your message first.");
        return;
    }

    const body = `${typeof t === "function" ? t("From", "จาก") : "From"}: ${email || (typeof t === "function" ? t("Not provided", "ไม่ได้ระบุ") : "Not provided")}\n\n${message}`;

    window.location.href =
        `mailto:aekburut5740@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
