document.addEventListener("DOMContentLoaded", () => {
    // 1. Load current user data
    const currentEmail = localStorage.getItem("currentUserEmail");
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = allUsers.find(u => u.email === currentEmail);

    if (!currentUser) {
        alert("No user data found! Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    // 2. Populate form fields with existing data
    document.getElementById("userName").value = currentUser.name || "";
    document.getElementById("userEmail").value = currentUser.email || "";
    document.getElementById("userGender").value = currentUser.gender || "";
    document.getElementById("userPhone").value = currentUser.phone || "";
    document.getElementById("userAddress").value = currentUser.address || "";
    document.getElementById("userAge").value = currentUser.age || "";
    document.getElementById("userJob").value = currentUser.job || "";
});

// 3. Handle form submission
document.getElementById("editProfileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentEmail = localStorage.getItem("currentUserEmail");
    const userIndex = allUsers.findIndex(u => u.email === currentEmail);

    if (userIndex === -1) {
        alert("User not found!");
        return;
    }

    const updatedUser = { ...allUsers[userIndex] }; // Copy old data

    updatedUser.name = document.getElementById("userName").value.trim();
    updatedUser.email = document.getElementById("userEmail").value.trim();
    updatedUser.gender = document.getElementById("userGender").value;
    updatedUser.phone = document.getElementById("userPhone").value.trim();
    updatedUser.address = document.getElementById("userAddress").value.trim();
    updatedUser.age = document.getElementById("userAge").value.trim();
    updatedUser.job = document.getElementById("userJob").value.trim();

    const fileInput = document.getElementById("userImage");

    // Handle image upload
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            updatedUser.image = event.target.result;
            saveUpdatedUser(allUsers, userIndex, updatedUser);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveUpdatedUser(allUsers, userIndex, updatedUser);
    }
});

// 4. Save updated user to localStorage
function saveUpdatedUser(allUsers, index, updatedUser) {
    allUsers[index] = updatedUser; // Update user in array
    localStorage.setItem("users", JSON.stringify(allUsers));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("currentUserEmail", updatedUser.email);

    alert("✅ Profile updated successfully!");
    window.location.href = "profile.html";
}
