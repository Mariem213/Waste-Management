/* ===================================================================== */
/* ===================== Upload Photo ==================== */
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const successAlert = document.getElementById("successAlert");
const coinCount = document.getElementById("coinCount");

let coins = localStorage.getItem("coins") ? parseInt(localStorage.getItem("coins")) : 0;
coinCount.textContent = coins;

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
    if (imageInput.files.length === 0) {
        alert("Please select an image first!");
        return;
    }

    uploadBtn.innerText = "Uploading...";
    uploadBtn.disabled = true;

    setTimeout(() => {
        uploadBtn.innerText = "Upload";
        uploadBtn.disabled = false;
        successAlert.style.display = "block";

        // Add coins
        coins += 10;
        localStorage.setItem("coins", coins);
        coinCount.textContent = coins;
        coinCount.classList.add("coins-animate");

        // Remove animation + hide alert after a while
        setTimeout(() => {
            coinCount.classList.remove("coins-animate");
            successAlert.style.display = "none";
        }, 2500);
    }, 1500);
});