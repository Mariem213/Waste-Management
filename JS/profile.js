document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        document.getElementById("userName").textContent = user.name || "Unknown";
        document.getElementById("userEmail").textContent = user.email || "Not provided";
        document.getElementById("userGender").textContent = user.gender || "-";
        document.getElementById("userPhone").textContent = user.phone || "Not added";
        document.getElementById("userAddress").textContent = user.address || "Not added";
        document.getElementById("userAge").textContent = user.age || "Not added";
        document.getElementById("userJob").textContent = user.job || "Not added";

        document.getElementById("coinCount").textContent = user.coins || 0;

        const userImage = document.getElementById("userImage");
        if (user.image) {
            userImage.src = user.image;
        } else if (user.gender === "Male") {
            userImage.src = "../images/male-avatar.png";
        } else if (user.gender === "Female") {
            userImage.src = "../images/female-avatar.png";
        } else {
            userImage.src = "../images/default-avatar.png";
        }
    } else {
        alert("No user data found! Redirecting to login...");
        window.location.href = "login.html";
    }

    document.getElementById("editBtn").addEventListener("click", () => {
        window.location.href = "edit-profile.html";
    });
});
