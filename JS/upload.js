/* ===================================================================== */
/* ===================== Upload Photo ==================== */
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const successAlert = document.getElementById("successAlert");
const coinCount = document.getElementById("coinCount");

// Get current logged-in user
let user = JSON.parse(localStorage.getItem("user")) || {};
coinCount.textContent = user.coins || 0;

// Preview image
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.style.display = "block";
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = "none";
    }
});

// Upload logic with rewards
uploadBtn.addEventListener("click", function () {
    if (!imageInput.files.length) {
        alert("Please select an image first!");
        return;
    }

    uploadBtn.innerText = "Uploading...";
    uploadBtn.disabled = true;

    setTimeout(() => {
        uploadBtn.innerText = "Upload";
        uploadBtn.disabled = false;
        successAlert.style.display = "block";

        // Add coins to user object
        user.coins = (user.coins || 0) + 10;

        // Save back to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Also update in users array
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let idx = users.findIndex(u => u.email === user.email);
        if (idx !== -1) {
            users[idx].coins = user.coins;
            localStorage.setItem("users", JSON.stringify(users));
        }

        coinCount.textContent = user.coins;
        coinCount.classList.add("coins-animate");

        setTimeout(() => {
            coinCount.classList.remove("coins-animate");
            successAlert.style.display = "none";
        }, 2500);
    }, 1500);
});
