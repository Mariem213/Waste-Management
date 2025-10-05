document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const visitCount = localStorage.getItem("visitCount") || 1;

    if (user) {
        document.getElementById("userName").textContent = user.name;
        document.getElementById("userEmail").textContent = user.email || "No email provided";
        document.getElementById("userGender").textContent = user.gender || "Not specified";
        document.getElementById("visitCount").textContent = visitCount;

        const color = user.color || "#ccc";
        const colorDiv = document.getElementById("userColor");
        colorDiv.style.backgroundColor = color;

        const userImage = document.getElementById("userImage");
        if (user.gender === "male") {
            userImage.src = "images/male-avatar.png";
        } else if (user.gender === "female") {
            userImage.src = "images/female-avatar.png";
        } else {
            userImage.src = "images/default-avatar.png";
        }
    } else {
        alert("No user data found! Redirecting to login...");
        window.location.href = "login.html";
    }

    // Edit button action
    document.getElementById("editBtn").addEventListener("click", () => {
        window.location.href = "edit-profile.html";
    });
});


window.onload = function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        document.getElementById("userName").textContent = user.name || "Unknown";
        document.getElementById("userEmail").textContent = user.email || "Not provided";
        document.getElementById("userGender").textContent = user.gender || "-";
        document.getElementById("userImage").src = user.image || "../images/default-avatar.png";
    }

    document.getElementById("editBtn").addEventListener("click", function () {
        window.location.href = "edit-profile.html";
    });
};
