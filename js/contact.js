function sendContactMail() {
    const name =
        document.getElementById("contactName")?.value.trim() || "";

    const subject =
        document.getElementById("contactSubject")?.value || "Other";

    const message =
        document.getElementById("contactMessage")?.value.trim() || "";

    if (message === "") {
        alert(
            typeof t === "function"
                ? t(
                    "Please write your message first.",
                    "กรุณาเขียนข้อความก่อนนะครับ"
                )
                : "Please write your message first."
        );
        return;
    }

    const nameLabel =
        typeof t === "function" ? t("Name", "ชื่อ") : "Name";

    const anonymousText =
        typeof t === "function"
            ? t("Not provided", "ไม่ได้ระบุ")
            : "Not provided";

    const body =
        `${nameLabel}: ${name || anonymousText}\n\n${message}`;

    const mailtoUrl =
        `mailto:aekburut5740@gmail.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

    const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1` +
        `&to=aekburut5740@gmail.com` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");
}