// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCgCqfrsAXoHwjeazTpVtd8XEUyK9mGcao",
    authDomain: "waste-management-95ebe.firebaseapp.com",
    projectId: "waste-management-95ebe",
    storageBucket: "waste-management-95ebe.appspot.com",
    messagingSenderId: "534711192041",
    appId: "1:534711192041:web:9d67edfdc61f0d5fe52378",
    measurementId: "G-3JV7GP67NR"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Load user data
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("You must log in first!");
        window.location.href = "login.html";
        return;
    }

    try {
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("userName").value = data.name || "";
            document.getElementById("userEmail").value = user.email;
            document.getElementById("userGender").value = data.gender || "";
            document.getElementById("userPhone").value = data.phone || "";
            document.getElementById("userAddress").value = data.address || "";
            document.getElementById("userAge").value = data.age || "";
            document.getElementById("userJob").value = data.job || "";
        } else {
            alert("No user data found in Firestore!");
        }
    } catch (error) {
        console.error("🔥 Error loading user data:", error);
        alert("❌ Failed to load user data.");
    }
});

// Handle Save Changes
document.getElementById("editProfileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert("No user logged in!");

    const uid = user.uid;
    const userRef = doc(db, "users", uid);

    // Read form fields
    const updatedData = {
        name: document.getElementById("userName").value.trim(),
        gender: document.getElementById("userGender").value,
        phone: document.getElementById("userPhone").value.trim(),
        address: document.getElementById("userAddress").value.trim(),
        age: document.getElementById("userAge").value.trim(),
        job: document.getElementById("userJob").value.trim(),
    };

    console.log("📤 Will update Firestore with:", updatedData);

    try {
        const fileInput = document.getElementById("userImage");

        // If there's an image, convert to Base64 first
        if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                updatedData.image = event.target.result;

                try {
                    await updateDoc(userRef, updatedData);
                    alert("✅ Profile updated successfully!");
                    window.location.href = "profile.html";
                } catch (error) {
                    console.error("🔥 Firestore update error:", error);
                    alert("❌ Failed to update profile. Check console for details.");
                }
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Update text fields only
            await updateDoc(userRef, updatedData);
            alert("✅ Profile updated successfully!");
            window.location.href = "profile.html";
        }
    } catch (error) {
        console.error("🔥 Firestore update error:", error);
        alert("❌ Failed to update profile. Please check console.");
    }
});
