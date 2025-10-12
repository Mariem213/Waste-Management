// Load existing user data when page opens
window.onload = function () {
    // const user = JSON.parse(localStorage.getItem("user")) || {};

    // 1. Load current user data
    const currentEmail = localStorage.getItem("currentUserEmail");
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = allUsers.find(u => u.email === currentEmail);

    if (!currentUser) {
        alert("No user data found! Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    // document.getElementById("userName").value = user.name || "";
    // document.getElementById("userEmail").value = user.email || "";
    // document.getElementById("userGender").value = user.gender || "";

    // 2. Populate form fields with existing data
    document.getElementById("userName").value = currentUser.name || "";
    document.getElementById("userEmail").value = currentUser.email || "";
    document.getElementById("userGender").value = currentUser.gender || "";
    document.getElementById("userPhone").value = currentUser.phone || "";
    document.getElementById("userAddress").value = currentUser.address || "";
    document.getElementById("userAge").value = currentUser.age || "";
    document.getElementById("userJob").value = currentUser.job || "";
};

// Handle Save
document.getElementById("editProfileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get the existing user data first
    // const oldUser = JSON.parse(localStorage.getItem("user")) || {};

    // Create a copy so we don’t lose old fields (like password, visit count, etc.)
    // const updatedUser = { ...oldUser };

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentEmail = localStorage.getItem("currentUserEmail");
    const userIndex = allUsers.findIndex(u => u.email === currentEmail);

    if (userIndex === -1) {
        alert("User not found!");
        return;
    }

    const updatedUser = { ...allUsers[userIndex] }; // Copy old data


    // Update only editable fields
    updatedUser.name = document.getElementById("userName").value.trim();
    updatedUser.email = document.getElementById("userEmail").value.trim();
    updatedUser.gender = document.getElementById("userGender").value;
    updatedUser.phone = document.getElementById("userPhone").value.trim();
    updatedUser.address = document.getElementById("userAddress").value.trim();
    updatedUser.age = document.getElementById("userAge").value;
    updatedUser.job = document.getElementById("userJob").value.trim();


    // Handle image update
    const fileInput = document.getElementById("userImage");
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            updatedUser.image = event.target.result;
            // saveProfile(updatedUser);
            saveUpdatedUser(allUsers, userIndex, updatedUser);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // saveProfile(updatedUser);
        saveUpdatedUser(allUsers, userIndex, updatedUser);
    }
});

// function saveProfile(user) {
//     localStorage.setItem("user", JSON.stringify(user));
//     alert("✅ Profile updated successfully!");
//     window.location.href = "profile.html";
// }

// 4. Save updated user to localStorage
function saveUpdatedUser(allUsers, index, updatedUser) {
    allUsers[index] = updatedUser; // Update user in array
    localStorage.setItem("users", JSON.stringify(allUsers));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("currentUserEmail", updatedUser.email);

    alert("✅ Profile updated successfully!");
    window.location.href = "profile.html";
}