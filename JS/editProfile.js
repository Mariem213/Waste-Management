// Load existing user data when page opens
window.onload = function () {
    const user = JSON.parse(localStorage.getItem("user")) || {};

    document.getElementById("userName").value = user.name || "";
    document.getElementById("userEmail").value = user.email || "";
    document.getElementById("userGender").value = user.gender || "";
};

// Handle Save
document.getElementById("editProfileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get the existing user data first
    const oldUser = JSON.parse(localStorage.getItem("user")) || {};

    // Create a copy so we don’t lose old fields (like password, visit count, etc.)
    const updatedUser = { ...oldUser };

    // Update only editable fields
    updatedUser.name = document.getElementById("userName").value.trim();
    updatedUser.email = document.getElementById("userEmail").value.trim();
    updatedUser.gender = document.getElementById("userGender").value;

    // Handle image update
    const fileInput = document.getElementById("userImage");
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            updatedUser.image = event.target.result;
            saveProfile(updatedUser);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveProfile(updatedUser);
    }
});

function saveProfile(user) {
    localStorage.setItem("user", JSON.stringify(user));
    alert("✅ Profile updated successfully!");
    window.location.href = "profile.html";
}
