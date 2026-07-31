function getAvatarColor(text) {

    const colors = [

        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#009688",
        "#4CAF50",
        "#FF9800",
        "#795548"

    ];

    if (!text) {

        return colors[0];

    }

    let hash = 0;

    for (let i = 0; i < text.length; i++) {

        hash += text.charCodeAt(i);

    }

    return colors[
        hash % colors.length
    ];

}

function setAvatar(element, account) {

    const initial =
        account?.displayName?.trim()?.charAt(0) ||
        account?.username?.trim()?.charAt(0) ||
        "?";

    element.innerHTML = "";

    let avatar =
        account?.avatarUrl?.trim();


    // ถ้าไม่มี avatar หรือเป็น null
    if (!avatar) {

        element.textContent =
            initial.toUpperCase();

        element.style.background =
            getAvatarColor(
                account.username ||
                account.displayName
            );

        return;
    }


    if (avatar.startsWith("/")) {

        avatar =
            ACKI_API_URL +
            avatar;

    }


    const img =
        document.createElement("img");


    img.src = avatar;

    img.alt =
        account.displayName ||
        account.username ||
        "Avatar";


    img.onerror = () => {

        element.innerHTML = "";

        element.textContent =
            initial.toUpperCase();

        element.style.background =
            getAvatarColor(
                account.username ||
                account.displayName
            );

    };


    element.appendChild(img);

}