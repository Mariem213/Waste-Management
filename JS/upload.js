/* ===================================================================== */
/* ===================== Upload Photo ==================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCgCqfrsAXoHwjeazTpVtd8XEUyK9mGcao",
    authDomain: "waste-management-95ebe.firebaseapp.com",
    projectId: "waste-management-95ebe",
    storageBucket: "waste-management-95ebe.appspot.com",
    messagingSenderId: "534711192041",
    appId: "1:534711192041:web:9d67edfdc61f0d5fe52378",
    measurementId: "G-3JV7GP67NR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const successAlert = document.getElementById("successAlert");
const coinCount = document.getElementById("coinCount");

// Get current logged-in user
let user = JSON.parse(localStorage.getItem("user")) || {};
const uid = localStorage.getItem("currentUserUID");

if (!uid) {
    alert("⚠️ No user logged in! Redirecting to login...");
    window.location.href = "login.html";
}

coinCount.textContent = user.coins || 0;

/* ========== Preview image ========== */
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

/* ========== Upload logic (1 upload per day) ========== */
uploadBtn.addEventListener("click", async function () {
    if (!imageInput.files.length) {
        alert("Please select an image first!");
        return;
    }

    const now = new Date();
    const lastUpload = user.lastUploadDate ? new Date(user.lastUploadDate) : null;

    if (lastUpload) {
        const diffInDays = (now - lastUpload) / (1000 * 60 * 60 * 24);
        if (diffInDays < 1) {
            const remainingHours = Math.ceil((1 - diffInDays) * 24);
            alert(`⏳ You can upload again after ${remainingHours} hour(s).`);
            return;
        }
    }

    uploadBtn.innerText = "Uploading...";
    uploadBtn.disabled = true;

    setTimeout(async () => {
        try {
            // Add 10 coins
            user.coins = (user.coins || 0) + 10;
            user.lastUploadDate = now.toISOString();

            // Update Firestore
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                coins: user.coins,
                lastUploadDate: user.lastUploadDate
            });

            // Update localStorage
            localStorage.setItem("user", JSON.stringify(user));

            coinCount.textContent = user.coins;
            successAlert.style.display = "block";
            coinCount.classList.add("coins-animate");

            setTimeout(() => {
                coinCount.classList.remove("coins-animate");
                successAlert.style.display = "none";
            }, 2500);

            alert("✅ Upload successful! You earned 10 coins!");
        } catch (error) {
            console.error("Error updating Firestore:", error);
            alert("❌ Failed to save data. Please try again later.");
        } finally {
            uploadBtn.innerText = "Upload";
            uploadBtn.disabled = false;
        }
    }, 1500);
});
