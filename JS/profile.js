import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", async () => {
    const uid = localStorage.getItem("currentUserUID");
    if (!uid) {
        alert("No user logged in! Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    try {
        // ---------- 1. Get user from Firestore ----------
        const userDocRef = doc(db, "users", uid);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) {
            alert("User data not found! Redirecting...");
            window.location.href = "login.html";
            return;
        }

        let user = userSnap.data();

        // ---------- 2. Try to merge Firestore data with localStorage ----------
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser && typeof localUser.coins === "number") {
            // use updated coins from localStorage if it's higher or different
            user.coins = localUser.coins;
        }

        // ---------- 3. Display user info ----------
        document.getElementById("userName").textContent = user.name || "Unknown";
        document.getElementById("userEmail").textContent = user.email || "Not provided";
        document.getElementById("userGender").textContent = user.gender || "-";
        document.getElementById("userPhone").textContent = user.phone || "Not added";
        document.getElementById("userAddress").textContent = user.address || "Not added";
        document.getElementById("userAge").textContent = user.age || "Not added";
        document.getElementById("userJob").textContent = user.job || "Not added";
        document.getElementById("coinCount").textContent = user.coins || 0;

        // ---------- 4. Profile Image ----------
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

        // ---------- 5. Edit button ----------
        document.getElementById("editBtn").addEventListener("click", () => {
            window.location.href = "edit-profile.html";
        });

        // ---------- 6. Save merged user back to localStorage ----------
        localStorage.setItem("user", JSON.stringify(user));

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error loading profile data.");
    }

    // ---------- Navbar Dashboard ----------
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const dashboardLink = document.getElementById("dashboardLink");
    if (dashboardLink) {
        dashboardLink.style.display = (currentUser && currentUser.role === "admin") ? "block" : "none";
    }

    const uploadLink = document.querySelector('a[href="upload.html"]')?.parentElement;
    if (uploadLink) {
        uploadLink.style.display = (currentUser && currentUser.role === "admin") ? "none" : "block";
    }

    // ---------- Coin Item ----------
    const coinCountEl = document.getElementById("coinCount");
    if (coinCountEl) {
        coinCountEl.parentElement.style.display = (currentUser && currentUser.role === "admin") ? "none" : "block";
    }

});
