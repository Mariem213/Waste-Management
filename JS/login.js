import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

console.log("login.js running");

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
const auth = getAuth(app);
const db = getFirestore(app);

/* ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM ready - attaching listeners");

    // Toggle between Login & Register
    document.querySelector('.overlay-btn').addEventListener('click', function () {
        document.querySelector('.cont').classList.toggle('s--signup');
    });

    /* ---------- Helper functions ---------- */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function isValidPassword(password) {
        return password.length >= 6;
    }
    function isValidName(name) {
        return /^[A-Za-z\s]{2,}$/.test(name);
    }

    /* ---------- REGISTER ---------- */
    document.getElementById("registerBtn").addEventListener("click", async function () {
        let name = document.getElementById("regName").value.trim();
        let email = document.getElementById("regEmail").value.trim();
        let password = document.getElementById("regPassword").value.trim();

        // Clear errors
        document.getElementById("regNameErr").textContent = "";
        document.getElementById("regEmailErr").textContent = "";
        document.getElementById("regPassErr").textContent = "";
        document.getElementById("regMsg").textContent = "";

        if (!isValidName(name)) {
            document.getElementById("regNameErr").textContent = "Enter a valid name (letters only).";
            return;
        }
        if (!isValidEmail(email)) {
            document.getElementById("regEmailErr").textContent = "Invalid email format.";
            return;
        }
        if (!isValidPassword(password)) {
            document.getElementById("regPassErr").textContent = "Password must be at least 6 characters.";
            return;
        }

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Save additional info in Firestore
            await setDoc(doc(db, "users", firebaseUser.uid), {
                name,
                email,
                gender: "",
                phone: "",
                address: "",
                age: "",
                job: "",
                coins: 0,
                image: ""
            });

            // Save safe user info locally
            const safeUser = { uid: firebaseUser.uid, name, email };
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(safeUser));
            localStorage.setItem("currentUserUID", firebaseUser.uid);

            document.getElementById("regMsg").textContent = "✅ Account created successfully! Redirecting...";
            document.getElementById("regMsg").className = "success";

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1000);

        } catch (error) {
            console.error("Register error:", error);
            let msg = "Error occurred during registration!";
            if (error.code === "auth/email-already-in-use") msg = "Email already registered!";
            document.getElementById("regMsg").textContent = msg;
            document.getElementById("regMsg").className = "error";
        }
    });

    /* ---------- LOGIN ---------- */
    document.getElementById("loginBtn").addEventListener("click", async function () {
        let email = document.getElementById("loginEmail").value.trim();
        let password = document.getElementById("loginPassword").value.trim();

        document.getElementById("loginEmailErr").textContent = "";
        document.getElementById("loginPassErr").textContent = "";
        document.getElementById("loginMsg").textContent = "";

        if (!isValidEmail(email)) {
            document.getElementById("loginEmailErr").textContent = "Invalid email format.";
            return;
        }
        if (!isValidPassword(password)) {
            document.getElementById("loginPassErr").textContent = "Password must be at least 6 characters.";
            return;
        }

        try {
            // Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Fetch user profile from Firestore
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);
            let userData = userSnap.exists() ? userSnap.data() : {};

            // Store local session
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify({ uid: firebaseUser.uid, ...userData }));
            localStorage.setItem("currentUserUID", firebaseUser.uid);

            document.getElementById("loginMsg").textContent = "✅ Login successful! Redirecting...";
            document.getElementById("loginMsg").className = "success";

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1000);

        } catch (error) {
            console.error("Login error:", error);
            let msg = "Invalid email or password!";
            if (error.code === "auth/wrong-password") msg = "Wrong password!";
            if (error.code === "auth/user-not-found") msg = "User not found!";
            document.getElementById("loginMsg").textContent = msg;
            document.getElementById("loginMsg").className = "error";
        }
    });
});

/* ---------- LOGOUT ---------- */
export async function firebaseLogout() {
    try {
        await signOut(auth);
    } catch (e) {
        console.warn("Firebase signOut error:", e);
    }
    localStorage.clear();
    window.location.href = "../index.html";
}
