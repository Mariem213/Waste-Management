document.getElementById("editProfileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const oldUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = { ...oldUser };

    updatedUser.name = document.getElementById("userName").value.trim();
    updatedUser.email = document.getElementById("userEmail").value.trim();
    updatedUser.gender = document.getElementById("userGender").value;
    updatedUser.phone = document.getElementById("userPhone").value.trim();
    updatedUser.address = document.getElementById("userAddress").value.trim();
    updatedUser.age = document.getElementById("userAge").value.trim();
    updatedUser.job = document.getElementById("userJob").value.trim();

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
